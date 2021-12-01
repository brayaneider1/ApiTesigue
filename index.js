const express = require('express')
const Stripe = require('stripe')
const cors = require('cors')
const admin = require('firebase-admin')
const app = express()

const stripe = new Stripe('sk_test_51IXIrdEGW06CZVl3H0akMZ6vqjMPVNXvkgCUZKyd3M3LW6ufT5aAfBVkGzlnNbvgSaIBETm2nTNfKkp3uw56erf300CHVM9dN2')
 
var serviceAccount = require("./testfront-1f155-firebase-adminsdk-6f20f-23a26e99df.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://beu-link-default-rtdb.firebaseio.com/",
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

