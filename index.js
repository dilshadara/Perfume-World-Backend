const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
  
        app.get('/perfume', async(req,res) =>{
            const query = {};
            const cursor = perfumeCollection.find(query);
            const perfumes=await cursor.toArray();
            res.send(perfumes);
        })
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