import keys from './keys.js';
import redis from 'redis';


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000, //retry to connnect every 1sec
});

// to wtch redis for any new message
const sub = redisClient.duplicate();


const fib = (index) => {
    if (index < 2) return 1;
    let curr = 1;
    let prev = 1;
    let result = null;
    for(let i =2; i<= index; i++){
        result = curr+ prev;
        prev= curr;
        curr = result;
    }
    return result;
}

sub.on("message", (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
