//loadtest -t 20 -c 100 -k  http://localhost:8181/performance/total?count=50000000
//loadtest --help - подсказки

import MongoConnection from "./MongoConnection.mjs";
import express from 'express'
import workerpool from 'workerpool'

// возвращает объект
const pool = workerpool.pool('./totalThread.mjs') //link to a file containing thread registration in pool

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
    // const startTime = new Date();
    const count = +req.query.count;
    pool.exec("total", [count], {
        on: payload => {
            if (payload.event == 'partition') {
                res.write(payload.data + '\n')
                console.log(payload.data);
            } else {
                res.end(JSON.stringify(payload.data))
            }
        }
    }) // total из totalThread (total: totalThread)
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