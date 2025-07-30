import { Planet } from "./symbols"
import StarSystem from "../util/starsystem"
import { hasSystem } from "../util/functions"
import { randomSystem } from "../util/randomSystem"

// Create a single hex (parsec)
export const Hex = (props: { id: string, possibleSystem?: boolean }) => {
  const x = props.id.substring(0, 2)
  const y = props.id.substring(2)
  let createSystem = false
  if (props.possibleSystem) createSystem = hasSystem()
  let system: StarSystem | undefined
  //@ts-ignore
  if (createSystem) system = randomSystem("", Number(x), Number(y))
  let water = system ? system.hydro != 0 : false
  let asteroid = system ? system.size == 0 : false
  return (
    <div className={`hexagon-out relative`} id={"hex" + props.id}>
      <div className={`hexagon-in absolute top-[.025in] left-[.025in] flex flex-col items-center ${system ? "justify-between" : ""}`}>
        <p className="text-center">{props.id}</p>
        {system ? <Planet water={water} asteroid={asteroid} /> : <></>}
        {system ? <p className="text-xs text center">{system.getUWPSmall()}</p> : <></>}
      </div>
    </div>
  )
}

// Create a column of 10 hexes (height of a subsector)
export const HexCol = (props: { id: string, start: number, style?: string, possibleSystem?: boolean }) => {
  const { id, start, style } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  // @ts-ignore
  for (let i = start; i <= start + 10; i++) {
    const hexId = i < 10 ? "0" + String(i) : String(i)
    arr.push(<Hex key={i} id={id + hexId} possibleSystem={props.possibleSystem} />)
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
export const HexColDouble = (props: { id: number, start: number, possibleSystem?: boolean }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid
  return (
    <div className="relative w-[2.3in]">
      <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} />
      <HexCol id={id2} start={start} style="absolute top-[.67in] right-[-.4in]" possibleSystem={props.possibleSystem} />
    </div>
  )
}

// Create a hex grid, 8 x 10 hexes
// startX and startY determines the x,y label for the first hex. All other hexes are based on that. Values are truncated to work within sector dimensions.
export const Subsector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31, generateSystems: boolean }) => {
  const { startX, startY, generateSystems } = props
  return (
    <div className="flex relative">
      <HexColDouble id={startX} start={startY} possibleSystem={generateSystems} />
      <HexColDouble id={startX + 2} start={startY} possibleSystem={generateSystems} />
      <HexColDouble id={startX + 4} start={startY} possibleSystem={generateSystems} />
      <HexColDouble id={startX + 6} start={startY} possibleSystem={generateSystems} />
      <div className="absolute top-0 left-[.2in] w-full h-full border" />
    </div>
  )
}

// Row of 4 subsectors
export const SubsectorRow = (props: { row: 1 | 2 | 3 | 4, generateSystems: boolean }) => {
  const { row, generateSystems } = props
  //@ts-expect-error
  const y: 1 | 11 | 21 | 31 = (row - 1) * 10 + 1
  return (
    <div className="flex" id={`row${row}`}>
      <Subsector startX={1} startY={y} generateSystems={generateSystems} />
      <Subsector startX={9} startY={y} generateSystems={generateSystems} />
      <Subsector startX={17} startY={y} generateSystems={generateSystems} />
      <Subsector startX={25} startY={y} generateSystems={generateSystems} />
    </div>
  )
}

// Create a full sector, 32 x 40 hex grid
export const Sector = (props: { generateSystems: boolean }) => {
  const { generateSystems } = props
  return (
    <div className="p-4">
      <SubsectorRow row={1} generateSystems={generateSystems} />
      <SubsectorRow row={2} generateSystems={generateSystems} />
      <SubsectorRow row={3} generateSystems={generateSystems} />
      <SubsectorRow row={4} generateSystems={generateSystems} />
    </div>
  )
}
