import { Firestore } from '@google-cloud/firestore'
import { createError } from '@fastro/core'

let firestore: Firestore

const getFirestore = (): Firestore => {
  if (!firestore) {
    firestore = new Firestore()
    return firestore
  }
  return firestore
}

/**
 * https://github.com/firebase/snippets-node/blob/66a6996b8fe75b2d52a7e8a94bb5df81e7aa37a7/firestore/main/index.js
 * https://googleapis.dev/nodejs/firestore/latest/index.html
 */
export abstract class BasicService {
  firestore = getFirestore()

  collection (collectionPath: string): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
    return this.firestore.collection(collectionPath)
  }

  async save <T> (collectionPath: string, payload: T): Promise<T> {
    const data: any = payload
    if (data.documentId) delete data.documentId
    const result = await this.collection(collectionPath).add(data)
    data.documentId = result.id
    return data as T
  }

  async update <T> (collectionPath: string, payload: T): Promise<T> {
    const p: any = payload
    if (!p.documentId) throw createError('UPDATE_SERVICE_ERROR', new Error('documentId empty'))
    const dataRef = this.collection(collectionPath).doc(p.documentId)
    delete p.documentId
    await dataRef.update(payload)
    const snapshot = await dataRef.get()
    const data: any = snapshot.data()
    data.documentId = snapshot.id
    return data as T
  }

  getOne<T> (snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): T {
    const [data] = snapshot.docs.map((documentSnapshot) => {
      const res = documentSnapshot.data()
      res.documentId = documentSnapshot.id
      return res
    })
    return data as T
  }

  getAll<T> (snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): T[] {
    const data: T[] = snapshot.docs.map((documentSnapshot) => {
      const res = documentSnapshot.data()
      res.documentId = documentSnapshot.id
      return res as T
    })
    return data
  }

  async delete (collectionPath: string, documentId: string): Promise<FirebaseFirestore.WriteResult> {
    return this.collection(collectionPath).doc(documentId).delete()
  }

  async deleteCollection (collectionPath: string, batchSize: number): Promise<any> {
    const collectionRef = this.collection(collectionPath)
    const query = collectionRef.orderBy('__name__').limit(batchSize)

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve, reject)
    })
  }

  private deleteQueryBatch (query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>, resolve, reject): void {
    query.get()
      .then((snapshot) => {
        if (snapshot.size === 0) {
          return 0
        }

        const batch = this.firestore.batch()
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })

        return batch.commit().then(() => {
          return snapshot.size
        })
      })
      .then((numDeleted) => {
        if (numDeleted === 0) {
          resolve()
          return
        }
        process.nextTick(() => {
          this.deleteQueryBatch(query, resolve, reject)
        })
      })
      .catch(reject)
  }
}
