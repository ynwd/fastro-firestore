import { Controller, Get } from '@fastro/core'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller()
export class HelloController {
  @Get()
  async hello (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    return reply.send('hello')
  }
}
