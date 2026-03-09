import { MongoClient } from "mongodb";

export async function MapperDBClient() {
  const db = process.env.ENVIRONMENT == "dev" ? "dev" : "traveller"
  return (await new MongoClient(process.env.MAPPER_DB_STRING).connect()).db(db);
}

export async function TrackerDBClient() {
  const db = process.env.ENVIRONMENT == "dev" ? "dev" : "tracker"
  return (await new MongoClient(process.env.TRACKER_DB_STRING).connect()).db(db);
}