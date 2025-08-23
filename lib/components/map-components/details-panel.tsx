import { createGridIDString } from "@/lib/util/functions"
import StarSystem from "@/lib/util/starsystem"
import { EmptyParsec, map } from "@/lib/util/types"
import { faEdit, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useState } from "react"
import MDParse from "../md-parse"
import EditForm from "./edit-form"

export default function DetailsPanel(props: { system: StarSystem | EmptyParsec, setSystem: Function, setShowDetails: Function, editable: boolean, setMap: Function, map: map }) {
  let { system, setSystem, setShowDetails, editable, setMap, map } = props
  let [editMode, setEditMode] = useState(false)

  const getTerritory = () => {
    if (map.territories) {
      for (let i = 0; i < map.territories.length; i++) {
        if (map.territories[i].parsecs.findIndex(el => el.x === system.x && el.y === system.y) !== -1) return map.territories[i].name
      }
      return false
    } else {
      return false
    }
  }

  const getRoutes = () => {
    const arr: string[] = []
    if (map.routes) {
      for (let i = 0; i < map.routes.length; i++) {
        if (map.routes[i].segments.findIndex(el => (el.x1 === system.x && el.y1 === system.y) || (el.x2 === system.x && el.y2 === system.y)) !== -1) {
          const routeName = map.routes[i].name
          if (arr.findIndex(el => el == routeName) === -1) arr.push(routeName)
        }
      }
      return arr
    } else {
      return arr
    }
  }
  // if (!system) return <></>
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-white dark:bg-slate-800 opacity-75 z-50" />
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
        <div className="w-screen md:w-[650px] h-screen md:h-[850px] overflow-scroll opacity-100 bg-slate-100 dark:bg-slate-800 border rounded md:shadow-lg p-4 z-50 scale-100">

          {/* ========== DISPLAY MODE ========== */}

          {!editMode ?
            <div className="relative">
              {/* Title Area */}
              <div className="">
                <h2 className="text-center w-full font-bold text-xl mb-0">{system instanceof StarSystem ? `${system.getGridID()} ${system.name}` : `${createGridIDString(system.x, system.y)} Empty Parsec`}</h2>
                {system instanceof StarSystem ? <>
                  <p className="text-center w-full font-bold text-xl m-0">{system.getUWPSmall()}</p>
                  <p className="text-center w-full italic m-0">{system.facilities.toString().replaceAll(",", " ")} {system.getTradeCodes().toString().replaceAll(",", " ")} {system.travelCode}</p>
                </> : <></>}
                {/* Close panel button */}
                <Link
                  className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all absolute top-3 right-3 border rounded h-8 w-8 bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
                  href="#"
                  onNavigate={() => { if (typeof window !== undefined) window.location.hash = "" }}
                >
                  <FontAwesomeIcon icon={faX} />
                  <p className="absolute scale-0">Close details panel for {createGridIDString(system.x, system.y)}</p>
                </Link>
                {/* Edit button */}
                {editable ? <button onClick={() => setEditMode(true)} className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all absolute top-3 left-3 border rounded h-8 w-8 bg-slate-200 dark:bg-slate-700"><FontAwesomeIcon icon={faEdit} /><span className="absolute scale-0">Edit</span></button> : <></>}
              </div>

              {system instanceof EmptyParsec ?
                <div className="my-12">
                  <p className="m-0"><span className="font-bold">Territory</span>: {getTerritory() ? getTerritory() : "N/A"}</p>
                  <p className="m-0"><span className="font-bold">Routes</span>: {getRoutes().length > 0 ? getRoutes().toString().replaceAll(",", ", ") : "N/A"}</p>
                </div> : <></>}

              {system instanceof StarSystem ? <>
                {/* Starport and Trade */}
                <div className="border-b my-2 pb-2">
                  <p className="m-0"><span className="font-bold">Starport</span>: {system.getStarportQuality()} (Cr{system.getRandomBerthingCost()}; Fuel {system.getFuelType()})</p>
                  <p className="m-0"><span className="font-bold">Facilities</span>: {system.getFacilitiesArrayVerbose().length > 0 ? system.getFacilitiesArrayVerbose().toString().replaceAll(",", ", ") : "N/A"}</p>
                  <p className="m-0"><span className="font-bold">Bases</span>: {system.getBasesArrayVerbose().length > 0 ? system.getBasesArrayVerbose().toString().replaceAll(",", ", ") : "N/A"}</p>
                  <p className="m-0"><span className="font-bold">Trade Codes</span>: {system.getTradeCodesVerbose().length > 0 ? system.getTradeCodesVerbose().toString().replaceAll(",", ", ") : "N/A"}</p>
                  <p className="m-0"><span className="font-bold">Territory</span>: {getTerritory() ? getTerritory() : "N/A"}</p>
                  <p className="m-0"><span className="font-bold">Routes</span>: {getRoutes().length > 0 ? getRoutes().toString().replaceAll(",", ", ") : "N/A"}</p>
                </div>

                {/* Physical Characteristics */}
                <div className="border-b my-2 pb-2">
                  <p className="m-0"><span className="font-bold">Size</span>: {system.getDiameter()}km ({system.getGravity()}G)</p>
                  <p className="m-0"><span className="font-bold">Atmosphere</span>: {system.getAtmosphereType()}</p>
                  <p className="m-0"><strong>Temperature</strong>: {system.getTempType()}</p>
                  <p className="m-0"><span className="font-bold">Hydrographics</span>: {system.getHydroType()}</p>
                </div>

                {/* Social Characteristics */}
                <div className="border-b my-2 pb-2">
                  <p className="m-0"><span className="font-bold">Population</span>: {system.getPopType()}</p>
                  <p className="m-0"><span className="font-bold">Government</span>: {system.getGovernmentType(system.gov)}</p>
                  <p className="m-0"><span className="font-bold">Cultural Quirk</span>: {system.getCultureType()}</p>
                  <p className="m-0"><span className="font-bold">Law</span>: Level {system.law}</p>
                </div>
                {/* Factions */}
                <h3 className="text-center text-xl font-bold">Factions</h3>
                {system.getFactionArrayVerbose().map((el, i) => {
                  return (
                    <div key={`faction${i}`}>
                      <h4>Faction {i + 1}{el.name ? ` - ${el.name}` : ""}</h4>
                      <p className="text-sm italic m-0">{el.strength}, {el.gov} Group</p>
                      <MDParse content={el.details ? el.details : ""} />
                    </div>
                  )
                })}
                {/* System notes */}
                <h3 className="text-center text-xl font-bold">System Notes</h3>
                {system instanceof StarSystem ? <MDParse content={system.details ? system.details : ""} /> : <></>}
              </> : <></>}
            </div> :
            <>
              {/* ========== EDIT MODE ========== */}
              <EditForm system={system} setSystem={setSystem} setEditMode={setEditMode} setMap={setMap} map={map} />
            </>}
        </div>
      </div>
    </>
  )
}