const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')

const app = express()

const stripe = new Stripe('sk_test_51JsKcvG0L7Mcv8rUfCRxplsvPa8QusifVjnMKwLWCCeZllyQTGXzFB4axP4SnXw7FNvpfMY0j96bdNLixVcGEKag00k78K431L')

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
  try {
    const { id, amount } = req.body
    await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Subscription to Tesigue',
      payment_method: id,
      confirm: true
    })
    res.send({ message: 'Sucesfull payment' })
  } catch (error) {
    res.json({ message: error.raw.message })
  }

})

app.get('/', async (req, res) => {
  res.send('Hello motherfuckers')
})

app.listen(4000, () => {
  console.log('server on port ', 4000);
})

