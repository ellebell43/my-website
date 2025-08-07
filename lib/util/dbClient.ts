import { MongoClient } from "mongodb";

export async function dbClient() {
  return (await new MongoClient(process.env.MAPPER_DB_STRING).connect()).db("traveller");
}