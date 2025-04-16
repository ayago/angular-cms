import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env['MONGO_URI']!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function getPageContent(slug: string) {
  await client.connect();
  const db = client.db(process.env['DB_NAME']!);
  const page = await db.collection('pages').findOne({ slug });
  return page;
}
