import { Controller, InjectService, Get, Post } from '@fastro/core'
import { UserService, User } from './user.service'
import { UserService1 } from './user1.service'
import { FastifyRequest, FastifyReply } from 'fastify'
import { Http2ServerResponse } from 'http2'

@Controller({ prefix: 'user' })
export class UserController {
  @InjectService(UserService)
  userService: UserService

  @InjectService(UserService1)
  userService1: UserService1

  @Get()
  async getAll (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<User[]> {
    const users = await this.userService.getAllUser()
    if (users.length === 0) reply.sendError(new Error('User not found'))
    return users
  }

  @Post()
  async register (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    const payload = request.body
    const user = await this.userService.addUser(payload)
    reply.sendOk(user)
  }

  @Get({ url: '/1' })
  async getAll1 (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<User[]> {
    const users = await this.userService1.getAllUser()
    if (users.length === 0) reply.sendError(new Error('User not found'))
    return users
  }

  @Post({ url: '/1' })
  async register1 (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    const payload = request.body
    const user = await this.userService1.addUser(payload)
    reply.sendOk(user)
  }

  @Get({ url: '/2' })
  async getAll2 (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<User[]> {
    const users = await this.userService1.getAllUser()
    if (users.length === 0) reply.sendError(new Error('User not found'))
    return users
  }

  @Post({ url: '/2' })
  async register2 (request: FastifyRequest, reply: FastifyReply<Http2ServerResponse>): Promise<void> {
    const payload = request.body
    const user = await this.userService1.addUser(payload)
    reply.sendOk(user)
  }
}
