'use client'

import { GasGiant, MilitaryBase, NavalBase, Planet, ScoutBase } from "./symbols"
import StarSystem from "../util/starsystem"
import { createGridIDString, deHexify, determineIfSystem, hexify } from "../util/functions"
import { randomSystem } from "../util/randomSystem"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faMinus, faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons"
import { EmptyParsec, facilityCode, faction, fullRange, map } from "../util/types"
import crypto from "crypto"
import { useRouter } from "next/navigation"
import MDParse from "./md-parse"

// Create a single hex (parsec)
export const Hex = (props: { id: string, screenReader: boolean, possibleSystem?: boolean, style?: string, map: map, setMap: Function, setDetails: Function, setShowDetails: Function }) => {
  const { id, possibleSystem, screenReader } = props
  // split id into x,y values
  const x = Number(id.substring(0, 2))
  const y = Number(id.substring(2))
  // If a system might be generated, 50/50 on if one is created
  let system: StarSystem | EmptyParsec
  let hasSystem = determineIfSystem()
  const alreadyMapped = props.map.systems.find(el => el.x === x && el.y === y)
  if (!alreadyMapped) {
    let newMap = { ...props.map }
    //@ts-expect-error
    const newEntry: StarSystem | emptyParsec = possibleSystem && hasSystem ? randomSystem("", x, y) : new EmptyParsec(x, y)
    newMap.systems.push(newEntry)
    props.setMap(newMap)
    system = newEntry
  } else {
    //@ts-expect-error
    if (!(alreadyMapped.name === undefined)) {
      // @ts-expect-error
      system = new StarSystem(alreadyMapped.x, alreadyMapped.y, alreadyMapped.name, alreadyMapped.starport, alreadyMapped.size, alreadyMapped.atmos, alreadyMapped.hydro, alreadyMapped.pop, alreadyMapped.gov, alreadyMapped.law, alreadyMapped.tech, alreadyMapped.travelCode, alreadyMapped.temp, alreadyMapped.factions, alreadyMapped.culture, alreadyMapped.facilities, alreadyMapped.details, alreadyMapped.gasGiant)
    }
    else system = alreadyMapped
  }

  // determine if system POI has water or is asteroid to determine icon
  let water = system instanceof StarSystem ? system.hydro != 0 : false
  let asteroid = system instanceof StarSystem ? system.size == 0 : false
  let basesVerbose = system instanceof StarSystem && system.getBasesArrayVerbose().length > 0 ? system.getBasesArrayVerbose().toString().replaceAll(",", ", ") : "N/A"

  // screen reader "hex"
  const ScreenReaderHex = () =>
    <tr className={`border hover:cursor-pointer`} onClick={() => { props.setDetails(system); props.setShowDetails(true); }}>
      <td>{id}</td>
      <td>{system instanceof StarSystem ? system.name : ""}</td>
      <td>{system instanceof StarSystem ? system.getUWPSmall() : ""}</td>
      <td>{system instanceof StarSystem ? String(system.gasGiant) : ""}</td>
      <td>{system instanceof StarSystem ? basesVerbose : ""}</td>
    </tr>


  // visual hex
  const VisualHex = () =>
    <div
      className={`hexagon-out bg-black dark:bg-gray-100 relative flex justify-center items-center`}
      id={"hex" + props.id}
      onClick={() => { props.setDetails(system); props.setShowDetails(true); }}
    >
      <div className={`hexagon-in bg-white dark:bg-gray-800 flex flex-col items-center  justify-between hover: cursor-pointer`}>
        {/* Travel code ring */}
        <div className={`absolute right-[26px] top-[15px] rounded-full w-[120px] h-[120px] border-2 ${system instanceof StarSystem && system.travelCode == "A" ? "border-amber-300 dark:border-amber-500" : system instanceof StarSystem && system.travelCode == "R" ? "border-red-500 dark:border-red-700" : "border-white dark:border-slate-800"}`} />
        {/* Content container */}
        <div className="text-center relative">
          <p className="text-center text-sms">{props.id}</p>
          {system instanceof StarSystem ? <>
            {system.gasGiant ? <GasGiant /> : <></>}
            {system.facilities.includes("N") ? <NavalBase /> : <></>}
            {system.facilities.includes("M") ? <MilitaryBase /> : <></>}
            {system.facilities.includes("S") ? <ScoutBase /> : <></>}
            <p className="text-md font-bold m-0">{system.starport}</p>
            <Planet water={water} asteroid={asteroid} />
          </> : <></>}
        </div>
        {system instanceof StarSystem ? <>
          <p className="font-bold truncate text-center w-[110px] z-10 bg-white dark:bg-slate-800">{system.name}</p>
          <p className="text-xs text-center z-10">{system.getUWPSmall()}</p>
        </> : <></>}
      </div>
    </div>


  return (
    <>
      {screenReader ? <ScreenReaderHex /> : <VisualHex />}
    </>
  )
}

// Create a column of 10 hexes (height of a subsector)
const HexCol = (props: { id: string, start: number, screenReader: boolean, style?: string, possibleSystem?: boolean, map: map, setMap: Function, setDetails: Function, setShowDetails: Function }) => {
  const { id, start, style } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  // @ts-ignore
  for (let i = start; i < start + 10; i++) {
    const hexId = i < 10 ? "0" + String(i) : String(i)
    arr.push(<Hex key={id + hexId} id={id + hexId} possibleSystem={props.possibleSystem} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />)
  }
  // Map the array out in a div container
  if (props.screenReader) return (
    <>
      {arr.map((el, i) => {
        return el
      })}
    </>
  )
  else return (
    <div className={`${style}`} id={"col" + id + start}>
      {arr.map((el, i) => {
        return el
      })}
    </div>
  )
}

// Create a double column of 10 hexes, second column is offset for use in a larger scale grid
// id and start determines x,y label of the initial hex
const HexColDouble = (props: { id: number, start: number, screenReader: boolean, possibleSystem?: boolean, map: map, setMap: Function, setDetails: Function, setShowDetails: Function }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid

  if (props.screenReader) {
    return (
      <>
        <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} screenReader={true} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <HexCol id={id2} start={start} possibleSystem={props.possibleSystem} screenReader={true} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      </>
    )
  }
  return (
    <div className="relative w-[255px]">
      <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} screenReader={false} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <HexCol id={id2} start={start} possibleSystem={props.possibleSystem} screenReader={false} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} style="absolute top-[75px] left-[127px]" />
    </div>
  )
}

// Create a hex grid, 8 x 10 hexes
// startX and startY determines the x,y label for the first hex. All other hexes are based on that. Values are truncated to work within sector dimensions.
export const Subsector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31, generateSystems: boolean, screenReader: boolean, sector?: boolean, map: map, setMap: Function, setDetails: Function, setShowDetails: Function }) => {
  const { startX, startY, generateSystems, sector } = props

  const Map = () => (
    <div className="flex relative w-fit mx-auto">
      <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      {/* Border */}
      <div className={`absolute top-0 left-[.2in] w-full h-full border pointer-events-none`} />
    </div>
  )

  const MapForScreenReader = () => (
    <table className="mx-auto">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>UWP</th>
          <th>Gas Giant</th>
          <th>Bases</th>
        </tr>
      </thead>
      <tbody>
        <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      </tbody>
    </table>
  )

  // screen reader friendly subsectors
  // do not include local details panel if part of a sector
  if (props.screenReader && sector) return <MapForScreenReader />
  else if (props.screenReader && !sector) {
    return (
      <>
        <MapForScreenReader />
      </>
    )
  }
  // General subsectors
  // do not include local details panel if part of a sector
  else if (sector) return (<Map />)
  else {
    return (
      <Zoom>
        <div className="p-4 relative max-w-screen max-h-screen overflow-scroll">
          <Map />
        </div>
      </Zoom>
    )
  }
}

// Row of 4 subsectors
const SubsectorRow = (props: { row: 1 | 2 | 3 | 4, generateSystems: boolean, screenReader: boolean, map: map, setMap: Function, setDetails: Function, setShowDetails: Function }) => {
  const { row, generateSystems } = props
  //@ts-expect-error
  const y: 1 | 11 | 21 | 31 = (row - 1) * 10 + 1
  return (
    <div className={`flex relative`} id={`row${row}`}>
      <Subsector startX={1} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <Subsector startX={9} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <Subsector startX={17} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      <Subsector startX={25} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
    </div>
  )
}

// Create a full sector, 32 x 40 hex grid
export const Sector = (props: { generateSystems: boolean, screenReader: boolean, map: map, setMap: Function, setDetails: Function, setShowDetails: Function }) => {
  const { generateSystems } = props
  return (
    <div className="p-4 relative max-w-screen max-h-screen overflow-scroll">
      <Zoom>
        <SubsectorRow row={1} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <SubsectorRow row={2} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <SubsectorRow row={3} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
        <SubsectorRow row={4} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} setDetails={props.setDetails} setShowDetails={props.setShowDetails} />
      </Zoom>
    </div>
  )
}

// Details panel
export const DetailsPanel = (props: { system: StarSystem | EmptyParsec, setSystem: Function, setShowDetails: Function, editable: boolean, setMap: Function, map: map }) => {
  let { system, setSystem, setShowDetails, editable, setMap, map } = props
  let [editMode, setEditMode] = useState(false)
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
                <h2 className="text-center w-full font-bold text-xl">{system instanceof StarSystem ? system.getUWPBroken()[0] : `${createGridIDString(system.x, system.y)} Empty Parsec`}</h2>
                {system instanceof StarSystem ? <p className="text-center w-full font-bold text-xl">{system.getUWPBroken()[1]}</p> : <></>}
                {/* Close panel button */}
                <button className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all absolute top-3 right-3 border rounded h-8 w-8 bg-slate-200 dark:bg-slate-700" onClick={() => { setShowDetails(false) }}            >
                  <FontAwesomeIcon icon={faX} />
                  <p className="absolute scale-0">Close details panel for {createGridIDString(system.x, system.y)}</p>
                </button>
                {editable ? <button onClick={() => setEditMode(true)} className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all absolute top-3 left-3 border rounded h-8 w-8 bg-slate-200 dark:bg-slate-700"><FontAwesomeIcon icon={faEdit} /><span className="absolute scale-0">Edit</span></button> : <></>}
              </div>

              {system instanceof StarSystem ? <>
                {/* Starport and Trade */}
                <div className="border-b my-2 pb-2">
                  <p><span className="font-bold">Starport</span>: {system.getStarportQuality()} (Cr{system.getRandomBerthingCost()}; Fuel {system.getFuelType()})</p>
                  <p><span className="font-bold">Facilities</span>: {system.getFacilitiesArrayVerbose().length > 0 ? system.getFacilitiesArrayVerbose().toString().replaceAll(",", ", ") : "N/A"}</p>
                  <p><span className="font-bold">Bases</span>: {system.getBasesArrayVerbose().length > 0 ? system.getBasesArrayVerbose().toString().replaceAll(",", ", ") : "N/A"}</p>
                  <p><span className="font-bold">Trade Codes</span>: {system.getTradeCodesVerbose().length > 0 ? system.getTradeCodesVerbose().toString().replaceAll(",", ", ") : "N/A"}</p>
                </div>

                {/* Physical Characteristics */}
                <div className="border-b my-2 pb-2">
                  <p><span className="font-bold">Size</span>: {system.getDiameter()}km ({system.getGravity()}G)</p>
                  <p><span className="font-bold">Atmosphere</span>: {system.getAtmosphereType()}</p>
                  <p><strong>Temperature</strong>: {system.getTempType()}</p>
                  <p><span className="font-bold">Hydrographics</span>: {system.getHydroType()}</p>
                </div>

                {/* Social Characteristics */}
                <div className="border-b my-2 pb-2">
                  <p><span className="font-bold">Population</span>: {system.getPopType()}</p>
                  <p><span className="font-bold">Government</span>: {system.getGovernmentType(system.gov)}</p>
                  <p className="font-bold">Factions ({system.factions?.length})</p>
                  <p><span className="font-bold">Cultural Quirk</span>: {system.getCultureType()}</p>
                  <p><span className="font-bold">Law</span>: Level {system.law}</p>
                </div>
                {/* Factions */}
                <h3 className="text-center text-xl font-bold">Factions</h3>
                {system.getFactionArrayVerbose().map((el, i) => {
                  return (
                    <div key={`faction${i}`}>
                      <h4>Faction {i + 1}{el.name ? ` - ${el.name}` : ""}</h4>
                      <p className="text-sm italic">{el.strength}, {el.gov} Group</p>
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

const Zoom = (props: { children: React.ReactNode }) => {
  let [zoom, setZoom] = useState<1 | 2 | 3 | 4>(4)

  const newZoom = (up: boolean) => {
    let newZoom: 1 | 2 | 3 | 4 = zoom
    if (up && zoom < 4) newZoom++
    if (!up && zoom > 1) newZoom--
    //@ts-expect-error
    setZoom(newZoom)
  }
  return (
    <>
      <div className="fixed top-2 right-2 flex flex-col z-50">
        <button
          className={`border text-xs flex items-center justify-center ${zoom < 4 ? "bg-white dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-600"} h-[40px] w-[40px] hover:bg-gray-100 dark:hover:bg-gray-600 disabled:hover:bg-gray-200 dark:disabled:bg-gray-600 hover:cursor-pointer disabled:hover:cursor-auto`}
          onClick={() => newZoom(true)}
          disabled={zoom === 4}
        >
          <FontAwesomeIcon icon={faPlus} />
          <p className="scale-0 absolute">Increase Zoom</p>
        </button>
        <button
          className={`border text-xs flex items-center justify-center ${zoom > 1 ? "bg-white dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-600"} h-[40px] w-[40px] hover:bg-gray-100 dark:hover:bg-gray-600 disabled:hover:bg-gray-200 dark:disabled:bg-gray-600 hover:cursor-pointer disabled:hover:cursor-auto`}
          onClick={() => newZoom(false)}
          disabled={zoom === 1}
        >
          <FontAwesomeIcon icon={faMinus} />
          <p className="scale-0 absolute">Decrease Zoom</p>
        </button>
        <p className="border text-center text-[8px] bg-gray-200 dark:bg-gray-700">Zoom {zoom}</p>
      </div>
      <div className={`origin-top-left`} style={{ transform: `scale(${zoom === 4 ? "1" : zoom === 3 ? ".75" : zoom === 2 ? ".50" : ".25"})` }}>
        {props.children}
      </div>
    </>
  )
}

export const SaveMapButton = (props: { map: map, new: boolean, setSaveSuccess?: Function }) => {
  let [error, setError] = useState<string>()
  let [pass, setPass] = useState<string>()
  let router = useRouter()

  // const router = useRouter()

  async function saveMap() {
    let hashedPass = crypto.createHash("sha256").update(String(pass)).digest("hex")
    try {
      if (props.new) {
        console.log("attempting to save new map")
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", credentials: "include", method: "POST", body: JSON.stringify({ map: props.map, pass: hashedPass }) })
        if (!res.ok) {
          setError(`Failed to save. Error ${res.status}: ${res.statusText}`)
          return
        } else {
          const response: { _id: string } = await res.json()
          router.push(`/mapper/new?id=${response._id}&pass=${pass}`)
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "PATCH", body: JSON.stringify({ map: props.map, pass: hashedPass }), credentials: "include" })
        if (!res.ok) {
          if (res.status == 404) setError("Not saved. Incorrect Password")
          else setError(`Failed to save. Error  ${res.status}: ${res.statusText}`)
          return
        } else {
          if (props.setSaveSuccess) props.setSaveSuccess(true)
          else setError("Map saved!")
        }
      }
    } catch (error) {
      setError(String(error))
    }
  }

  return (
    <form className="fixed bottom-4 md:bottom-6 right-4 md:right-6 flex flex-col max-w-[175] " onSubmit={e => { e.preventDefault(); saveMap() }}>
      {/* If API error occurs, cover form with error message */}
      {error ?
        <div className="absolute top-0 left-0 bg-red-300 dark:bg-red-800 w-full h-full flex items-center justify-center overflow-y-scroll pt-4">
          <p className="text-center">{error}</p>
          {/* Dismiss error */}
          <button onClick={() => setError(undefined)} className="absolute top-0 right-0"><FontAwesomeIcon icon={faX} /><span className="absolute scale-0">Dismiss error</span></button>
        </div> : <></>}
      <h2 className="absolute scale-0">Save map</h2>
      {/* New password input. Used to GET map from database */}
      <input id="password " disabled={!(error === undefined || error === "")} onChange={e => setPass(e.target.value)} className="bg-white dark:bg-slate-700  disabled:bg-gray-100 disabled:dark:bg-slate-600 disabled:text-gray-500 disabled:dark:text-gray-400 border rounded-t-md px-2 py-1" placeholder="New password" type="text" />
      <label htmlFor="password" className="absolute scale-0">New password</label>
      {/* Submit map to database */}
      <button
        className="border rounded-b-md bg-white dark:bg-slate-700 px-4 py-2 text-lg shadow transition-all hover:cursor-pointer disabled:bg-gray-100 disabled:dark:bg-slate-600 disabled:text-gray-500 disabled:dark:text-gray-400 disabled:hover:cursor-auto hover:bg-gray-100 dark:hover:bg-slate-800"
        onClick={() => saveMap()}
        type="button"
        disabled={pass === undefined || pass === "" || !(error === undefined || error === "")}
      >
        {props.new ? "Save new map" : "Save"}
      </button>
    </form>
  )
}

const EditForm = (props: { system: StarSystem | EmptyParsec, setSystem: Function, setEditMode: Function, setMap: Function, map: map }) => {
  const { system, setSystem, setEditMode, map, setMap } = props
  let [hasSystem, setHasSystem] = useState(system instanceof StarSystem)
  let [name, setName] = useState(system instanceof StarSystem ? system.name : "")
  let [size, setSize] = useState(system instanceof StarSystem ? deHexify(system.size) : 0)
  let [atmos, setAtmos] = useState(system instanceof StarSystem ? deHexify(system.atmos) : 0)
  let [hydro, setHydro] = useState(system instanceof StarSystem ? deHexify(system.hydro) : 0)
  let [temp, setTemp] = useState<number>(system instanceof StarSystem ? system.temp : 7)
  let [pop, setPop] = useState(system instanceof StarSystem ? deHexify(system.pop) : 0)
  let [gov, setGov] = useState(system instanceof StarSystem ? deHexify(system.gov) : 0)
  let [law, setLaw] = useState<number>(system instanceof StarSystem ? system.law : 0)
  let [starport, setStarport] = useState(system instanceof StarSystem ? system.starport : "X")
  let [tech, setTech] = useState<number>(system instanceof StarSystem ? system.tech : 0)
  let [travelCode, setTravelCode] = useState(system instanceof StarSystem ? system.travelCode : "G")
  let [factions, setFactions] = useState(system instanceof StarSystem ? system.factions : [])
  let [culture, setCulture] = useState(system instanceof StarSystem ? system.culture : 11)
  let [facilities, setFacilities] = useState(system instanceof StarSystem ? system.facilities : [])
  let [details, setDetails] = useState(system instanceof StarSystem ? system.details : "")
  let [gasGiant, setGasGiant] = useState(system instanceof StarSystem ? system.gasGiant : false)

  const updateMap = () => {
    //@ts-expect-error
    const newSystem = new StarSystem(system.x, system.y, name, starport, hexify(size), hexify(atmos), hexify(hydro), hexify(pop), hexify(gov), law, tech, travelCode, temp, factions, culture, facilities, details, gasGiant)
    const newMap = { ...map }
    const i = map.systems.findIndex(e => e.x === system.x && e.y === system.y)
    newMap.systems[i] = hasSystem ? newSystem : new EmptyParsec(system.x, system.y)
    setMap(newMap)
    setSystem(hasSystem ? newSystem : undefined)
  }

  const randomize = () => {
    let newSystem: StarSystem = randomSystem(name, system.x, system.y)
    setSize(deHexify(newSystem.size))
    setHydro(deHexify(newSystem.hydro))
    setAtmos(deHexify(newSystem.atmos))
    setStarport(newSystem.starport)
    setPop(deHexify(newSystem.pop))
    setGov(deHexify(newSystem.gov))
    setLaw(deHexify(newSystem.law))
    setTech(newSystem.tech)
    setFactions(newSystem.factions)
    setTemp(newSystem.temp)
    setTravelCode(newSystem.travelCode)
    setCulture(newSystem.culture)
    setFacilities(newSystem.facilities)
    setDetails("")
  }

  const createNewFaction = () => {
    const newFaction: faction = { strength: 2, gov: 0 }
    let newArr = [...factions]
    newArr.push(newFaction)
    setFactions(newArr)
  }
  const removeFaction = (i: number) => {
    let newArr = [...factions]
    newArr.splice(i, 1)
    setFactions(newArr)
  }

  const updateFacilities = (fac: facilityCode) => {
    const newArr = [...facilities]
    if (newArr.findIndex(e => e === fac) !== -1) {
      newArr.splice(newArr.findIndex(e => e === fac), 1)
      setFacilities(newArr)
    } else {
      newArr.push(fac)
      setFacilities(newArr)
    }
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <h2 className="text-center text-2xl font-bold">Editing Parsec {createGridIDString(system.x, system.y)}</h2>
      <p className="text-center my-2">Does this parsec contain a star system?</p>
      <div className="flex gap-4 justify-center">
        <div className="flex gap-2">
          <input name="system" id="system" radioGroup="content" type="radio" checked={hasSystem} onChange={() => setHasSystem(!hasSystem)} />
          <label htmlFor="system">Contains System</label>
        </div>
        <div className="flex gap-2">
          <input name="empty" id="empty" radioGroup="content" type="radio" checked={!hasSystem} onChange={() => setHasSystem(!hasSystem)} />
          <label htmlFor="empty">Empty Parsec</label>
        </div>
      </div>
      {hasSystem ?
        <div>
          <button onClick={() => randomize()} className="block mx-auto border rounded px-4 py-1 my-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-700 hover:cursor-pointer transition-all">Randomize</button>
          <h3 className="text-center mb-2 border-b text-xl col-span-2">Base System Details</h3>
          <div className="grid md:grid-cols-[20%_80%] grid-cols-[35%_65%] gap-1">
            {/* Name input */}
            <label className="text-right pr-1" htmlFor="name">Name</label>
            <input className="border rounded px-2" placeholder="Name" type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />

            {/* Starport input */}
            <label htmlFor="starport" className="text-right pr-1">Starport</label>
            {/* @ts-expect-error */}
            <select className=" border rounded px-2" value={starport} name="starport" id="starport" onChange={e => setStarport(e.target.value)}>
              <option value="A">A - Excellent</option>
              <option value="B">B - Good</option>
              <option value="C">C - Routine</option>
              <option value="D">D - Poor</option>
              <option value="E">E - Frontier</option>
              <option value="X">X - None</option>
            </select>

            {/* Size input */}
            <label htmlFor="size" className="text-right pr-1">Size</label>
            <select className="border rounded px-2" value={size} name="size" id="size" onChange={e => setSize(Number(e.target.value))}>
              <option value="0">0 - &lt; 1,000km, 0G</option>
              <option value="1">1 - 1,600km, .05G</option>
              <option value="2">2 - 3,200km, .15G</option>
              <option value="3">3 - 4,800km, .25G</option>
              <option value="4">4 - 6,400km, .35G</option>
              <option value="5">5 - 8,000km, .45G</option>
              <option value="6">6 - 9,600km, .7G</option>
              <option value="7">7 - 11,200km, .9G</option>
              <option value="8">8 - 12,800km, 1G</option>
              <option value="9">9 - 14,400km, 1.25G</option>
              <option value="10">A - 16,000km, 1.4G</option>
            </select>

            {/* atmosphere input */}
            <label htmlFor="atmos" className="text-right pr-1">Atmosphere</label>
            <select className="border rounded px-2" value={atmos} name="atmos" id="atmos" onChange={e => setAtmos(Number(e.target.value))}>
              <option value="0">0 - None</option>
              <option value="1">1 - Trace</option>
              <option value="2">2 - Very thin, tainted</option>
              <option value="3">3 - Very thin</option>
              <option value="4">4 - Thin, tainted</option>
              <option value="5">5 - Thin</option>
              <option value="6">6 - Standard</option>
              <option value="7">7 - Standard, tainted</option>
              <option value="8">8 - Dense</option>
              <option value="9">9 - Dense, tainted</option>
              <option value="10">A - Exotic</option>
              <option value="11">B - Corrosive</option>
              <option value="12">C - Insidious</option>
              <option value="13">D - Very dense</option>
              <option value="14">E - Low</option>
              <option value="15">F - Unusual</option>
            </select>

            {/* Hydrographics input */}
            <label htmlFor="hydro" className="text-right pr-1">Hydrographics</label>
            <select className="border rounded px-2" value={hydro} name="hydro" id="hydro" onChange={e => setHydro(Number(e.target.value))}>
              <option value="0">0 - Desert world</option>
              <option value="1">1 - Dry world</option>
              <option value="2">2 - A few small seas</option>
              <option value="3">3 - Small seas and oceans</option>
              <option value="4">4 - Wet world</option>
              <option value="5">5 - A large ocean</option>
              <option value="6">6 - Large oceans</option>
              <option value="7">7 - Earth-like</option>
              <option value="8">8 - A few islands</option>
              <option value="9">9 - Almost entirely water</option>
              <option value="10">A - Waterworld</option>
            </select>

            {/* Population input */}
            <label htmlFor="pop" className="text-right pr-1">Population</label>
            <select className="border rounded px-2" value={pop} name="pop" id="pop" onChange={e => setPop(Number(e.target.value))}>
              <option value="0">0 - None</option>
              <option value="1">1 - A few</option>
              <option value="2">2 - Hundreds</option>
              <option value="3">3 - Thousands</option>
              <option value="4">4 - Tens of thousands</option>
              <option value="5">5 - Hundreds of thousands</option>
              <option value="6">6 - Millions</option>
              <option value="7">7 - Tens of millions</option>
              <option value="8">8 - Hundreds of millions</option>
              <option value="9">9 - Billions</option>
              <option value="10">A - Tens of billions</option>
            </select>

            {/* Government input */}
            <label htmlFor="gov" className="text-right pr-1">Government</label>
            <select className="border rounded px-2" value={gov} name="gov" id="gov" onChange={e => setGov(Number(e.target.value))}>
              <option value="0">0 - None</option>
              <option value="1">1 - Corporation</option>
              <option value="2">2 - Participating Democracy</option>
              <option value="3">3 - Self-Perpetuating Oligarchy</option>
              <option value="4">4 - Representative Democracy</option>
              <option value="5">5 - Feudal Technocracy</option>
              <option value="6">6 - Captive Government</option>
              <option value="7">7 - Balkanisation</option>
              <option value="8">8 - Civil Service Bureaucracy</option>
              <option value="9">9 - Impersonal Bureaucracy</option>
              <option value="10">A - Charismatic Dictator</option>
              <option value="11">B - Non-Charismatic Leader</option>
              <option value="12">C - Charismatic Oligarchy</option>
              <option value="13">D - Religious Dictatorship</option>
              <option value="14">E - Religious Autocracy</option>
              <option value="15">F - Totalitarian Oligarchy</option>
            </select>

            {/* Law input */}
            <label htmlFor="law" className="text-right pr-1">Law</label>
            <select className="border rounded px-2" value={law} name="law" id="law" onChange={e => setLaw(Number(e.target.value))}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>

            {/* Technology input */}
            <label htmlFor="tech" className="text-right pr-1">Technology</label>
            <select className="border rounded px-2" value={tech} name="tech" id="tech" onChange={e => setTech(Number(e.target.value))}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
            </select>
          </div>

          <p className="italic pt-2 text-center col-span-4">UWP: {name} {createGridIDString(system.x, system.y)} {starport}{hexify(size)}{hexify(atmos)}{hexify(hydro)}{hexify(pop)}{hexify(gov)}{law}-{tech}</p>

          <h3 className="text-center mb-2 mt-4 border-b text-xl col-span-4">Additional System Details</h3>

          <div className="grid md:grid-cols-[20%_80%] grid-cols-[35%_65%] gap-1">
            {/* Temperature input */}
            <label htmlFor="temp" className="text-right pr-1">Temperature</label>
            <select className="border rounded px-2" value={temp} name="temp" id="temp" onChange={e => setTemp(Number(e.target.value))}>
              <option value="2">Frozen (&lt; -50°)</option>
              <option value="4">Cold (-50° to 0°)</option>
              <option value="7">Temperate (0° to 30°)</option>
              <option value="11">Hot (30° to 80°)</option>
              <option value="12">Boiling (&gt; 80°)</option>
            </select>

            {/* Temperature Input */}

            {/* culture Input */}
            <label className="text-right" htmlFor="culture">Culture</label>
            {/* @ts-expect-error */}
            <select className="border rounded px-2" value={culture} onChange={(e) => setCulture(Number(e.target.value))} name="culture" id="culture" >
              <option value={11}>11 - Sexist</option>
              <option value={12}>12 - Religious</option>
              <option value={13}>13 - Artistic</option>
              <option value={14}>14 - Ritualized</option>
              <option value={15}>15 - Conservative</option>
              <option value={16}>16 - Xenophobic</option>

              <option value={21}>21 - Taboo</option>
              <option value={22}>22 - Deceptive</option>
              <option value={23}>23 - Liberal</option>
              <option value={24}>24 - Honorable</option>
              <option value={25}>25 - Influenced</option>
              <option value={26}>26 - Fusion</option>

              <option value={31}>31 - Barbaric</option>
              <option value={32}>32 - Remnant</option>
              <option value={33}>33 - Degenerate</option>
              <option value={34}>34 - Progressive</option>
              <option value={35}>35 - Recovering</option>
              <option value={36}>36 - Nexus</option>

              <option value={41}>41 - Tourist Attraction</option>
              <option value={42}>42 - Violent</option>
              <option value={43}>43 - Peaceful</option>
              <option value={44}>44 - Obsessed</option>
              <option value={45}>45 - Fashion</option>
              <option value={46}>46 - At War</option>

              <option value={51}>51 - Unusual custom around offworlders</option>
              <option value={52}>52 - Unusual custom around starport</option>
              <option value={53}>53 - Unusual custom around media</option>
              <option value={54}>54 - Unusual custom around lifecycle</option>
              <option value={55}>55 - Unusual custom around technology</option>
              <option value={56}>56 - Unusual custom around social standings</option>

              <option value={61}>61 - Unusual custom around trade</option>
              <option value={62}>62 - Unusual custom around nobility</option>
              <option value={63}>63 - Unusual custom around sex</option>
              <option value={64}>64 - Unusual custom around eating</option>
              <option value={65}>65 - Unusual custom around travel</option>
              <option value={66}>66 - Unusual custom around conspiracy</option>
            </select>
          </div>

          {/* Travel Code */}
          <p className="text-center underline mt-2">Travel Code</p>
          <div className="grid grid-cols-6 md:px-42 px-18">
            <label className="text-right pr-2" htmlFor="G">G</label>
            <input className="w-[15px] h-[15px] relative top-1" type="radio" radioGroup="travel-code" value="G" name="G" id="G" checked={travelCode === "G"} onChange={() => setTravelCode("G")} />
            <label className="text-right pr-2" htmlFor="A">A</label>
            <input className="w-[15px] h-[15px] relative top-1" type="radio" radioGroup="travel-code" value="A" name="A" id="A" checked={travelCode === String("A")} onChange={() => setTravelCode("A")} />
            <label className="text-right pr-2" htmlFor="R">R</label>
            <input className="w-[15px] h-[15px] relative top-1" type="radio" radioGroup="travel-code" value="R" name="R" id="R" checked={travelCode === "R"} onChange={() => setTravelCode("R")} />
          </div>

          {/* Gas giant input */}
          <div className="flex justify-center gap-4 mt-2">
            <label className="text-right" htmlFor="gas-giant">Gas Giant</label>
            <input type="checkbox" name="gas-giant" id="gas-giant" checked={gasGiant} onChange={() => setGasGiant(!gasGiant)} />
          </div>

          <h3 className="text-center mb-2 mt-4 border-b text-xl col-span-4">Facilities & Bases</h3>

          {/* Bases and Highport */}
          <div className="col-span-4 grid grid-cols-4 md:px-42 px-8">
            <label className="text-right pr-2" htmlFor="H">Highport</label>
            <input className="w-[15px] h-[15px] relative top-1" type="checkbox" value="H" name="H" id="H" checked={facilities.findIndex(e => e === "H") !== -1} onChange={() => updateFacilities("H")} />
            <label className="text-right pr-2" htmlFor="M">Military</label>
            <input className="w-[15px] h-[15px] relative top-1" type="checkbox" value="M" name="M" id="M" checked={facilities.findIndex(e => e === "M") !== -1} onChange={() => updateFacilities("M")} />
            <label className="text-right pr-2" htmlFor="N">Naval</label>
            <input className="w-[15px] h-[15px] relative top-1" type="checkbox" value="N" name="N" id="N" checked={facilities.findIndex(e => e === "N") !== -1} onChange={() => updateFacilities("N")} />
            <label className="text-right pr-2" htmlFor="S">Scout</label>
            <input className="w-[15px] h-[15px] relative top-1" type="checkbox" value="S" name="S" id="S" checked={facilities.findIndex(e => e === "S") !== -1} onChange={() => updateFacilities("S")} />
            <label className="text-right pr-2" htmlFor="C">Corsair</label>
            <input className="w-[15px] h-[15px] relative top-1" type="checkbox" value="C" name="C" id="C" checked={facilities.findIndex(e => e === "C") !== -1} onChange={() => updateFacilities("C")} />
          </div>



          {/* Factions Input */}
          <h3 className="text-center col-span-4 text-xl border-b my-2">Factions</h3>
          <div className="col-span-4">
            {factions.map((el, i) => {
              const updateStrength = (num: number) => {
                let newArr = [...factions]
                // @ts-expect-error
                newArr[i].strength = num
                setFactions(newArr)
              }

              const updateGov = (num: number) => {
                //@ts-expect-error
                const newGov: fullRange = hexify(num)
                let newArr = [...factions]
                newArr[i].gov = newGov
                setFactions(newArr)
              }

              const updateName = (name: string) => {
                let newArr = [...factions]
                newArr[i].name = name
                setFactions(newArr)
              }

              const updateDetails = (body: string) => {
                let newArr = [...factions]
                newArr[i].details = body
                setFactions(newArr)
              }
              return (
                <div key={`faction${i}`}>

                  <div className="flex justify-center gap-4">
                    <h3 className="text-center text-lg font-bold">Faction {i + 1}</h3>
                    <button onClick={() => removeFaction(i)} className="hover:scale-110 hover:cursor-pointer"><FontAwesomeIcon icon={faTrash} /><span className="absolute scale-0">Delete faction {i + 1}</span></button>
                  </div>

                  {/* Faction name input */}
                  <input className="border block w-[75%] md:w-[75%] mx-auto rounded col-span-4 px-2 my-2" placeholder="Faction name" type="text" id={`faction-${i}-name`} name={`faction-${i}-name`} value={el.name ? el.name : ""} onChange={e => updateName(e.target.value)} />

                  {/* Faction Strength input */}
                  <div className="col-span-4 grid md:grid-cols-[25%_75%] grid-cols-[35%_65%] gap-1 w-[75%] md:w-[75%] mx-auto">
                    <label htmlFor={`faction-${i}-strength`} className="text-right pr-2">Strength</label>
                    <select className="border rounded px-2" name={`faction-${i}-strength`} id={`faction-${i}-strength`} value={el.strength} onChange={e => updateStrength(Number(e.target.value))}>
                      <option value="2">Obscure</option>
                      <option value="4">Fringe</option>
                      <option value="6">Minor</option>
                      <option value="8">Notable</option>
                      <option value="10">Significant</option>
                      <option value="12">Overwhelming</option>
                    </select>

                    {/* Faction Government input */}
                    <label htmlFor={`faction-${i}-government`} className="text-right px-2">Government</label>
                    <select className="border rounded px-2" name={`faction-${i}-government`} id={`faction-${i}-government`} value={deHexify(el.gov)} onChange={e => updateGov(Number(e.target.value))}>
                      <option value="0">0 - None</option>
                      <option value="1">1 - Corporation</option>
                      <option value="2">2 - Participating Democracy</option>
                      <option value="3">3 - Self-Perpetuating Oligarchy</option>
                      <option value="4">4 - Representative Democracy</option>
                      <option value="5">5 - Feudal Technocracy</option>
                      <option value="6">6 - Captive Government</option>
                      <option value="7">7 - Balkanisation</option>
                      <option value="8">8 - Civil Service Bureaucracy</option>
                      <option value="9">9 - Impersonal Bureaucracy</option>
                      <option value="10">A - Charismatic Dictator</option>
                      <option value="11">B - Non-Charismatic Leader</option>
                      <option value="12">C - Charismatic Oligarchy</option>
                      <option value="13">D - Religious Dictatorship</option>
                      <option value="14">E - Religious Autocracy</option>
                      <option value="15">F - Totalitarian Oligarchy</option>
                    </select>
                  </div>

                  {/* faction details input */}
                  <textarea onChange={e => updateDetails(e.target.value)} value={el.details} className="my-2 mx-auto col-span-4 border w-[75%] block px-2 py-1" name={`faction-${i}-details`} placeholder="Faction summary" />
                </div>
              )
            })}
            {factions.length < 3 ?
              <button onClick={() => createNewFaction()} className="border block mx-auto rounded px-4 py-2 hover:cursor-pointer dark:hover:bg-slate-700 hover:bg-gray-100">Create Faction</button> : <></>}
          </div>
          <h3 className="text-center col-span-4 text-xl border-b my-2">System Notes</h3>
          <textarea className="block my-2 mx-auto col-span-4 border w-[75%] md:w-[60%] px-2 py-1" placeholder="System Notes" value={details} onChange={(e) => setDetails(e.target.value)} />
        </div> : <></>}
      <div className="flex justify-center gap-8">
        <button onClick={() => { setEditMode(false); setSystem(system) }} className="mt-4 border shadow py-1 px-4 rounded hover:opacity-75 hover:cursor-pointer bg-red-200 dark:bg-red-800">Cancel</button>
        <button onClick={() => { setEditMode(false); updateMap() }} className="mt-4 border shadow py-1 px-4 rounded hover:opacity-75 hover:cursor-pointer bg-green-200 dark:bg-green-800">Done</button>
      </div>
    </form>
  )
}