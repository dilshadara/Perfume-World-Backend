const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { request } = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

//pass: KasS6UHF6nXS1UYI
//user:warehouse-db-user

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z0sbd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('warehouse db connected');
//   // perform actions on the collection object
//   client.close();
// });

async function run(){
    try{
        await client.connect();
        const perfumeCollection=client.db('warehouse').collection('perfume');
  
        //get all
        app.get('/perfume', async(req,res) =>{
            const query = {};
            const cursor = perfumeCollection.find(query);
            const perfumes=await cursor.toArray();
            res.send(perfumes);
        });

        //get perfume with id
        app.get('/perfume/:id', async(req,res) =>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            
            const perfume=await perfumeCollection.findOne(query);
            res.send(perfume);
        });

        //update perfume with id
        app.put('/perfume/:id',async(req,res) =>{
            const id=req.params.id;
            const updatedPerfumeQuantity=req.body;
            const filter={_id:ObjectId(id)};
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    quantity: updatedPerfumeQuantity.quantity
                },
              };

              const result = await perfumeCollection.updateOne(filter, updateDoc, options);
              res.send(result);
        });

        //delete perfume with id
        app.delete('/perfume/:id', async(req,res) => {
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result = await perfumeCollection.deleteOne(query);
            res.send(result);
        });

        //add new perfume
        app.post('/perfume',async(req,res) =>{
            const newPerfume=req.body;
            console.log('Adding new perfume', req.body);
            const result = await perfumeCollection.insertOne(newPerfume);
            res.send(result);
        });

        //get my items
        app.get('/myItems', async(req,res) =>{
               
            const email = req.query.email;
            
            const query={email:email};
            const cursor= perfumeCollection.find(query);
            const perfumes=await cursor.toArray();
            res.send(perfumes);
        });

    }
    finally{

    }

}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Warehouse CRUD server");
})

app.listen(port,() =>{
    console.log('Warehouse server is up and running');
})