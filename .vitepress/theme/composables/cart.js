import { loadStripe } from '@stripe/stripe-js';

const stripeKey = 'pk_live_51M1WfLBJnUXQERocrGtVUDvfIdzMmecoAClLVFLSi2VG2cNF2kS6bVsR4uUVtMYvusv4lkBMaDuOzgVJUuNMWndm00CVS3obG3'

export const cart = reactive({})

watch(cart, c => {
	if (Object.keys(cart).length <= 0) {
		open.value = false
	}
	for (let id in cart) {
		if (cart[id].quantity <= 0) {
			delete cart[id]
		}
	}
})

export const open = ref(false)

export const total = computed(() => {
	let sum = 0
	for (let id in cart) {
		sum += Number(cart?.[id]?.price) * Number(cart?.[id]?.quantity)
	}
	return sum
})


export function addToCart(title, product = {}) {
	const { id, price } = product
	if (cart[id]) {
		cart[id].quantity++
	} else {
		cart[id] = { title, price, quantity: 1 }
	}
	open.value = true
}

export async function checkout() {
	const stripe = await loadStripe(stripeKey);

	const lineItems = []

	for (let id in cart) {
		lineItems.push({
			price: id,
			quantity: cart[id].quantity
		})
	}

	lineItems.push({
		price: 'price_1M2c5LBJnUXQERocesvg8j1O',
		quantity: 1
	})

	const { error } = await stripe.redirectToCheckout({
		lineItems,
		mode: 'payment',
		successUrl: 'https://chromatone.center/success',
		cancelUrl: 'https://chromatone.center/cancel',
		shippingAddressCollection: { allowedCountries: ["AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"] }
	})
}

