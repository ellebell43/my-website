'use client'

import { GasGiant, MilitaryBase, NavalBase, Planet, ScoutBase } from "./symbols"
import StarSystem from "../util/starsystem"
import { hasSystem } from "../util/functions"
import { randomSystem } from "../util/randomSystem"
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHippo, faMinus, faPlus, faX } from "@fortawesome/free-solid-svg-icons"

// Create a single hex (parsec)
export const Hex = (props: { id: string, screenReader: boolean, possibleSystem?: boolean, style?: string }) => {
  const { id, possibleSystem, screenReader } = props
  let [showDetails, setShowDetails] = useState(false)
  // split id into x,y values
  const x = id.substring(0, 2)
  const y = id.substring(2)
  // If a system might be generated, 50/50 on if one is created
  //@ts-expect-error
  const [system, setSystem] = useState(possibleSystem && hasSystem() ? randomSystem("", Number(x), Number(y)) : undefined)

  // determine if system POI has water or is asteroid to determine icon
  let water = system ? system.hydro != 0 : false
  let asteroid = system ? system.size == 0 : false

  // screen reader "hex"
  const ScreenReaderHex = () =>
    <tr className="border hover:cursor-pointer" onClick={() => { if (system) setShowDetails(true); }}>
      <td>{id}</td>
      <td>{system ? system.name : ""}</td>
      <td>{system ? system.getUWPSmall() : ""}</td>
      <td>{system ? String(system.gasGiant) : ""}</td>
      <td>{system ? system.getBasesArrayVerbose().toString().replace(",", ", ") : ""}</td>
      {/* <td>{system ? <DetailsPanel system={system} setShowDetails={setShowDetails} showDetails={showDetails} /> : ""}</td> */}
    </tr>


  // visual hex
  const VisualHex = () =>
    <div
      className={`hexagon-out bg-black dark:bg-gray-100 relative flex justify-center items-center`}
      id={"hex" + props.id}
      onClick={() => { if (system) setShowDetails(true); }}
    >
      <div className={`hexagon-in bg-white dark:bg-gray-800 flex flex-col items-center ${system ? "justify-between hover: cursor-pointer" : ""}`}>
        {/* Travel code ring */}
        <div className={`absolute right-[26px] top-[15px] rounded-full w-[120px] h-[120px] border-2 dark:border-gray-800 ${system?.travelCode == "A" ? "border-amber-300" : system?.travelCode == "R" ? "border-red-500" : "border-white"}`} />
        {/* Content container */}
        <div className="text-center relative">
          <p className="text-center text-sms">{props.id}</p>
          {system ? <>
            {system.gasGiant ? <GasGiant /> : <></>}
            {system.facilities.includes("N") ? <NavalBase /> : <></>}
            {system.facilities.includes("M") ? <MilitaryBase /> : <></>}
            {system.facilities.includes("S") ? <ScoutBase /> : <></>}
            <p className="text-md font-bold m-0">{system.starport}</p>
            <Planet water={water} asteroid={asteroid} />
          </> : <></>}
        </div>
        {system ? <>
          <p className="font-bold">{system.name}</p>
          <p className="text-xs text center z-10">{system.getUWPSmall()}</p>
        </> : <></>}
      </div>
    </div>


  return (
    <>
      {screenReader ? <ScreenReaderHex /> : <VisualHex />}
      {system ? <DetailsPanel system={system} setShowDetails={setShowDetails} showDetails={showDetails} /> : <></>}
    </>
  )
}

// Create a column of 10 hexes (height of a subsector)
export const HexCol = (props: { id: string, start: number, screenReader: boolean, style?: string, possibleSystem?: boolean }) => {
  const { id, start, style } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  // @ts-ignore
  for (let i = start; i < start + 10; i++) {
    const hexId = i < 10 ? "0" + String(i) : String(i)
    arr.push(<Hex key={id + hexId} id={id + hexId} possibleSystem={props.possibleSystem} screenReader={props.screenReader} />)
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
export const HexColDouble = (props: { id: number, start: number, screenReader: boolean, possibleSystem?: boolean }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid

  if (props.screenReader) {
    return (
      <>
        <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} screenReader={true} />
        <HexCol id={id2} start={start} possibleSystem={props.possibleSystem} screenReader={true} />
      </>
    )
  }
  return (
    <div className="relative w-[255px]">
      <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} screenReader={false} />
      <HexCol id={id2} start={start} style="absolute top-[75px] left-[127px]" possibleSystem={props.possibleSystem} screenReader={false} />
    </div>
  )
}

// Create a hex grid, 8 x 10 hexes
// startX and startY determines the x,y label for the first hex. All other hexes are based on that. Values are truncated to work within sector dimensions.
export const Subsector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31, generateSystems: boolean, screenReader: boolean, sector?: boolean }) => {
  const { startX, startY, generateSystems, sector } = props

  const Map = () => (
    <div className="flex relative w-fit mx-auto">
      <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} screenReader={false} />
      <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} screenReader={false} />
      <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} screenReader={false} />
      <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} screenReader={false} />
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
        <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} screenReader={true} />
        <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} screenReader={true} />
        <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} screenReader={true} />
        <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} screenReader={true} />
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
export const SubsectorRow = (props: { row: 1 | 2 | 3 | 4, generateSystems: boolean, screenReader: boolean }) => {
  const { row, generateSystems } = props
  //@ts-expect-error
  const y: 1 | 11 | 21 | 31 = (row - 1) * 10 + 1
  return (
    <div className={`flex relative`} id={`row${row}`}>
      <Subsector startX={1} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} />
      <Subsector startX={9} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} />
      <Subsector startX={17} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} />
      <Subsector startX={25} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} />
    </div>
  )
}

// Create a full sector, 32 x 40 hex grid
export const Sector = (props: { generateSystems: boolean, screenReader: boolean }) => {
  const { generateSystems } = props
  return (
    <>
      <Zoom>
        <div className="p-4 relative max-w-screen max-h-screen overflow-scroll">
          <SubsectorRow row={1} generateSystems={generateSystems} screenReader={props.screenReader} />
          <SubsectorRow row={2} generateSystems={generateSystems} screenReader={props.screenReader} />
          <SubsectorRow row={3} generateSystems={generateSystems} screenReader={props.screenReader} />
          <SubsectorRow row={4} generateSystems={generateSystems} screenReader={props.screenReader} />
        </div>
      </Zoom>
    </>
  )
}

// Details panel
export const DetailsPanel = (props: { system: StarSystem, setShowDetails: Function, showDetails: boolean }) => {
  let { system } = props
  if (!props.showDetails) return <></>
  else return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-white dark:bg-slate-800 opacity-75 z-50" />
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
        <div className="md:w-[650px] h-screen md:h-[850px] overflow-scroll opacity-100 bg-slate-100 dark:bg-slate-800 border rounded md:shadow-lg p-4 z-50 scale-100">

          {/* Title Area */}
          <div className="">
            <h2 className="text-center w-full font-bold text-xl">{system.getUWPBroken()[0]}</h2>
            <p className="text-center w-full font-bold text-xl">{system.getUWPBroken()[1]}</p>
            {/* Close panel button */}
            <button className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 transition-all absolute top-3 right-3 border rounded h-8 w-8 bg-slate-200 dark:bg-slate-700" onClick={() => { props.setShowDetails(!props.showDetails) }}            >
              <FontAwesomeIcon icon={faX} />
              <p className="absolute scale-0">Close details panel for {system.getGridID()}</p>
            </button>
          </div>

          {/* Starport and Trade */}
          <div className="border-b my-2 pb-2">
            <p><span className="font-bold">Starport</span>: {system.getStarportQuality()} (Cr{system.getRandomBerthingCost()}; Fuel {system.getFuelType()})</p>
            <p><span className="font-bold">Facilities</span>: {system.getFacilitiesArrayVerbose().toString().replaceAll(",", ", ")}</p>
            <p><span className="font-bold">Bases</span>: {system.getBasesArrayVerbose().toString().replaceAll(",", ", ")}</p>
            <p><span className="font-bold">Trade Codes</span>: {system.getTradeCodesVerbose().toString().replaceAll(",", ", ")}</p>
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
        </div>
      </div>
    </>
  )
}

export const Zoom = (props: { children: React.ReactNode }) => {
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