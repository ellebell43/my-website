import { map, route, routeSegment } from "@/lib/util/types"
import StarSystem from "@/lib/util/starsystem"
import { useState } from "react"

type relevantSegments = { segments: routeSegment[], associatedRoute: string }
type allRelevantSegments = relevantSegments[]

export default function RouteInput(props: { map: map, setMap: Function, origin: { x: number, y: number } }) {
  const { map, setMap, origin } = props

  // Get all x,y coords of star systems in provided map (filter out empty parsecs)
  let systemsXY: { x: Number, y: Number }[] = []
  for (let i = 0; i < map.systems.length; i++) {
    if (map.systems[i] instanceof StarSystem) {
      systemsXY.push({ x: map.systems[i].x, y: map.systems[i].y })
    }
  }

  const allRelevantSegments: allRelevantSegments = []

  // iterate through all routes in a map (if routes exist)
  if (map.routes !== undefined) {
    for (let a = 0; a < map.routes?.length; a++) {
      let name = map.routes[a].name
      let segments: routeSegment[] = []
      // iterate through segments of a route and if it's relevant to the origin, add it to an array
      for (let b = 0; b < map.routes[a].segments.length; b++) {
        let currentSegment = map.routes[a].segments[b]
        if ((currentSegment.x1 === origin.x && currentSegment.y1 === origin.y) || (currentSegment.x2 === origin.x && currentSegment.y2 === origin.y)) { segments.push(map.routes[a].segments[b]) }
      }
      // push relevant route segments with associated route name to the allRelevantSegments array
      allRelevantSegments.push({ segments, associatedRoute: name })
    }
  }

  /** NOTES
   * - Get list of route segments that are relevant to the origin and associate them with a route name (color can easily be ascertained via route name)
   *    - State should have all map routes and an array for {relevantSegment[], associatedRoute}
   *    - When a segments color changes, the entire route color will change
   *    - When a segments name changes, the segment is removed from the associatedRoute and added to a different route that becomes an associatedRoute
   */

  return (<div>
    <h3 className="text-center mb-2 mt-4 border-b text-xl col-span-4">Routes</h3>
    <button className="border block mx-auto rounded px-4 py-2 hover:cursor-pointer dark:hover:bg-slate-700 hover:bg-gray-100">New Route Segment</button>

  </div>)

}