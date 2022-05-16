const redis = require('redis');
const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
});

redisClient.on('error', err => {
  console.log('Error ' + err);
});

module.exports = {
    redisClient
}