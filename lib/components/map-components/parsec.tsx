import StarSystem from "@/lib/util/starsystem"
import Link from "next/link"
import { GasGiant, MilitaryBase, NavalBase, Planet, ScoutBase } from "./symbols"
import { createGridIDString, determineIfSystem } from "@/lib/util/functions"
import { EmptyParsec, map } from "@/lib/util/types"

export default function Parsec(props: { id: string, screenReader: boolean, possibleSystem?: boolean, style?: string, map: map, setMap: Function }) {
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
    <tr className={`border hover:cursor-pointer`}>
      <td><Link href={`#${createGridIDString(system.x, system.y)}`} onNavigate={() => { if (typeof window !== undefined) window.location.hash = `#${createGridIDString(system.x, system.y)}` }}>{id}</Link></td>
      <td>{system instanceof StarSystem ? system.name : ""}</td>
      <td>{system instanceof StarSystem ? system.getUWPSmall() : ""}</td>
      <td>{system instanceof StarSystem ? String(system.gasGiant) : ""}</td>
      <td>{system instanceof StarSystem ? basesVerbose : ""}</td>
    </tr>


  // visual hex
  const VisualHex = () =>
    <Link
      className={`hexagon-out bg-black dark:bg-gray-100 relative flex justify-center items-center no-underline`}
      id={"hex" + props.id}
      href={`#${createGridIDString(system.x, system.y)}`}
      onNavigate={() => { if (typeof window !== undefined) window.location.hash = `#${createGridIDString(system.x, system.y)}` }}
    // onClick={() => { props.setDetails(system); props.setShowDetails(true); }}
    >
      <div className={`hexagon-in bg-white dark:bg-gray-800 flex flex-col items-center justify-between hover: cursor-pointer`}>
        {/* Travel code ring */}
        <div className={`absolute right-[26px] top-[15px] rounded-full w-[120px] h-[120px] border-2 ${system instanceof StarSystem && system.travelCode == "A" ? "border-amber-300 dark:border-amber-500" : system instanceof StarSystem && system.travelCode == "R" ? "border-red-500 dark:border-red-700" : "border-white dark:border-slate-800"}`} />
        {/* Content container */}
        <div className="text-center relative">
          <p className="text-center m-0 bg-white dark:bg-slate-800">{props.id}</p>
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
          <p className="m-0 relative top-0.5 h-fit truncate font-bold text-center w-[110px] z-20 bg-white dark:bg-slate-800">{system.name}</p>
          <p className="m-0 text-xs relative  bg-white dark:bg-slate-800 py-1 text-center z-10">{system.getUWPSmall()}</p>
        </> : <></>}
      </div>
    </Link>


  return (
    <>
      {screenReader ? <ScreenReaderHex /> : <VisualHex />}
    </>
  )
}