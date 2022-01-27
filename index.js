const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const database = client.db('dream_trip');
        const usersCollection = database.collection('users');
        const allBlogsCollection = database.collection('allblogs');

        // Load all Blogs
        app.get('/allblogs', async (req, res) => {
            const cursor = allBlogsCollection.find({});
            const allblogs = await cursor.toArray();
            res.send(allblogs);
        });
        

// get a single blog
        app.get('/allblogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blog = await allBlogsCollection.findOne(query);
            res.json(blog);
        });
// add a single blog
        app.post('/allblogs', async (req, res) => {
            const blog = req.body;
            const result = await allBlogsCollection.insertOne(product);
            res.json(result);
        });

// delete a blog
        app.delete('/allblogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allBlogsCollection.deleteOne(query);
            res.json(result);
        });

// load user as admin or not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

// add an user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

// update user
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

// make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


        

    }
    finally {
        // Ensures that the client will close when you finish/error.
        // await client.close();
    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to DreamTrip!')
});

app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
});