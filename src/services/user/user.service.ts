import { BasicService } from '../../core'
import { Service } from '@fastro/core'

export type User = {
  documentId?: string;
  username: string;
  email: string;
  password: string;
}

@Service()
export class UserService extends BasicService {
  async addUser (payload: User): Promise<User> {
    return this.save<User>('user', payload)
  }

  async updateUser (payload: User): Promise<User> {
    return this.update<User>('user', payload)
  }

  async getAllUser (): Promise<User[]> {
    const snapshot = await this.collection('user').get()
    return this.getAll<User>(snapshot)
  }

  async getUser (username: string): Promise<User> {
    const snapshot = await this.collection('user')
      .where('username', '==', username)
      .limit(1)
      .get()
    return this.getOne<User>(snapshot)
  }

  async deleteUser (documentId: string): Promise<FirebaseFirestore.WriteResult> {
    return this.delete('user', documentId)
  }

  deleteAll (): void {
    this.deleteCollection('user', 50)
  }
}
