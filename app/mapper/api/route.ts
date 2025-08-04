import { dbClient } from "@/lib/util/dbClient";
import { map } from "@/lib/util/types";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

}

// POST or PATCH headers: { map: JSON.stringify(props.map), pass: String(pass) }
// POST and PATCH are handled in this same component. For creating or updating maps, use POST on this API endpoint
export async function POST(req: NextRequest) {
  const map = req.headers.get("map")
  const pass = req.headers.get("pass")
  // Ensure required headers were provided
  if (!map || !pass) return NextResponse.json({ message: "missing map or password data" }, { status: 400 })
  let mapObject: map = JSON.parse(map)
  mapObject.pass = pass
  // If map has no ._id property, then it's a brand new map to be inserted instead of updated
  let newItem = false
  if (!mapObject._id) { mapObject._id = new ObjectId(); newItem = true; }
  try {
    // connect to maps collection in the database
    const client = await dbClient()
    const maps = client.collection("maps")
    // If map is new, create new db document, otherwise update db document
    if (newItem) {
      let result = await maps.insertOne(mapObject)
      if (result.insertedId) return NextResponse.json({ _id: String(mapObject._id) })
      else return NextResponse.json({ message: "failed to insert to db" }, { status: 500 })
    } else {
      let result = await maps.updateOne({ _id: mapObject._id, pass: pass }, mapObject)
      if (result.matchedCount) return NextResponse.json({ _id: String(mapObject._id) })
      else return NextResponse.json({ message: `no object found with id ${mapObject._id} or incorrect password` }, { status: 404 })
    }
    // On uncaught error from the try block, throw error
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}