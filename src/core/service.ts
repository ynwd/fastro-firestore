import { Firestore } from '@google-cloud/firestore'

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

  deleteCollection (collectionPath: string, batchSize: number): Promise<void> {
    const collectionRef = this.collection(collectionPath)
    const query = collectionRef.orderBy('__name__').limit(batchSize)

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve, reject)
    })
  }

  getData (snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): FirebaseFirestore.DocumentData {
    const [data] = snapshot.docs.map((documentSnapshot) => {
      const res = documentSnapshot.data()
      res.documentId = documentSnapshot.id
      return res
    })
    return data
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
