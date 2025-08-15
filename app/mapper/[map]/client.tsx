'use client'

import { DetailsPanel, SaveMapButton, Sector, Subsector } from "@/lib/components/map-components"
import StarSystem from "@/lib/util/starsystem"
import { EmptyParsec, map } from "@/lib/util/types"
import { useHash } from "@/lib/util/useHash"
import { useSearchParams, useParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function MapperMapClient(props: { map: map }) {
  let params = useSearchParams()
  let [map, setMap] = useState(props.map)
  let [screenReader, setScreenReader] = useState(Boolean(params.get("screenReader")))
  let [systemDetails, setSystemDetails] = useState<StarSystem | EmptyParsec>(map.systems[0])
  let [showDetails, setShowDetails] = useState(false)

  const hash = useHash()

  useEffect(() => {
    if (hash) {
      const id = hash.split('#')[1];
      const x = Number(id.substring(0, 2))
      const y = Number(id.substring(2))
      let item = map.systems.find((el) => el.x === x && el.y === y)
      if (item) {
        // @ts-expect-error
        if (item.size !== undefined) {
          // @ts-expect-error
          const system = new StarSystem(item.x, item.y, item.name, item.starport, item.size, item.atmos, item.hydro, item.pop, item.gov, item.law, item.tech, item.travelCode, item.temp, item.factions, item.culture, item.facilities, item.details, item.gasGiant)
          setSystemDetails(system)
          setShowDetails(true)
        } else {
          const system = new EmptyParsec(item.x, item.y)
          setSystemDetails(system)
          setShowDetails(true)
        }
      }
    } else {
      setShowDetails(false)
    }
  }, [hash])

  return (
    <div>
      <button onClick={() => setScreenReader(!screenReader)} className="fixed bottom-6 left-6 border px-4 py-2 rounded shadow dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-gray-100 hover:cursor-pointer transition-all z-50">Screen Reader Toggle</button>
      {map.systems.length > 80 ?
        <Sector generateSystems={true} screenReader={screenReader} map={map} setMap={setMap} />
        : <Subsector startX={1} startY={1} sector={false} generateSystems={true} screenReader={screenReader} map={map} setMap={setMap} />
      }
      {showDetails ? <DetailsPanel system={systemDetails} setSystem={setSystemDetails} setShowDetails={setShowDetails} editable={true} setMap={setMap} map={map} /> : <></>}
      <SaveMapButton map={map} new={false} />
    </div>
  )
}