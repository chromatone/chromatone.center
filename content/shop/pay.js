import payment from './payment.json' assert { type: 'json' };

console.log(processOrder(payment))

function processOrder(event) {
  const obj = event.body.data.object
  const signature = event.headers['stripe-signature']

  const data = obj

  const result = { data, signature }
  return result
}