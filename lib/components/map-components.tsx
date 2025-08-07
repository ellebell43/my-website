'use client'

import { GasGiant, MilitaryBase, NavalBase, Planet, ScoutBase } from "./symbols"
import StarSystem from "../util/starsystem"
import { clampToDiceRange, clampToFullRange, clampToLawRange, clampToTechRange, createGridIDString, deHexify, determineIfSystem, hexify, roll1D6, roll2D6 } from "../util/functions"
import { randomSystem } from "../util/randomSystem"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDice, faEdit, faHippo, faMinus, faPlus, faX } from "@fortawesome/free-solid-svg-icons"
import { diceRange, EmptyParsec, map, starportRange } from "../util/types"
import crypto, { hash } from "crypto"
import { useRouter } from "next/navigation"

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
        <div className={`absolute right-[26px] top-[15px] rounded-full w-[120px] h-[120px] border-2 dark:border-gray-800 ${system instanceof StarSystem && system.travelCode == "A" ? "border-amber-300" : system instanceof StarSystem && system.travelCode == "R" ? "border-red-500" : "border-white"}`} />
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
            <>
              {/* Title Area */}
              <div className="">
                <h2 className="text-center w-full font-bold text-xl">{system instanceof StarSystem ? system.getUWPBroken()[0] : `${createGridIDString(system.x, system.y)} Empty Parsec`}</h2>
                {system instanceof StarSystem ? <p className="text-center w-full font-bold text-xl">{system.getUWPBroken()[1]}</p> : <></>}
                {/* Close panel button */}
                <button className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all absolute top-3 right-3 border rounded h-8 w-8 bg-slate-200 dark:bg-slate-700" onClick={() => { setShowDetails(false) }}            >
                  <FontAwesomeIcon icon={faX} />
                  <p className="absolute scale-0">Close details panel for {createGridIDString(system.x, system.y)}</p>
                </button>
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
                  <p><span className="font-bold">Atmosphere</span>: {system.getAtmosphereType()} ({system.getTempType()})</p>
                  <p><span className="font-bold">Hydrographics</span>: {system.getHydroType()}</p>
                </div>

                {/* Social Characteristics */}
                <div className="border-b my-2 pb-2">
                  <p><span className="font-bold">Population</span>: {system.getPopType()}</p>
                  <p><span className="font-bold">Government</span>: {system.getGovernmentType(system.gov)}</p>
                  <p className="font-bold">Factions ({system.factions?.length})</p>
                  <ul className="list-disc list-outside pl-0">
                    {system.getFactionArrayVerbose().map((el, i) => {
                      return (
                        <li className="flex gap-2 ml-3" key={i}>
                          {/* <FontAwesomeIcon className="relative top-1" icon={faHippo} width={16} /> */}
                          {/* Bullet point. Can't get tailwind to work :( */}
                          <div className="bg-black dark:bg-white w-[6px] h-[6px] rounded-full relative top-[9px]" />
                          <div>
                            <p>{el.gov}, {el.strength} Group</p>
                            {el.details ? <p>{el.details}</p> : <></>}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  <p><span className="font-bold">Cultural Quirk</span>: {system.getCultureType()}</p>
                  <p><span className="font-bold">Law</span>: Level {system.law}</p>
                </div>
                <p>{system.details}</p></> : <></>}
              {editable ? <button onClick={() => setEditMode(true)} className="absolute bottom-4 right-4 hover:scale-110 transition-all hover:cursor-pointer"><FontAwesomeIcon icon={faEdit} /><span className="absolute scale-0">Edit</span></button> : <></>} </> : <>

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

  const generateHydro = () => {
    let num = roll2D6() - 7 + atmos
    if (size === 0 || size === 1) return 0
    if (atmos <= 1 || atmos >= 10) num -= 4
    if (temp >= 10 && temp < 12) num -= 2
    if (temp >= 12) num -= 6
    return clampToDiceRange(num)
  }

  const generateTemp = () => {
    let num = roll2D6()
    if (atmos === 2 || atmos === 3) return num -= 2
    if (atmos === 4 || atmos === 5 || atmos === 15) return num -= 1
    if (atmos === 8 || atmos === 9) return num += 1
    if (atmos === 10 || atmos === 14 || atmos === 16) return num += 2
    if (atmos === 11 || atmos === 12) return num += 6
    return clampToDiceRange(num)
  }

  const generateStarport = (): starportRange => {
    // starport
    let num = roll2D6()
    //Determine modifier and adjust number rolled
    if (pop <= 2) {
      num -= 2
    } else if (pop <= 4) {
      num -= 1
    } else if (pop >= 10) {
      num += 2
    } else if (pop >= 8) {
      num += 1
    }
    // Determine starport class from number
    let starport: starportRange
    if (num >= 11) {
      starport = "A"
    } else if (num >= 9) {
      starport = "B"
    } else if (num >= 7) {
      starport = "C"
    } else if (num >= 5) {
      starport = "E"
    } else if (num >= 3) {
      starport = "E"
    } else {
      starport = "X"
    }
    return starport
  }

  const generateTech = () => {
    // Tech level
    let tech: number = roll1D6()
    // Figure out modifiers based on other UWP values
    switch (starport) {
      case ("A"): tech += 6; break;
      case ("B"): tech += 4; break;
      case ("C"): tech += 2; break;
      case ("X"): tech -= 4; break;
    }

    if (size <= 1) tech += 2
    else if (size >= 2 || size <= 4) tech += 1

    if (atmos >= 1 && atmos <= 3 || atmos >= 10) tech += 1

    if (hydro === 0 || hydro === 9) tech += 1
    else if (hydro >= 10) tech += 2

    if (pop >= 1 && pop <= 5 || pop === 8) tech += 1
    else if (pop === 9) tech += 2
    else if (pop === 10) tech += 4

    if (gov === 0 || gov === 5) tech += 1
    else if (gov === 7) tech += 2
    else if (gov === 13 || gov === 14) tech -= 2

    if ((atmos <= 1 || atmos === 10 || atmos === 15) && tech < 8) tech = 8
    if ((atmos == 2 || atmos == 3 || atmos === 13 || atmos === 14) && tech < 5) tech = 5
    if ((atmos == 4 || atmos == 7 || atmos === 9) && tech < 3) tech = 3
    if (atmos === 11 && tech < 9) tech = 9
    if (atmos === 12 && tech < 10) tech = 10
    return clampToTechRange(tech)
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
          <div className="grid grid-cols-4 gap-1">
            <h3 className="text-center mb-2 mt-4 border-b text-xl col-span-4">Base System Details</h3>
            {/* Name input */}
            <label className="text-right" htmlFor="name">Name</label>
            <input className="border rounded col-span-2" placeholder="Name" type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
            <div />

            {/* Starport input */}
            <div className="col-span-4 grid grid-cols-3 md:px-42 px-32">
              <div className="col-span-3 flex justify-center gap-2 ">
                <p className="text-center underline">Starport Class</p>
                <button className="hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setStarport(generateStarport())}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">Generate starport for me</span></button>
              </div>
              <div className="flex gap-2 justify-center">
                <label htmlFor="A">A</label>
                <input type="radio" name="A" id="A" checked={starport === "A"} radioGroup="starport" onChange={e => setStarport("A")} />
              </div>
              <div className="flex gap-2 justify-center">
                <label htmlFor="B">B</label>
                <input type="radio" name="B" id="B" checked={starport === "B"} radioGroup="starport" onChange={e => setStarport("B")} />
              </div>
              <div className="flex gap-2 justify-center">
                <label htmlFor="C">C</label>
                <input type="radio" name="C" id="C" checked={starport === "C"} radioGroup="starport" onChange={e => setStarport("C")} />
              </div>
              <div className="flex gap-2 justify-center">
                <label htmlFor="D">D</label>
                <input type="radio" name="D" id="D" checked={starport === "D"} radioGroup="starport" onChange={e => setStarport("D")} />
              </div>
              <div className="flex gap-2 justify-center">
                <label htmlFor="E">E</label>
                <input type="radio" name="E" id="E" checked={starport === "E"} radioGroup="starport" onChange={e => setStarport("E")} />
              </div>
              <div className="flex gap-2 justify-center">
                <label htmlFor="X">X</label>
                <input type="radio" name="X" id="X" checked={starport === "X"} radioGroup="starport" onChange={e => setStarport("X")} />
              </div>
            </div>

            {/* Size input */}
            <label className="text-right" htmlFor="size">Size</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="size" id="size" min={0} max={10} value={size} onChange={e => setSize(Number(e.target.value) > 10 ? 10 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setSize(roll2D6() - 2)}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate size for me</span></button>

            {/* Atmosphere input */}
            <label className="text-right" htmlFor="atmosphere">Atmosphere</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="atmosphere" id="atmosphere" min={0} max={15} value={atmos} onChange={e => setAtmos(Number(e.target.value) > 15 ? 15 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setAtmos(clampToFullRange(roll2D6() - 7 + size))}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate atmosphere for me</span></button>

            {/* Hydrographics Input */}
            <label className="text-right" htmlFor="hydrographics">Hydrographics</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="hydrographics" id="hydrographics" min={0} max={10} value={hydro} onChange={e => setHydro(Number(e.target.value) > 10 ? 10 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setHydro(generateHydro())}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate hydrographics for me</span></button>

            {/* Population input */}
            <label className="text-right" htmlFor="population">Population</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="population" id="population" min={0} max={10} value={pop} onChange={e => setPop(Number(e.target.value) > 10 ? 10 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setPop(roll2D6() - 2)}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate population for me</span></button>

            {/* Government input */}
            <label className="text-right" htmlFor="government">Government</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="government" id="government" min={0} max={15} value={gov} onChange={e => setGov(Number(e.target.value) > 15 ? 15 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setGov(pop === 0 ? 0 : roll2D6() - 7 + pop)}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate government for me</span></button>

            {/* Law input */}
            <label className="text-right" htmlFor="law">Law Level</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="law" id="law" min={0} max={9} value={law} onChange={e => setLaw(Number(e.target.value) > 9 ? 9 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setLaw(clampToLawRange(gov === 0 ? 0 : roll2D6() - 7 + gov))}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate law for me</span></button>

            {/* tech level input */}
            <label className="text-right" htmlFor="technology">Technology</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="technology" id="technology" min={0} max={15} value={tech} onChange={e => setTech(Number(e.target.value) > 15 ? 15 : Number(e.target.value) < 0 ? 0 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setTech(generateTech())}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate technology for me</span></button>

            <p className="italic pt-2 text-center col-span-4">UWP: {name} {createGridIDString(system.x, system.y)} {starport}{hexify(size)}{hexify(atmos)}{hexify(hydro)}{hexify(pop)}{hexify(gov)}{law}-{tech}</p>
          </div>

          <div className="grid grid-cols-4 gap-1">
            <h3 className="text-center mb-2 mt-4 border-b text-xl col-span-4">Additional System Details</h3>
            {/* Gas giant input */}
            <label className="text-right" htmlFor="gas-giant">Gas Giant</label>
            <input type="checkbox" name="gas-giant" id="gas-giant" checked={gasGiant} onChange={() => setGasGiant(!gasGiant)} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all col-span-2" onClick={() => setGasGiant(roll2D6() < 10)}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate gas giant for me</span></button>

            {/* Temperature Input */}
            <label className="text-right" htmlFor="temperature">Temperature</label>
            <input className="border rounded col-span-2 pl-1" type="number" name="temperature" id="temperature" min={2} max={12} value={temp} onChange={e => setTemp(Number(e.target.value) > 12 ? 12 : Number(e.target.value) < 2 ? 2 : Number(e.target.value))} />
            <button className="text-left hover:cursor-pointer hover:scale-110 transition-all" onClick={() => setTemp(generateTemp())}><FontAwesomeIcon icon={faDice} /><span className="absolute scale-0">generate temperature for me</span></button>

            {/* Factions Input */}
            <h4 className="text-center col-span-4 text-lg underline">Factions</h4>
            <div className="col-span-4">
              {factions.map((el, i) => {
                const updateStrength = (num: diceRange) => {
                  let newArr = [...factions]
                  newArr[i].strength = num
                  setFactions(newArr)
                }
                const updateName = (name: string) => {
                  let newArr = [...factions]
                  newArr[i].name = name
                  setFactions(newArr)
                }
                return (
                  <div key={`faction${i}`} className="grid grid-cols-4">

                    <label htmlFor={`faction-${i}-name`} className="col-span-1 text-right pr-2 font-bold">Faction {i + 1}</label>
                    <input className="border rounded col-span-2 px-2" placeholder="Faction name" type="text" id={`faction-${i}-name`} name={`faction-${i}-name`} value={el.name ? el.name : ""} onChange={e => updateName(e.target.value)} />
                    <button></button>
                    {/* Faction Strength */}
                    <label htmlFor={`faction-${i}-strength`} className="text-right pr-2 relative top-1">Strength</label>
                    <div className="col-span-3">
                      <input
                        className="border rounded justify-self-start pl-2 mb-6 mt-1"
                        type="number" name={`faction-${i}-strength`} id={`faction-${i}-strength`}
                        min={2} max={12}
                        value={el.strength}
                        //  @ts-expect-error
                        onChange={e => { updateStrength(Number(e.target.value) < 2 ? 2 : Number(e.target.value) > 12 ? 12 : Number(e.target.value)) }}
                      />
                      {/* Faction Government */}
                      <label htmlFor={`faction-${i}-government`} className="text-right px-2">Government</label>
                      <input
                        className="border rounded justify-self-start pl-2 mb-6 mt-1"
                        type="number" name={`faction-${i}-government`} id={`faction-${i}-government`}
                        min={2} max={12}
                        value={el.gov}
                        //  @ts-expect-error
                        onChange={e => { updateStrength(Number(e.target.value) < 2 ? 2 : Number(e.target.value) > 12 ? 12 : Number(e.target.value)) }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div> : <></>}
      <div className="flex justify-center gap-8">
        <button onClick={() => { setEditMode(false); setSystem(system) }} className="mt-4 border shadow py-1 px-4 rounded hover:opacity-75 hover:cursor-pointer bg-red-200 dark:bg-red-800">Cancel</button>
        <button onClick={() => { setEditMode(false); updateMap() }} className="mt-4 border shadow py-1 px-4 rounded hover:opacity-75 hover:cursor-pointer bg-green-200 dark:bg-green-800">Done</button>
      </div>
    </form>
  )
}