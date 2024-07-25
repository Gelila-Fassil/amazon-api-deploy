const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (isNaN(total) || total <= 0) {
    return res.status(400).json({
      message: "Total must be a number greater than 0",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    console.log(paymentIntent);
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running on PORT: 3000, http://localhost:3000");
});
