'use client'

import { GasGiant, Planet } from "./symbols"
import StarSystem from "../util/starsystem"
import { hasSystem } from "../util/functions"
import { randomSystem } from "../util/randomSystem"
import { useState } from "react"

// Create a single hex (parsec)
export const Hex = (props: { id: string, setDetails: Function, details: StarSystem | undefined, possibleSystem?: boolean }) => {
  const { id, possibleSystem } = props
  // split id into x,y values
  const x = id.substring(0, 2)
  const y = id.substring(2)
  // If a system might be generated, 50/50 on if one is created
  //@ts-expect-error
  const [system, setSystem] = useState(possibleSystem && hasSystem() ? randomSystem("", Number(x), Number(y)) : undefined)

  // determine if system POI has water or is asteroid to determine icon
  let water = system ? system.hydro != 0 : false
  let asteroid = system ? system.size == 0 : false

  return (
    <div
      className="hexagon-out relative hover:pointer"
      id={"hex" + props.id}
      onClick={() => { if (system) props.setDetails(system); }}
    >
      <div className={`hexagon-in absolute top-[.025in] left-[.025in] flex flex-col items-center ${system ? "justify-between" : ""}`}>
        <div className="text-center relative">
          <p className="text-center text-sms">{props.id}</p>
          {system?.gasGiant ? <GasGiant /> : <></>}
          {system ? <p className="text-md font-bold m-0">{system.starport}</p> : <></>}
          {system ? <Planet water={water} asteroid={asteroid} /> : <></>}
        </div>
        {system ? <p className="font-bold">{system.name}</p> : <></>}
        {system ? <p className="text-xs text center">{system.getUWPSmall()}</p> : <></>}
        <div className="absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  )
}

// Create a column of 10 hexes (height of a subsector)
export const HexCol = (props: { id: string, start: number, details: StarSystem | undefined, setDetails: Function, style?: string, possibleSystem?: boolean }) => {
  const { id, start, style, details, setDetails } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  // @ts-ignore
  for (let i = start; i < start + 10; i++) {
    const hexId = i < 10 ? "0" + String(i) : String(i)
    arr.push(<Hex key={i} id={id + hexId} possibleSystem={props.possibleSystem} details={details} setDetails={setDetails} />)
  }
  // Map the array out in a div container
  return (
    <div className={style} id={"col" + id + start}>
      {arr.map((el, i) => {
        return el
      })}
    </div>
  )
}

// Create a double column of 10 hexes, second column is offset for use in a larger scale grid
// id and start determines x,y label of the initial hex
export const HexColDouble = (props: { id: number, start: number, details: StarSystem | undefined, setDetails: Function, possibleSystem?: boolean }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid
  return (
    <div className="relative w-[2.3in]">
      <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} details={props.details} setDetails={props.setDetails} />
      <HexCol id={id2} start={start} style="absolute top-[.67in] right-[-.4in]" possibleSystem={props.possibleSystem} details={props.details} setDetails={props.setDetails} />
    </div>
  )
}

// Create a hex grid, 8 x 10 hexes
// startX and startY determines the x,y label for the first hex. All other hexes are based on that. Values are truncated to work within sector dimensions.
export const Subsector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31, generateSystems: boolean, border: boolean, sector?: boolean, details?: StarSystem | undefined, setDetails?: Function, }) => {
  const { startX, startY, generateSystems, border, sector } = props
  const [localDetails, setLocalDetails] = useState<StarSystem | undefined>()
  return (
    <div className="flex relative w-fit">
      <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} details={sector ? props.details : localDetails} setDetails={sector && props.setDetails ? props.setDetails : setLocalDetails} />
      <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} details={sector ? props.details : localDetails} setDetails={sector && props.setDetails ? props.setDetails : setLocalDetails} />
      <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} details={sector ? props.details : localDetails} setDetails={sector && props.setDetails ? props.setDetails : setLocalDetails} />
      <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} details={sector ? props.details : localDetails} setDetails={sector && props.setDetails ? props.setDetails : setLocalDetails} />
      {border ? <div className={`absolute top-0 left-[.2in] w-full h-full border pointer-events-none`} /> : <></>}
      {sector ? <></> : <SystemDetails details={localDetails} setDetails={setLocalDetails} />}
    </div>
  )
}

// Row of 4 subsectors
export const SubsectorRow = (props: { row: 1 | 2 | 3 | 4, generateSystems: boolean, details?: StarSystem | undefined, setDetails?: Function }) => {
  const { row, generateSystems } = props
  //@ts-expect-error
  const y: 1 | 11 | 21 | 31 = (row - 1) * 10 + 1
  return (
    <div className={`flex relative`} id={`row${row}`}>
      <Subsector startX={1} startY={y} generateSystems={generateSystems} border={true} details={props.details} setDetails={props.setDetails} sector={true} />
      <Subsector startX={9} startY={y} generateSystems={generateSystems} border={true} details={props.details} setDetails={props.setDetails} sector={true} />
      <Subsector startX={17} startY={y} generateSystems={generateSystems} border={true} details={props.details} setDetails={props.setDetails} sector={true} />
      <Subsector startX={25} startY={y} generateSystems={generateSystems} border={true} details={props.details} setDetails={props.setDetails} sector={true} />
    </div>
  )
}

// Create a full sector, 32 x 40 hex grid
export const Sector = (props: { generateSystems: boolean }) => {
  const [details, setDetails] = useState<StarSystem | undefined>()
  const { generateSystems } = props
  return (
    <div className="p-4 relative">
      <SubsectorRow row={1} generateSystems={generateSystems} details={details} setDetails={setDetails} />
      <SubsectorRow row={2} generateSystems={generateSystems} details={details} setDetails={setDetails} />
      <SubsectorRow row={3} generateSystems={generateSystems} details={details} setDetails={setDetails} />
      <SubsectorRow row={4} generateSystems={generateSystems} details={details} setDetails={setDetails} />
      <SystemDetails details={details} setDetails={setDetails} />
    </div>
  )
}

// Details panel
export const SystemDetails = (props: { details: StarSystem | undefined, setDetails: Function }) => {
  if (!props.details) return <></>
  return (
    <div className="fixed bottom-6 right-6 bg-slate-200 border rounded shadow-lg w-[500px] p-4 z-50">
      {/* title area */}
      <div className="flex justify-between">
        <p className="text-center w-full font-bold text-xl">{props.details.getUWP()}</p>
        <button className="hover:pointer" onClick={() => props.setDetails(undefined)}>X</button>
      </div>
      <div className="border-b my-2 pb-2">
        <p><span className="font-bold">Starport</span>: {props.details.starportQuality} (Cr{props.details.berthingCost}; Fuel {props.details.fuelType})</p>
        <p><span className="font-bold">Facilities</span>: {props.details.facilitiesVerbose.toString().replaceAll(",", ", ")}</p>
        <p><span className="font-bold">Bases</span>: {props.details.basesVerbose.toString().replaceAll(",", ", ")}</p>
        <p><span className="font-bold">Trade Codes</span>: {props.details.tradeCodesVerbose.toString().replaceAll(",", ", ")}</p>
      </div>
      <p><span className="font-bold">Size</span>: {props.details.diameter}km ({props.details.gravity}G)</p>
      <p><span className="font-bold">Government</span>: {props.details.governmentType}</p>
    </div>
  )
}
