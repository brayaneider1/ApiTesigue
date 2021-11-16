const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
const admin = require('firebase-admin')
const app = express()

const stripe = new Stripe('sk_test_51JsKcvG0L7Mcv8rUfCRxplsvPa8QusifVjnMKwLWCCeZllyQTGXzFB4axP4SnXw7FNvpfMY0j96bdNLixVcGEKag00k78K431L')

var serviceAccount = require("./testfront-1f155-firebase-adminsdk-6f20f-23a26e99df.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testfront-1f155-default-rtdb.firebaseio.com/",
})


const db = admin.database()


app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.post('/api/checkout', async (req, res) => {
  try {
    const { id, amount } = req.body
    const response = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Subscription to Tesigue',
      payment_method: id,
      confirm: true
    })

    console.log('====================================');
    console.log(response);
    console.log('====================================');

    db.ref('payments').push(req.body)
    res.send(response)
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

