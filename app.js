const express = require("express")
const bodyParser = require("body-parser")
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb")
const router = express.Router()
const app = express()
const uri = require("./secrets.js");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json()); // To parse JSON data
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


async function connectToMongoDB() {
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  }
connectToMongoDB();

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.get('/viewData',(req,res)=>{
    try{
        const db = client.db("people"); // Replace "mydatabase" with your actual database name
        const collection = db.collection("friends"); // Replace "users" with your collection name]
        const friendData = collection.find().toArray().then(result=>{res.status(200).json(result)})
    }
    catch(err){
        console.error("Error getting data from MongoDB:", err);
        res.status(500).json({ error: "Failed to get data" });
    }
})
app.get('/viewByFilter/:name',(req,res)=>{
    try{
        const db = client.db("people"); // Replace "mydatabase" with your actual database name
        const collection = db.collection("friends"); // Replace "users" with your collection name]
        console.log(req.params)
        const friendData = collection.find(req.params).toArray().then(result=>{res.status(200).json(result)})
    }
    catch(err){
        console.error("Error getting data from MongoDB:", err);
        res.status(500).json({ error: "Failed to get data" });
    }
})
app.post("/addData", async (req, res) => {
    try {

      console.log(req.body)
      const db = client.db("people"); // Replace "mydatabase" with your actual database name
      const collection = db.collection("friends"); // Replace "users" with your collection name

      const result = await collection.insertOne(req.body);
      console.log("Data added to MongoDB:", result.ops);

      res.status(200).json({ message: "Data added successfully" });
    } catch (err) {
      console.error("Error adding data to MongoDB:", err);
      res.status(500).json({ error: "Failed to add data" });
    }
  });

// Update a document in the collection
app.put("/updateBy/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, age, email } = req.body;
      console.log("id",id,typeof(id))
      console.log("name",name)
      const db = client.db("people"); // Replace "mydatabase" with your actual database name
      const collection = db.collection("friends"); // Replace "users" with your collection name

      const filter = { _id: new ObjectId(id) }; // Convert the 'id' to an ObjectId

      const updateDocument = {
        $set: {
          name: name,
          age: age,
          email: email,
        },
      };

      const result = await collection.updateOne(filter, updateDocument);

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Document updated successfully" });
      } else {
        res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  })
// Delete a document from the collection
app.delete("/deleteBy/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const db = client.db("people"); // Replace "mydatabase" with your actual database name
      const collection = db.collection("friends"); // Replace "users" with your collection name

      const filter = { _id: new ObjectId(id) }; // Use ObjectId with 'new'

      const result = await collection.deleteOne(filter);

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Document deleted successfully" });
      } else {
        res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  })

app.listen(8080,()=>{
    console.log("loading express.....")
})
