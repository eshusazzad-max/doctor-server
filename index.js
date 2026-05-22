const express = require("express");

const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(express.json());

// MongoDB URI
const uri =
  "mongodb+srv://eshusazzad_db_user:TJupKAihwqZ0htcO@cluster0.9jzpqmv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Mongo Client
const client = new MongoClient(uri, {

  serverApi: {

    version: ServerApiVersion.v1,

    strict: true,

    deprecationErrors: true,

  },

});

// MongoDB Connection
async function run() {

  try {

    await client.connect();

    const appointmentsCollection =
      client.db("doctorDB").collection("appointments");

    console.log("MongoDB Connected ");

    // POST Appointment
    app.post("/appointments", async (req, res) => {

      const appointment = req.body;

      const result =
        await appointmentsCollection.insertOne(appointment);

      res.send(result);

    });

  } catch (error) {

    console.log(error);

  }

}

run();

// Test Route
app.get("/", (req, res) => {

  res.send("DocTime Server Running");

});

// Server Run
app.listen(port, () => {

  console.log(`Server running on port ${port}`);

});