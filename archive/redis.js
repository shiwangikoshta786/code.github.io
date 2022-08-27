import { createClient } from 'redis';
import { promisify } from "util";

// redis connection:: start
const RedisClient = createClient({
    url: "redis://192.168.2.66:6379",
});

RedisClient.on('connect', () => {
    console.log('Redis client connected');
});

RedisClient.on("error", (error) => {
    console.error(error);
});
await RedisClient.connect();

// Promisify for Node.js
const hGetAll = promisify(RedisClient.hGetAll).bind(RedisClient);
const hSet = promisify(RedisClient.hSet).bind(RedisClient);
const Select = promisify(RedisClient.SELECT).bind(RedisClient);
const hGet = promisify(RedisClient.hGet).bind(RedisClient);
const sMembers = promisify(RedisClient.sMembers).bind(RedisClient);
const get = promisify(RedisClient.get).bind(RedisClient);
const set = promisify(RedisClient.set).bind(RedisClient);
const del = promisify(RedisClient.del).bind(RedisClient);
const hDel = promisify(RedisClient.hDel).bind(RedisClient);
const sAdd = promisify(RedisClient.sAdd).bind(RedisClient);
const sRem = promisify(RedisClient.sRem).bind(RedisClient);
const keys = promisify(RedisClient.keys).bind(RedisClient);
const incr = promisify(RedisClient.incr).bind(RedisClient);
const lRange = promisify(RedisClient.lRange).bind(RedisClient);
const rPush = promisify(RedisClient.rPush).bind(RedisClient);
const hIncrBy = promisify(RedisClient.hIncrBy).bind(RedisClient);
const ttl = promisify(RedisClient.ttl).bind(RedisClient);
const expire = promisify(RedisClient.expire).bind(RedisClient);



export default RedisClient;

// exporting  redis modules :: start
export {
    hGetAll,
    hSet,
    Select,
    expire,
    hGet,
    sMembers,
    get,
    set,
    del,
    hDel,
    sAdd,
    sRem,
    keys,
    incr,
    lRange,
    rPush,
    hIncrBy,
    ttl

}
// exporting redis modules :: ends