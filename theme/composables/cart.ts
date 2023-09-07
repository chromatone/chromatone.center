import { loadStripe } from '@stripe/stripe-js';
import { type RemovableRef, useStorage } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { ref, computed, reactive, watch } from 'vue'


const stripeKey = 'pk_live_51M1WfLBJnUXQERocrGtVUDvfIdzMmecoAClLVFLSi2VG2cNF2kS6bVsR4uUVtMYvusv4lkBMaDuOzgVJUuNMWndm00CVS3obG3'

export interface CartItem {
	id: string
	title: string
	path: string
	price: number
	quantity: number
	digital?: boolean

}

export interface Way { id: string, title: string, desc: string, price: number }

const MaxQuantity = 5

export const cartInitilized = ref(false)
export const open = ref(false)
export const cart: RemovableRef<Record<string, CartItem>> = useStorage('shopping-cart', {})


export const delivery: {
	current: string,
	selected: Way,
	needed: boolean,
	ways: Record<string, Way>
} = reactive({
	current: useStorage('delivery-way', 'regular'),
	selected: computed(() => delivery.ways[delivery.current]),
	needed: computed(() => {
		let need = false
		for (let row in cart.value)
			need = need || !cart.value[row].digital
		return need
	}),
	ways: {
		// default: {
		// 	id: 'price_1M2c5LBJnUXQERocesvg8j1O',
		// 	desc: "We deliver orders via international post. For $10 we send registered mail worldwide. And provide the code to track its 1-4 week journey. ",
		// 	price: 10,
		// },
		regular: {
			id: 'stamp',
			title: 'Regular post',
			desc: "The most straightforward way to send a letter to any place. Just glue on stamps and drop it into a mailbox nearby. Regular post is slower and less predictable, but still does it's job well. We'll send you a photo of the parcel before sending, but then expect up to a 3-4 weeks of wait with no clue about the progress.",
			price: 6,
		},
		registered: {
			id: 'parcel',
			title: 'Registered mail',
			desc: "Sending parcels with tracking numbers from Thailand is surprisingly costly. But it's more reliable and transparent as you and us can check the progress of the delivery. It usually takes about 2-3 weeks to ship.",
			price: 16
		}
	}
})

export const count = computed(() => {
	let all = 0
	for (let id in cart.value) {
		all += Number(cart.value?.[id]?.quantity)
	}
	return all
})

export const total = computed(() => {
	let sum = 0
	for (let id in cart.value) {
		sum += Number(cart.value?.[id]?.price) * Number(cart.value?.[id]?.quantity)
	}
	if (delivery.needed)
		sum += delivery?.selected?.price
	return sum
})

watch(cart, c => {
	if (Object.keys(c).length <= 0) {
		open.value = false
	}
	for (let id in c) {
		if (c[id].quantity <= 0) {
			delete cart.value[id]
		}
	}
}, { deep: true })



export function addToCart(title: string, product: CartItem) {
	const { id, price, digital, path } = product
	if (cart.value[id]) {
		cart.value[id].quantity++
	} else {
		cart.value[id] = { id, title, price, quantity: useClamp(1, 0, MaxQuantity).value, digital, path }
	}
	open.value = true
}

export async function checkout() {
	const stripe = await loadStripe(stripeKey);

	const lineItems = []

	for (let id in cart.value) {
		lineItems.push({
			price: id,
			quantity: cart.value[id].quantity
		})
	}
	// delivery
	if (delivery.needed) {
		lineItems.push({
			price: delivery.selected.id,
			quantity: 1
		})
	}

	try {
		await stripe?.redirectToCheckout({
			lineItems,
			mode: 'payment',
			successUrl: 'https://chromatone.center/shop/success.html',
			cancelUrl: 'https://chromatone.center/shop/cancel.html',
			shippingAddressCollection: delivery.needed ? { allowedCountries: allowedCountries() } : undefined
		})
	} catch (e) {
		alert('checkout failed')
	}
}

function allowedCountries() {
	return ["AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"]
}