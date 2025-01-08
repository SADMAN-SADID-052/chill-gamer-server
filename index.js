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
    const watchlistCollection = client.db('reviewDB').collection('watchlist');

    // view all review->Read operation

    app.get('/review',async(req,res) => {

      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

//  view details
app.get("/review/:id", async (req, res) => {
  try {
    const id = req.params.id;
console.log("id",id)
  
    const query = {_id: new ObjectId(id)};

    
    const review = await reviewCollection.findOne(query);

    if (review) {
      return res.send(review);
    } 
  res.status(404).send({ message: "Review not found" });
  
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


//  My Reviews
  app.get('/review', async (req, res) => {
    try {
      const userEmail = req.query.email; 
      if (!userEmail) {
        return res.status(400).send({ message: "User email is required" });
      }

      const userReviews = await reviewCollection.find({ "email": userEmail }).toArray();
      res.send(userReviews);
    } catch (error) {
      console.log("Error fetching user reviews:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });


    // Delete a review
    app.delete('/review/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          return res.status(200).send({ success: true, message: "Review deleted successfully" });
        }
        res.status(404).send({ message: "Review not found" });
      } catch (error) {
        console.log("Error deleting review:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

      // Add to WatchList
      app.post('/watchlist', async (req, res) => {
        try {
          const { gameTitle, coverImage, genre, rating,publishingYear, reviewDescription,  addedBy } = req.body;
  
          if (!gameTitle || !coverImage || !genre || !rating || !reviewDescription || !addedBy) {
            return res.status(400).send({ message: "Missing required fields" });
          }
  
          const watchlistItem = {
            gameTitle,
            coverImage,
            genre,
            rating,
            publishingYear,
            reviewDescription,
            
            addedBy, 
            addedAt: new Date()
          };
  
          const result = await watchlistCollection.insertOne(watchlistItem);
          res.status(201).send({ success: true, data: result, message: "Added to WatchList" });
        } catch (error) {
          console.error("Error adding to watchlist:", error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      });

      // get watchlist

      app.get('/watchlist', async (req, res) => {
        try {
          const userEmail = req.query.email; // Email of the logged-in user
          if (!userEmail) {
            return res.status(400).send({ message: "User email is required" });
          }
      
          // Find watchlist items where addedBy.email matches the user's email
          const watchlistItems = await watchlistCollection.find({ "addedBy.email": userEmail }).toArray();
          res.status(200).send({ success: true, data: watchlistItems });
        } catch (error) {
          console.error("Error fetching watchlist:", error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      });
    

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

