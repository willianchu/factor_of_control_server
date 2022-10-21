import { MongoClient } from "mongodb";

let db;

async function connectToDB(cb) {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
  await client.connect();
  db = client.db('questionnaire-db');
  cb(); 
}

export { db, connectToDB };