import { FastifyInstance } from 'fastify'
import { createServer } from '../../../core'
import { serviceContainer } from '@fastro/core'
import { UserService } from '../user.service'
import { UserService1 } from '../user1.service'
import { UserService2 } from '../user2.service'

let server: FastifyInstance
let service: UserService
let service1: UserService1
let service2: UserService2

beforeAll(async () => {
  server = await createServer({ logger: false })
  service = serviceContainer.get('UserService')
  service1 = serviceContainer.get('UserService1')
  service2 = serviceContainer.get('UserService2')
})

beforeEach(async () => {
  service.deleteAll()
  service1.deleteAll()
  service2.deleteAll()
})

afterAll(() => {
  server.close()
})

test('GET /user', async () => {
  const result = await server.inject({
    url: '/user',
    method: 'GET'
  })
  expect(result.payload).toBe('{"error":true,"message":"User not found"}')
})

test('GET /user/1', async () => {
  const result = await server.inject({
    url: '/user/1',
    method: 'GET'
  })
  expect(result.payload).toBe('{"error":true,"message":"User not found"}')
})

test('GET /user/2', async () => {
  const result = await server.inject({
    url: '/user/2',
    method: 'GET'
  })
  expect(result.payload).toBe('{"error":true,"message":"User not found"}')
})

test('POST /user', async () => {
  const result = await server.inject({
    url: '/user',
    method: 'POST',
    payload: {
      email: 'john@fastro.dev',
      username: 'zaid',
      password: 'secret'
    }
  })
  expect(result.statusCode).toBe(200)
})

test('POST /user/1', async () => {
  const result = await server.inject({
    url: '/user/1',
    method: 'POST',
    payload: {
      email: 'john@fastro.dev',
      username: 'zaid',
      password: 'secret'
    }
  })
  expect(result.statusCode).toBe(200)
})

test('POST /user/2', async () => {
  const result = await server.inject({
    url: '/user/2',
    method: 'POST',
    payload: {
      email: 'john@fastro.dev',
      username: 'zaid',
      password: 'secret'
    }
  })
  expect(result.statusCode).toBe(200)
})
