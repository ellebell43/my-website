import { hasSystem, randomSystem, System } from "./system"

export const Hex = (props: { id: string, possibleSystem?: boolean }) => {
  const x = props.id.substring(0, 2)
  const y = props.id.substring(2)
  let createSystem = false
  if (props.possibleSystem) createSystem = hasSystem()
  let system: System | undefined
  //@ts-ignore
  if (createSystem) system = randomSystem("", Number(x), Number(y))
  let water = system ? system.hydro != 0 : false
  return (
    <div className={`hexagon-out relative`} id={"hex" + props.id}>
      <div className={`hexagon-in absolute top-[.025in] left-[.025in] flex flex-col items-center ${system ? "justify-between" : ""}`}>
        <p className="text-center">{props.id}</p>
        {system ? <div className={`w-[.4in] h-[.4in] border rounded-full ${water ? "bg-blue-400" : "bg-yellow-800"}`} /> : <></>}
        {system ? <p className="text-xs text center">{system.getUWPSmall()}</p> : <></>}
      </div>
    </div>
  )
}

export const HexCol = (props: { id: string, start: number, style?: string, possibleSystem?: boolean, end?: number }) => {
  const { id, start, style, end } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  let last = end
  if (last == undefined) last = 10
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

export const HexColDouble = (props: { id: number, start: number, end?: number, possibleSystem?: boolean }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid
  return (
    <div className="relative w-[2.3in]">
      <HexCol id={id1} start={start} possibleSystem={props.possibleSystem} end={props.end} />
      <HexCol id={id2} start={start} style="absolute top-[.67in] right-[-.4in]" possibleSystem={props.possibleSystem} end={props.end} />
    </div>
  )
}

export const SubSector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31 }) => {
  const { startX, startY } = props
  // Determine subsector offset by column (startX)
  const offset = startX == 1 ? .18 : startX == 9 ? .18 : startX == 17 ? .18 : .18;

  return (
    <div className="flex relative">
      <HexColDouble id={startX} start={startY} possibleSystem={true} />
      <HexColDouble id={startX + 2} start={startY} possibleSystem={true} />
      <HexColDouble id={startX + 4} start={startY} possibleSystem={true} />
      <HexColDouble id={startX + 6} start={startY} possibleSystem={true} />
      <div className="absolute top-0 left-[.2in] w-full h-full border" />
    </div>
  )
}

export const Sector = () => {
  return (
    <div className="p-4">
      <div className="flex" id="row1">
        <SubSector startX={1} startY={1} />
        <SubSector startX={9} startY={1} />
        <SubSector startX={17} startY={1} />
        <SubSector startX={25} startY={1} />
      </div>
      <div className="flex" id="row2">
        <SubSector startX={1} startY={11} />
        <SubSector startX={9} startY={11} />
        <SubSector startX={17} startY={11} />
        <SubSector startX={25} startY={11} />
      </div>
      <div className="flex" id="row3">
        <SubSector startX={1} startY={21} />
        <SubSector startX={9} startY={21} />
        <SubSector startX={17} startY={21} />
        <SubSector startX={25} startY={21} />
      </div>
      <div className="flex" id="row4">
        <SubSector startX={1} startY={31} />
        <SubSector startX={9} startY={31} />
        <SubSector startX={17} startY={31} />
        <SubSector startX={25} startY={31} />
      </div>
    </div>
  )
}
