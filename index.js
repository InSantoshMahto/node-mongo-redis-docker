import { config } from 'dotenv'
import Fastify from 'fastify'
import mongodb from 'fastify-mongodb'
import redis from 'fastify-redis'
import { StatusCodes } from 'http-status-codes'

config()
const fastify = Fastify({ logger: true })

// register mongodb
fastify.register(mongodb, {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: process.env.MONGO_URI,
})

// register redis
fastify.register(redis, {
  host: process.env.REDIS_HOST,
})

fastify.get(
  '/',
  {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            pong: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    fastify.redis.get('hits', async (error, value) => {
      if (error) {
        reply.status(StatusCodes.BAD_REQUEST)
        return { error }
      }
      const hits = await fastify.mongo.db.collection('hits').find({}).toArray()
      return { hits }
    })
  }
)

const start = async () => {
  try {
    await fastify.listen(+process.env.PORT, process.env.HOST)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
