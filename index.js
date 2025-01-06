const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

// mongodb full code
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
 

    // db te pathano

    const reviewCollection = client.db('reviewDB').collection('review');

    // post korbo

    app.post('/review',async(req, res)=>{
      const newReview = req.body;
      console.log(newReview);

      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    })
    

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } 
      
      finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }

    }
    
    run().catch(console.dir);



app.get('/',(req, res) =>{

    res.send('Chill-gamer-server is running')
})

app.listen(port, () =>{
    console.log(`Chill gamer server is running on port : ${port}`)
})

