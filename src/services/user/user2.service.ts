import { BasicService } from '../../core'
import { Service } from '@fastro/core'

export type User = {
  documentId?: string;
  username: string;
  email: string;
  password: string;
}

@Service()
export class UserService2 extends BasicService {
  async addUser ({ username, email, password }): Promise<User> {
    const data: any = { email, username, password }
    const result = await this.collection('user').add(data)
    data.documentId = result.id
    return data as User
  }

  async getAllUser (): Promise<User[]> {
    const query = this.collection('user')
    const snapshot = await query.get()
    const data = snapshot.docs.map((documentSnapshot) => {
      const res = documentSnapshot.data()
      res.documentId = documentSnapshot.id
      return res as User
    })
    return data
  }

  async getUser (username: string): Promise<User> {
    const query = this.collection('user').where('username', '==', username).limit(1)
    const snapshot = await query.get()
    const [data] = snapshot.docs.map((documentSnapshot) => {
      const res = documentSnapshot.data()
      res.documentId = documentSnapshot.id
      return res as User
    })
    return data
  }

  async updateUser (documentId: string, payload: User): Promise<User> {
    const userRef = this.collection('user').doc(documentId)
    delete payload.documentId
    await userRef.update(payload)
    const snapshot = await userRef.get()
    const data = snapshot.data() as User
    data.documentId = snapshot.id
    return data
  }

  async deleteUser (documentId: string): Promise<FirebaseFirestore.WriteResult> {
    return this.collection('user').doc(documentId).delete()
  }

  deleteAll (): void {
    this.deleteCollection('user', 50)
  }
}
