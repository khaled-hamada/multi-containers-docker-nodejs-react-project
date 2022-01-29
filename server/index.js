import keys from "./keys.js";

//Express App Setup 
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

// postgress 
import pg from "pg";
// Redis
import redis from 'redis';


// Express App
const app =  express();
app.use(cors());
app.use(bodyParser.json());


// Postgress 
const { Pool } = pg;
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});

pgClient.on("connect",async (client) => {
    await client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch(err => console.log(err));
});


/// redis setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 10000
});

const redisPublisher = redisClient.duplicate();

//Express route handler
app.get('/', (req, res) => {
    res.send("Hello")
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');

    res.send(values.rows);
});

app.get('/values/current', async(req, res) => {
    redisClient.hgetall('values', (err, values) => {
        
        res.send(values);
    });
});

app.post('/values', async(req, res)=> {
    const index = req.body.index;
    if(parseInt(index) > 100000){
        return res.status(422).send("Index too high");
    }
    redisClient.hset('values', index, 'Nothing yet!');

    redisPublisher.publish('insert', index);
    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working : true});

});


// start express server
const port =5000;
app.listen(port, err=> {
    console.log(`listening on port: ${port} !`);
});