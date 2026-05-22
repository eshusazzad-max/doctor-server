const express = require("express");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

require("dotenv").config();

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(cookieParser());

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

    app.post("/jwt", async (req, res) => {

     const user = req.body;

     const token = jwt.sign(
      user,
      process.env.ACCESS_TOKEN_SECRET,
     {

       expiresIn: "1h",

     }
   );

   res.send({ token });

 });

    // POST Appointment
    app.post("/appointments", async (req, res) => {

      const appointment = req.body;

      const result =
        await appointmentsCollection.insertOne(appointment);

      res.send(result);

    });

    app.get("/appointments", async (req, res) => {

       const email = req.query.email;

        let query = {};

        if (email) {

          query = {

           userEmail: email,

          };

        }

       const result =
         await appointmentsCollection
          .find(query)
          .toArray();

       res.send(result);

      });

    app.delete("/appointments/:id", async (req, res) => {

       const id = req.params.id;

       const query = {

         _id: new ObjectId(id),

       };

       const result =
         await appointmentsCollection.deleteOne(query);

       res.send(result);

     });


     app.put("/appointments/:id", async (req, res) => {

       const id = req.params.id;

       const updatedAppointment = req.body;

       const query = {

          _id: new ObjectId(id),

      };

       const updateDoc = {

         $set: updatedAppointment,

      };

       const result =
         await appointmentsCollection.updateOne(
         query,
         updateDoc
      );

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