'use client'

import { DetailsPanel, Sector, Subsector } from "@/lib/components/map-components"
import StarSystem from "@/lib/util/starsystem"
import { map } from "@/lib/util/types"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function MapperMapClient(props: { map: map }) {
  let [map, setMap] = useState(props.map)
  const [screenReader, setScreenReader] = useState(false)
  let [details, setDetails] = useState<StarSystem>()
  const params = useParams()
  return (
    <div>
      {map.systems.length > 80 ? <Sector generateSystems={true} screenReader={screenReader} map={map} setMap={setMap} setDetails={setDetails} /> : <Subsector startX={1} startY={1} sector={false} generateSystems={true} screenReader={screenReader} map={map} setMap={setMap} setDetails={setDetails} />}
      {details ? <DetailsPanel system={details} setShowDetails={setDetails} /> : <></>}
    </div>
  )
}