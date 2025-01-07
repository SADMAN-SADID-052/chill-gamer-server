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

    // view all review->Read operation

    app.get('/review',async(req,res) => {

      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

//  new
app.get("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Convert id to ObjectId
    const query = { _id: new ObjectId(id) };

    // Fetch the review
    const review = await reviewCollection.findOne(query);

    if (review) {
      res.send(review);
    } else {
      res.status(404).send({ message: "Review not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


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

