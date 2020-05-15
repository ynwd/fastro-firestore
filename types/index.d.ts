import { Firestore } from '@google-cloud/firestore'
import { FastifyInstance, FastifyServerOptions } from 'fastify'

export declare function createServer(fastifyOpts?: FastifyServerOptions): Promise<FastifyInstance>
export declare function start(server: FastifyInstance): Promise<void>

export declare abstract class BasicService {
  /**
   * firestore instance
   */
  public firestore: Firestore
  /**
   * Get collection
   * @param collectionPath
   */
  public collection (collectionPath: string): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
  /**
   * Delete collection
   * @param collectionPath
   * @param batchSize
   */
  public deleteCollection (collectionPath: string, batchSize: number): Promise<void>

  /**
   * Save document
   * @param collectionPath
   * @param payload
   */
  public save <T> (collectionPath: string, payload: T): Promise<T>
  /**
   * Update document
   * @param collectionPath
   * @param payload
   */
  public update <T> (collectionPath: string, payload: T): Promise<T>
  /**
   * Get one data
   * @param snapshot
   */
  public getOne<T> (snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): T
  /**
   * Get all data
   * @param snapshot
   */
  public getAll<T> (snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>): T[]
  /**
   * Delete document
   * @param collectionPath
   * @param documentId
   */
  public delete (collectionPath: string, documentId: string): Promise<FirebaseFirestore.WriteResult>
}
