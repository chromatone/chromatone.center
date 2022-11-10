// https://www.npmjs.com/package/vue-stripe-checkout/v/3.5.12
// https://github.com/vue-stripe/vue-stripe
// https://stripe.com/docs/js/element/payment_element
// https://github.com/ectoflow/vue-stripe-js


<template lang="pug">
StripeElements(
	v-if="stripeLoaded" 
	v-slot="{ elements, instance }" 
	ref="elms" :stripe-key="stripeKey" 
	:instance-options="instanceOptions" 
	:elements-options="elementsOptions"
	)
	StripeElement(ref="card" :elements="elements" :options="cardOptions" type="payment")
button(type="button" @click="pay")
	| Pay
</template>

<script>
import { StripeElements, StripeElement } from 'vue-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { defineComponent, ref, onBeforeMount } from 'vue'

export default defineComponent({
	name: 'CardOnly',

	components: {
		StripeElements,
		StripeElement,
	},

	setup() {
		const stripeKey = ref('pk_live_51M1WfLBJnUXQERocrGtVUDvfIdzMmecoAClLVFLSi2VG2cNF2kS6bVsR4uUVtMYvusv4lkBMaDuOzgVJUuNMWndm00CVS3obG3') // test key
		const instanceOptions = ref({
			// https://stripe.com/docs/js/initializing#init_stripe_js-options
		})
		const elementsOptions = ref({
			// https://stripe.com/docs/js/elements_object/create#stripe_elements-options
		})
		const cardOptions = ref({
			// https://stripe.com/docs/stripe.js#element-options
			value: {
				postalCode: '12345',
			},
		})
		const stripeLoaded = ref(false)
		const card = ref()
		const elms = ref()

		onBeforeMount(() => {
			const stripePromise = loadStripe(stripeKey.value)
			stripePromise.then(() => {
				stripeLoaded.value = true
			})
		})

		const pay = () => {
			// Get stripe element
			const cardElement = card.stripeElement

			// Access instance methods, e.g. createToken()
			elms.instance.createToken(cardElement).then((result) => {
				// Handle result.error or result.token
				console.log(result)
			})
		}

		return {
			stripeKey,
			stripeLoaded,
			instanceOptions,
			elementsOptions,
			cardOptions,
			card,
			elms,
			pay
		}
	},
})
</script>



