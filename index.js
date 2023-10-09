//loadtest -t 20 -c 100 -k  http://localhost:8181/performance/total?count=50000000

import MongoConnection from "./MongoConnection.mjs";
import express from 'express'

const port = process.env.PORT || 8181
const password = 'artem1234' //process.env.MONGO_PASSWORD
const uri = `mongodb+srv://root:${password}@cluster0.oinopsu.mongodb.net/college?retryWrites=true&w=majority`
const dbConnection = new MongoConnection(uri, 'college')
const studentsCollection = dbConnection.getCollection('studetns')

const app = express()
const server = app.listen(port)

server.on('listening', () => {
    console.log('start listening on port ' + port + '; process id: ' + process.pid);
})

app.get('/performance/total', (req, res) => {
    const startTime = new Date();
    const count = +req.query.count;
    let total = 0;
    for (let i = 0; i < count; i++) {
        total++;
    }
    res.send({ pid: process.pid, api: 'node', total, time: new Date().getTime() - startTime.getTime() })
})

app.get('/performance/students', async (req, res) => {
    const startTime = new Date();
    const students = await studentsCollection.find({}).toArray();
    res.send({
        pid: process.pid,
        api: 'node',
        total: students.length,
        time: new Date().getTime() - startTime.getTime(),
    });
});