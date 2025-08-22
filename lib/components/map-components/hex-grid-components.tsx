'use client'

import StarSystem from "../../util/starsystem"
import { createGridIDString, deHexify, hexify } from "../../util/functions"
import { randomSystem } from "../../util/randomSystem"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faMinus, faPlus, faTrash, faX } from "@fortawesome/free-solid-svg-icons"
import { EmptyParsec, facilityCode, faction, fullRange, map } from "../../util/types"
import MDParse from "../md-parse"
import Link from "next/link"
import Parsec from "./parsec"
import ZoomWrapper from "./zoom-wrapper"
import Routes from "./routes"

// Create a column of 10 hexes (height of a subsector)
const HexCol = (props: { id: string, start: number, screenReader: boolean, style?: string, possibleSystem?: boolean, map: map, setMap: Function }) => {
  const { id, start, style } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  // @ts-ignore
  for (let i = start; i < start + 10; i++) {
    const hexId = i < 10 ? "0" + String(i) : String(i)
    arr.push(<Parsec key={id + hexId} id={id + hexId} possibleSystem={props.possibleSystem} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />)
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
const HexColDouble = (props: { id: number, start: number, screenReader: boolean, possibleSystem?: boolean, map: map, setMap: Function }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid

  if (props.screenReader) {
    return (
      <>
        <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} screenReader={true} map={props.map} setMap={props.setMap} />
        <HexCol id={id2} start={start} possibleSystem={props.possibleSystem} screenReader={true} map={props.map} setMap={props.setMap} />
      </>
    )
  }
  return (
    <div className="relative w-[255px]">
      <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} screenReader={false} map={props.map} setMap={props.setMap} />
      <HexCol id={id2} start={start} possibleSystem={props.possibleSystem} screenReader={false} map={props.map} setMap={props.setMap} style="absolute top-[75px] left-[127px]" />
    </div>
  )
}

// Create a hex grid, 8 x 10 hexes
// startX and startY determines the x,y label for the first hex. All other hexes are based on that. Values are truncated to work within sector dimensions.
export const Subsector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31, generateSystems: boolean, screenReader: boolean, sector?: boolean, map: map, setMap: Function }) => {
  const { startX, startY, generateSystems, sector } = props

  const Map = () => (
    <div className="flex relative w-fit mx-auto">
      <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} />
      <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} />
      <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} />
      <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} screenReader={false} map={props.map} setMap={props.setMap} />
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
        <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} />
        <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} />
        <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} />
        <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} screenReader={true} map={props.map} setMap={props.setMap} />
      </tbody>
    </table>
  )

  // screen reader friendly subsectors
  // do not include local details panel if part of a sector
  if (props.screenReader && sector) return <MapForScreenReader />
  else if (props.screenReader && !sector) {
    return (
      <div>
        <MapForScreenReader />
        <Routes routes={props.map.routes ? props.map.routes : []} />
      </div>
    )
  }
  // General subsectors
  // do not include local details panel if part of a sector
  else if (sector) return (<Map />)
  else {
    return (
      <div className="p-4 relative max-w-screen max-h-screen overflow-scroll" id="map-container">
        <ZoomWrapper>
          <Map />
          <Routes routes={props.map.routes ? props.map.routes : []} />
        </ZoomWrapper>
      </div>
    )
  }
}

// Row of 4 subsectors
const SubsectorRow = (props: { row: 1 | 2 | 3 | 4, generateSystems: boolean, screenReader: boolean, map: map, setMap: Function }) => {
  const { row, generateSystems } = props
  //@ts-expect-error
  const y: 1 | 11 | 21 | 31 = (row - 1) * 10 + 1
  return (
    <div className={`flex relative`} id={`row${row}`}>
      <Subsector startX={1} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
      <Subsector startX={9} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
      <Subsector startX={17} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
      <Subsector startX={25} startY={y} generateSystems={generateSystems} sector={true} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
    </div>
  )
}

// Create a full sector, 32 x 40 hex grid
export const Sector = (props: { generateSystems: boolean, screenReader: boolean, map: map, setMap: Function }) => {
  const { generateSystems } = props
  return (
    <div className="p-4 relative max-w-screen max-h-screen overflow-scroll" id="#map-container">
      <ZoomWrapper>
        <SubsectorRow row={1} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
        <SubsectorRow row={2} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
        <SubsectorRow row={3} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
        <SubsectorRow row={4} generateSystems={generateSystems} screenReader={props.screenReader} map={props.map} setMap={props.setMap} />
        <Routes routes={props.map.routes ? props.map.routes : []} />
      </ZoomWrapper>
    </div>
  )
}