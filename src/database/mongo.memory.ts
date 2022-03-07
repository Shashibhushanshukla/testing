import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();
export const mongoUri = async () => await mongod.getUri();
