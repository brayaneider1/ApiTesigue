const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
const admin = require('firebase-admin')
const app = express()
require('dotenv').config()

const stripe = new Stripe(process.env.SK_STRIPE)

var serviceAccount = require("./testfront-1f155-firebase-adminsdk-6f20f-23a26e99df.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATA_BASE_FIREBASE,
})


const db = admin.database()


app.use(cors({ origin: '*' }))
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
  try {
    const { id, amount } = req.body
    const Amount = parseFloat(amount)
    const response = await stripe.paymentIntents.create({
      amount: Amount,
      currency: 'USD',
      description: 'Subscription to Tesigue',
      payment_method: id,
      confirm: true
    })

    db.ref('payments').push(req.body)
    res.send(response)
  } catch (error) {
    res.json({ message: error.raw.message })
  }

})

app.get('/', async (req, res) => {
  res.send('Hello motherfuckers')
})

app.listen(process.env.PORT, () => {
  console.log('server on port ', process.env.PORT);
})

