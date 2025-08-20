import { createGridIDString, deHexify, hexify } from "@/lib/util/functions"
import { randomSystem } from "@/lib/util/randomSystem"
import StarSystem from "@/lib/util/starsystem"
import { EmptyParsec, facilityCode, faction, map } from "@/lib/util/types"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export default function EditForm(props: { system: StarSystem | EmptyParsec, setSystem: Function, setEditMode: Function, setMap: Function, map: map }) {
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
    setGasGiant(newSystem.gasGiant)
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

          <p className="italic pt-2 text-center col-span-4">UWP: {createGridIDString(system.x, system.y)} {name} {starport}{hexify(size)}{hexify(atmos)}{hexify(hydro)}{hexify(pop)}{hexify(gov)}{law}-{tech}</p>

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
          <textarea className="block my-2 mx-auto col-span-4 border w-full px-2 py-1" placeholder="System Notes" value={details} onChange={(e) => setDetails(e.target.value)} />
        </div> : <></>}
      <div className="flex justify-center gap-8">
        <button onClick={() => { setEditMode(false); setSystem(system) }} className="mt-4 border shadow py-1 px-4 rounded hover:opacity-75 hover:cursor-pointer bg-red-200 dark:bg-red-800">Cancel</button>
        <button onClick={() => { setEditMode(false); updateMap() }} className="mt-4 border shadow py-1 px-4 rounded hover:opacity-75 hover:cursor-pointer bg-green-200 dark:bg-green-800">Done</button>
      </div>
    </form>
  )
}