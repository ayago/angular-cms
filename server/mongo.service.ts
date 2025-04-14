import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'cms-db';

let client: MongoClient;

export async function getPageContent(slug: string) {
  client = client || await MongoClient.connect(uri);
  const db = client.db(dbName);
  const page = await db.collection('pages').findOne({ slug });
  return page;
}
