import { dbClient } from "@/lib/util/dbClient";
import { map } from "@/lib/util/types";
import { ObjectId } from "mongodb";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.headers.get("id")
  if (!id) return NextResponse.json({ message: "no map id provided" }, { status: 400 })
  try {
    let client = await dbClient()
    const maps = client.collection("maps")
    let result = await maps.findOne({ _id: new ObjectId(id) })
    // 404 NOT FOUND if no map matching the provided id is found
    if (!result) return NextResponse.json({ message: "no map found with provided id" }, { status: 404 })
    // 200 on map id match and send map to client
    return NextResponse.json(result)
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }

}

// POST or PATCH headers: { map: JSON.stringify(props.map), pass: String(pass) }
// POST and PATCH are handled in this same component. For creating or updating maps, use POST on this API endpoint
export async function POST(req: NextRequest) {
  const data = await req.json()
  const { map, pass } = data
  // 400 BAD REQUEST on missing map id or password
  if (!map || !pass) return NextResponse.json({ message: "missing map or password data" }, { status: 400 })
  // If map has no ._id property, then it's a brand new map to be inserted instead of updated
  let newItem = false
  if (!map._id) { map._id = new ObjectId(); newItem = true; }
  try {
    // connect to maps collection in the database
    const client = await dbClient()
    const maps = client.collection("maps")
    // If map is new, create new db document, otherwise update db document
    if (newItem) {
      let result = await maps.insertOne(map)
      // 200 on successful insertions
      if (result.insertedId) return NextResponse.json({ _id: String(map._id) })
      // 500 INTERNAL ERROR on failure to insert to db
      else return NextResponse.json({ message: "failed to insert to db" }, { status: 500 })
    } else {
      // 500 INTERNAL ERROR on system already has ._id property
      return NextResponse.json({ message: "Star system may already exists. System already has _id property" }, { status: 500 })
    }
    // On uncaught error from the try block, throw error
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const map = req.headers.get("map")
  const pass = req.headers.get("pass")
  // 400 BAD REQUEST on missing map id or password
  if (!map || !pass) return NextResponse.json({ message: "missing map or password data" }, { status: 400 })
  let mapObject: map = JSON.parse(map)
  mapObject.pass = pass
  try {
    // connect to maps collection in the database
    const client = await dbClient()
    const maps = client.collection("maps")
    console.log(`pass: ${pass}`)
    console.log(`id: ${mapObject._id}`)
    let result = await maps.updateOne({ _id: new ObjectId(mapObject._id), pass: pass }, { $set: { systems: mapObject.systems } })
    // 200 on successful update of map object in the db
    if (result.matchedCount) return NextResponse.json({ _id: String(mapObject._id) })
    // 404 NOT FOUND on no match with both password and map id
    else return NextResponse.json({ message: `no object found with id ${mapObject._id} or incorrect password` }, { status: 404 })
    // On uncaught error from the try block, throw error
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }

  //  // ======== this block should be moved to a PATCH endpoint ========
  //       let result = await maps.updateOne({ _id: mapObject._id, pass: pass }, mapObject)
  //       // 200 on successful update of map object in the db
  //       if (result.matchedCount) return NextResponse.json({ _id: String(mapObject._id) })
  //       // 404 NOT FOUND on no match with both password and map id
  //       else return NextResponse.json({ message: `no object found with id ${mapObject._id} or incorrect password` }, { status: 404 })
}