import { MongoClient } from "mongodb";

// mongodb://travellerDev:d74upScxxNR5N9Zf97CA@db.ellebell.dev:27017/?authsource=traveller

export async function dbClient() {
  return (await new MongoClient(process.env.MAPPER_DB_STRING).connect()).db("traveller");
}