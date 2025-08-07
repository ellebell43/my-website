'use client'

import { DetailsPanel, SaveMapButton, Sector, Subsector } from "@/lib/components/map-components"
import StarSystem from "@/lib/util/starsystem"
import { EmptyParsec, map } from "@/lib/util/types"
import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function MapperMapClient(props: { map: map }) {
  let params = useSearchParams()
  let [map, setMap] = useState(props.map)
  let [screenReader, setScreenReader] = useState(Boolean(params.get("screenReader")))
  let [systemDetails, setSystemDetails] = useState<StarSystem | EmptyParsec>(map.systems[0])
  let [showDetails, setShowDetails] = useState(false)
  return (
    <div>
      <button onClick={() => setScreenReader(!screenReader)} className="fixed bottom-6 left-6 border px-4 py-2 rounded shadow dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-gray-100 hover:cursor-pointer transition-all z-50">Screen Reader Toggle</button>
      {map.systems.length > 80 ?
        <Sector generateSystems={true} screenReader={screenReader} map={map} setMap={setMap} setDetails={setSystemDetails} setShowDetails={setShowDetails} />
        : <Subsector startX={1} startY={1} sector={false} generateSystems={true} screenReader={screenReader} map={map} setMap={setMap} setDetails={setSystemDetails} setShowDetails={setShowDetails} />
      }
      {showDetails ? <DetailsPanel system={systemDetails} setSystem={setSystemDetails} setShowDetails={setShowDetails} editable={true} setMap={setMap} map={map} /> : <></>}
      <SaveMapButton map={map} new={false} />
    </div>
  )
}