import StarSystem from "@/lib/util/starsystem"
import Link from "next/link"
import { GasGiant, MilitaryBase, NavalBase, Planet, ScoutBase } from "./symbols"
import { createGridIDString, determineIfSystem, getFilteredColor } from "@/lib/util/functions"
import { EmptyParsec, map } from "@/lib/util/types"
import { randomSystem } from "@/lib/util/randomSystem"

export default function Parsec(props: { id: string, screenReader: boolean, possibleSystem?: boolean, style?: string, map: map, setMap: Function }) {
  const { id, possibleSystem, screenReader, map } = props
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

  const getTerritoryColor = (): string => {
    if (props.map.territories === undefined) return ""
    for (let i = 0; i < props.map.territories.length; i++) {
      const hasTerritory = props.map.territories[i].parsecs.findIndex(el => (el.x === x && el.y === y)) !== -1
      // @ts-ignore
      if (hasTerritory && typeof getFilteredColor(props.map.territories[i].color) == "string") { return getFilteredColor(props.map.territories[i].color) }
    }
    return ""
  }

  // determine if system POI has water or is asteroid to determine icon
  let water = system instanceof StarSystem ? system.hydro != 0 : false
  let asteroid = system instanceof StarSystem ? system.size == 0 : false
  let basesVerbose = system instanceof StarSystem && system.getBasesArrayVerbose().length > 0 ? system.getBasesArrayVerbose().toString().replaceAll(",", ", ") : "N/A"

  // screen reader "hex"
  const ScreenReaderHex = () =>
    <tr className={`border hover:cursor-pointer`} id={`id${createGridIDString(system.x, system.y)}`}>
      <td><Link href={`#${createGridIDString(system.x, system.y)}`} onNavigate={() => { if (typeof window !== undefined) window.location.hash = `#${createGridIDString(system.x, system.y)}` }}>{id}</Link></td>
      <td>{system instanceof StarSystem ? system.name : ""}</td>
      <td>{system instanceof StarSystem ? system.getUWPSmall() : ""}</td>
      <td>{system instanceof StarSystem ? String(system.gasGiant) : ""}</td>
      <td>{system instanceof StarSystem ? basesVerbose : ""}</td>
      <td> {getTerritory() ? getTerritory() : ""}</td>
      <td>{getRoutes().length > 0 ? getRoutes().toString().replaceAll(",", ", ") : ""}</td>
    </tr>


  // visual hex
  const VisualHex = () =>
    // out hex border/container
    <Link
      className={`hexagon-out bg-black dark:bg-gray-100 relative flex justify-center items-center no-underline`}
      id={`id${createGridIDString(system.x, system.y)}`}
      href={`#${createGridIDString(system.x, system.y)}`}
      onNavigate={() => { if (typeof window !== undefined) window.location.hash = `#${createGridIDString(system.x, system.y)}` }}
    >
      {/* inner hex to create border illusion */}
      <div className={`hexagon-in bg-white dark:bg-slate-800 flex flex-col items-center justify-between hover: cursor-pointer`} style={{ background: getTerritoryColor() }}>
        {/* Travel code ring */}
        <div className={`absolute right-[26px] top-[15px] rounded-full w-[120px] h-[120px] ${system instanceof StarSystem && system.travelCode == "A" ? "border-amber-300 dark:border-amber-500" : system instanceof StarSystem && system.travelCode == "R" ? "border-red-500 dark:border-red-700" : "border-white dark:border-slate-800"} ${system instanceof StarSystem && system.travelCode !== "G" ? "border-2" : "border-0"}`} />

        {/* Content container */}
        <div className="text-center relative">
          <p className="text-center m-0 bg-white dark:bg-slate-800" style={{ background: getTerritoryColor() }}>{props.id}</p>
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
          <p className="m-0 relative top-0.5 h-fit truncate font-bold text-center w-[110px] z-20 bg-white dark:bg-slate-800" style={{ background: getTerritoryColor() }}>{system.name}</p>
          <p className="m-0 text-xs relative  py-1 text-center z-10 bg-white dark:bg-slate-800" style={{ background: getTerritoryColor() }}>{system.getUWPSmall()}</p>
        </> : <></>}
      </div>
    </Link>


  return (
    <>
      {screenReader ? <ScreenReaderHex /> : <VisualHex />}
    </>
  )
}