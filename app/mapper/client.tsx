'use client'

import { useEffect, useState } from "react"
import { DetailsPanel, SaveMapButton, Sector, Subsector } from "../../lib/components/map-components"
import { EmptyParsec, map } from "../../lib/util/types"
import StarSystem from "@/lib/util/starsystem"
import { useHash } from "@/lib/util/useHash"

export default function MapperClient() {
  const [generateSystems, setGenerateSystems] = useState(true)
  const [isSector, setIsSector] = useState(false)
  const [prompt, setPrompt] = useState(true)
  const [screenReader, setScreenReader] = useState(false)
  const [map, setMap] = useState<map>({ systems: [] })
  const [systemDetails, setSystemDetails] = useState<StarSystem | EmptyParsec>(map.systems[0])
  const [showDetails, setShowDetails] = useState(false)

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

  // Component for selecting grid size (subsector vs sector) and if systems are generated
  const InitPrompt = () => {
    return (
      <div className="dark:bg-slate-900 bg-slate-100 min-h-screen min-w-scren">
        <h1 className="text-3xl font-bol text-center mb-2 py-8">Traveller Map Tool</h1>
        <form onSubmit={() => setPrompt(false)} className="bg-slate-100 dark:bg-slate-800 shadow border rounded w-fit mx-auto p-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center justify-start">
            <input type="checkbox" id="generate-systems" name="generate-systems" onChange={() => { setGenerateSystems(!generateSystems) }} checked={generateSystems} />
            <label htmlFor="generate-systems">Generate Systems</label>
          </div>
          <div className="flex gap-4 items-center justify-start">
            <input type="checkbox" id="screen-reader" name="screen-reader" onChange={() => { setScreenReader(!screenReader) }} checked={screenReader} />
            <label htmlFor="screen-reader">Screen Reader</label>
          </div>
          <div className="flex gap-4 justify-start items-center">
            <input type="radio" id="subsector" name="sector" onChange={() => { setIsSector(false) }} checked={!isSector} />
            <label htmlFor="subsector">Subsector (8 x 10)</label>
          </div>
          <div className="flex gap-4 justify-start items-center">
            <input type="radio" id="sector" name="sector" onChange={() => { setIsSector(true) }} checked={isSector} />
            <label htmlFor="sector">Sector (32 x 40)</label>
          </div>
          <button type="submit" className="border shadow rounded py-2 dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-gray-100 transition-all hover:cursor-pointer">Generate Map</button>
        </form>
      </div>
    )
  }

  if (prompt) return <InitPrompt />
  return (
    <div>
      {/* REGENERATE BUTTON */}
      <button className="button-link fixed top-6 left-6 z-50" onClick={() => setPrompt(true)}>Regenerate</button>
      <div className="overflow-y-scroll overflow-x-scroll">
        {isSector ?
          <Sector generateSystems={generateSystems} screenReader={screenReader} map={map} setMap={setMap} />
          : <Subsector generateSystems={generateSystems} startX={1} startY={1} sector={true} screenReader={screenReader} map={map} setMap={setMap} />
        }
      </div>
      {showDetails ? <DetailsPanel system={systemDetails} setSystem={setSystemDetails} setShowDetails={setShowDetails} editable={true} map={map} setMap={setMap} /> : <></>}
      <SaveMapButton map={map} new={true} />
    </div>
  )
}

