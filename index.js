const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const database = client.db('dreamTrip');
        const usersCollection = database.collection('users');
        const allBlogsCollection = database.collection('allblogs');

        // Load all Blogs
        app.get('/allblogs', async (req, res) => {
            const cursor = allBlogsCollection.find({});
            const allblogs = await cursor.toArray();
            res.send(allblogs);
        });

        

    }
    finally {
        // Ensures that the client will close when you finish/error.
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to DreamTrip!')
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});