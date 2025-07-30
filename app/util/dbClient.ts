import { MongoClient } from "mongodb";

export async function dbClient() {
  return (await new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?authsource=traveller`).connect()).db("traveller");
}