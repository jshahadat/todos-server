const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qhhqtot.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        const todosCollection = client.db('oldGolden').collection('todos');

        // ADD 
        app.post('/todos', async (req, res) => {
            const todos = req.body;
            const result = await todosCollection.insertOne(todos)
            res.send(result);
        })

        // GET 
        app.get('/todos', async (req, res) => {
            const query = {};
            const todos = await todosCollection.find(query).toArray();
            res.send(todos);
        });

        // EDIT 
        app.get('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const todo = await todosCollection.findOne(query);
            res.send(todo);
        })

        app.put('/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const todo = req.body;
            const option = { upsert: true };
            const updatedtodo = {
                $set: {
                    name: todo.name,
                    date: todo.date,
                }
            }
            const result = await todosCollection.updateOne(filter, updatedtodo, option);
            res.send(result);
        })



        // Complete 
        app.put('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'Complete'
                }
            }
            const result = await todosCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // DELETE  
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todosCollection.deleteOne(query);
            res.send(result);
        })

    }


    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('server is running ')
})

app.listen(port, () => console.log(`server is running ${port}`))