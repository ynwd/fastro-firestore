import { FastifyInstance, FastifyServerOptions } from 'fastify'
import {
  configuration as config,
  createError,
  createServer as createFastroServer
} from '@fastro/core'

/**
 * Create fastify server.
 * Check this for detail options: https://www.fastify.io/docs/latest/Server/
 * @param options - Fastify server options
 */
export const createServer = async (options?: FastifyServerOptions): Promise<FastifyInstance> => {
  return createFastroServer(options)
}

/**
 * Start server
 * @param server
 */
export const start = async (server: FastifyInstance): Promise<void> => {
  await server.ready()
  const configuration = config
  const host = configuration.app.host ? configuration.app.host : '0.0.0.0'
  const port = configuration.app.port ? configuration.app.port : 3000
  server.listen(port, host, (error: Error) => {
    console.info(configuration)
    console.info('Loading all modules finished')
    console.info(`Server running on ${host}:${port}`)
    if (error) {
      createError('START_SERVER_ERROR', error)
      process.exit(1)
    }
  })
}
