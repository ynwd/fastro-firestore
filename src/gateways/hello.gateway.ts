import { Gateway, InjectController } from '@fastro/core'
import { HelloController } from '../services/hello.controller'

@Gateway({ prefix: 'hello' })
export class WebGateway {
  @InjectController(HelloController)
  userController: HelloController
}
