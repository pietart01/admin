const Redis = require('ioredis');
const { createPool } = require('generic-pool');

class RedisWrapper {
  constructor(poolOptions = {}, redisOptions = {}) {
    this.pool = createPool({
      create: () => {
        const client = new Redis({
          ...redisOptions,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          reconnectOnError: (err) => {
            const targetError = 'READONLY';
            if (err.message.includes(targetError)) {
              // Only reconnect when the error contains "READONLY"
              return true;
            }
            return false;
          },
        });

        client.on('error', (error) => {
          console.error('Redis client error:', error);
          // Implement additional error logging or monitoring here
        });

        return client;
      },
      destroy: (client) => client.quit(),
    }, {
      max: poolOptions.max || 50,
      min: poolOptions.min || 5,
      acquireTimeoutMillis: poolOptions.acquireTimeoutMillis || 5000,
      evictionRunIntervalMillis: poolOptions.evictionRunIntervalMillis || 5000,
      numTestsPerEvictionRun: poolOptions.numTestsPerEvictionRun || 3,
      idleTimeoutMillis: poolOptions.idleTimeoutMillis || 30000,
    });
  }

  async withClient(fn, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
      let client;
      try {
        client = await this.pool.acquire();
        return await fn(client);
      } catch (error) {
        if (client) {
          this.pool.release(client);
          client = null;
        }

        console.error(`Redis operation error (attempt ${retries + 1}/${maxRetries}):`, error);

        if (error.code === 'ECONNRESET' || error.name === 'TimeoutError') {
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 100; // Exponential backoff
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            console.error('Max retries reached. Operation failed.');
            throw error;
          }
        } else {
          throw error;
        }
      } finally {
        if (client) {
          this.pool.release(client);
        }
      }
    }
  }

  // Set a key-value pair in Redis
  async set(key, value, ttl = null) {
    return this.withClient(async (client) => {
      if (ttl) {
        return client.set(key, value, 'EX', ttl);
      }
      return client.set(key, value);
    });
  }

  // Get a value by key from Redis
  async get(key) {
    return this.withClient(async (client) => {
      return client.get(key);
    });
  }

  // Delete a key from Redis
  async delete(key) {
    return this.withClient(async (client) => {
      return client.del(key);
    });
  }

  // Add multiple key-value pairs using pipeline
  async bulkInsert(keyValuePairs, ttl = null) {
    return this.withClient(async (client) => {
      const pipeline = client.pipeline();

      for (const [key, value] of keyValuePairs) {
        if (ttl) {
          pipeline.set(key, value, 'EX', ttl);
        } else {
          pipeline.set(key, value);
        }
      }

      return pipeline.exec();
    });
  }

  async getMultipleValues(keys, parseJson = false) {
    return this.withClient(async (client) => {
      if (!keys || keys.length === 0) {
        return [];
      }

      const pipeline = client.pipeline();

      keys.forEach(key => {
        pipeline.get(key);
      });

      const results = await pipeline.exec();

      return results.map(([err, value], index) => {
        if (err) {
          console.error(`Error fetching value for key ${keys[index]}: ${err}`);
          return null;
        }
        if (parseJson && value) {
          try {
            return JSON.parse(value);
          } catch (parseErr) {
            console.error(`Error parsing JSON for key ${keys[index]}: ${parseErr}`);
            return null;
          }
        }
        return value;
      }).filter(value => value !== null);
    });
  }

  // List all key-value pairs in Redis (for debugging purposes)
  async listAllKeyValues() {
    return this.withClient(async (client) => {
      const keys = await client.keys('*');
      const pipeline = client.pipeline();
      keys.forEach(key => pipeline.get(key));
      const values = await pipeline.exec();
      const keyValues = keys.reduce((result, key, index) => {
        result[key] = values[index][1]; // values[index] is an array [err, value], so we access [1]
        return result;
      }, {});
      return keyValues;
    });
  }

  // Delete all key-value pairs in Redis
  async deleteAllKeyValues(confirmationKey = '') {
    return this.withClient(async (client) => {
      // Safety check: require a confirmation key
      const safetyKey = 'CONFIRM_DELETE_ALL';
      if (confirmationKey !== safetyKey) {
        throw new Error('Confirmation key does not match. Operation aborted for safety.');
      }

      // Get the number of keys before deletion
      const keyCount = await client.dbsize();

      // Use the FLUSHDB command to delete all keys
      await client.flushdb();

      // Get the number of keys after deletion
      const remainingKeys = await client.dbsize();

      return {
        deletedKeyCount: keyCount - remainingKeys,
        remainingKeyCount: remainingKeys
      };
    });
  }


  async addToZSet(prefix, ids) {
    if (!ids || ids.length === 0) {
      console.warn('No ids provided for addToZSet');
      return 0;
    }
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      const members = ids.flatMap(id => [id, id]); // Use id directly as both score and member
      return client.zadd(fullKey, ...members);
    });
  }

  async takeFromZSet(prefix, maxKey) {
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      const result = await client.zrangebylex(fullKey, '-', `[${maxKey}`);
      if (result.length > 0) {
        await client.zremrangebylex(fullKey, '-', `[${maxKey}`);
      }
      return result; // No need to remove leading zeros
    });
  }

  async getElementsGreaterThan(prefix, minKey, limit = 100) {
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      return client.zrangebylex(fullKey, `(${minKey}`, '+', 'LIMIT', 0, limit);
    });
  }

  async getSmallestElement(prefix) {
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      const result = await client.zrange(fullKey, 0, 0);
      if (result.length > 0) {
        return result[0].replace(/^0+/, '');
      }
      return null;
    });
  }

  async getZSetSize(prefix) {
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      return client.zcard(fullKey);
    });
  }

  async getZSetElements(prefix) {
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      const elements = await client.zrange(fullKey, 0, -1, 'WITHSCORES');
      return elements.reduce((acc, val, index, array) => {
        if (index % 2 === 0) {
          acc.push({
            member: val,
            score: array[index + 1]
          });
        }
        return acc;
      }, []);
    });
  }

  async removeAllFromZSet(prefix) {
    return this.withClient(async (client) => {
      const fullKey = `${prefix}`;
      return client.del(fullKey);
    });
  }

  async close() {
    await this.pool.drain();
    await this.pool.clear();
  }
}

// module.exports = RedisWrapper;


const redisConfig = {
  host: 'redis',
  port: 6379,
  // password: config.REDIS_CONFIG.password,
};

const poolOptions = {
  max: 10,
  min: 5,
  acquireTimeoutMillis: 5000,
};

const redisWrapper = new RedisWrapper(poolOptions, redisConfig);
module.exports.redisWrapper = redisWrapper;

