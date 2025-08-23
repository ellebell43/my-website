import { buttonStyle } from "@/lib/util/button-style"
import clearHash from "@/lib/util/clear-hash"
import { territory } from "@/lib/util/types"
import { useHash } from "@/lib/util/useHash"
import { useEffect, useState } from "react"

export default function TerritoryEditor(props: { territory: territory, updateTerritory: Function, setTerritoryToEdit: Function, setWorkingIndex: Function, setDisableDetails: Function }) {
  const { updateTerritory, setTerritoryToEdit, setWorkingIndex, setDisableDetails } = props

  let [territory, setTerritory] = useState(props.territory)
  let [addParsec, setAddParsec] = useState(false)
  let [removeParsec, setRemoveParsec] = useState(false)

  useEffect(() => { setDisableDetails(true) }, [])

  // Hash to determine which parsec is selected
  const hash = useHash()

  const createParsec = (x: number, y: number) => {
    const newParsec = { x, y }
    const newTerritory = { ...territory }
    newTerritory.parsecs.push(newParsec)
    setTerritory(newTerritory)
    clearHash()
  }

  const deleteParsec = (x: number, y: number) => {
    const i = territory.parsecs.findIndex(el => (el.x === x && el.y === y))
    const newTerritory = { ...territory }
    newTerritory.parsecs.splice(i, 1)
    setTerritory(newTerritory)
    clearHash()
  }

  useEffect(() => {
    if (hash && (addParsec || removeParsec)) {
      const id = hash.split('#')[1];
      const x = Number(id.substring(0, 2))
      const y = Number(id.substring(2))
      updateTerritory(territory)
      if (addParsec) { createParsec(x, y) } else { deleteParsec(x, y) }
      clearHash()

    }
  }, [hash])

  const updateTerritoryName = (name: string) => {
    const newItem = { ...territory }
    newItem.name = name
    setTerritory(newItem)
  }

  const updateTerritoryColor = (color: string) => {
    const newItem = { ...territory }
    newItem.color = color
    setTerritory(newItem)
    updateTerritory(newItem)
  }

  return (<>
    <h2 className="text-center mt-0 p-0 text-lg font-bold">{territory.name} Edit</h2>
    <form className="grid grid-cols-3 gap-2 px-4" onSubmit={e => { e.preventDefault(); updateTerritory(territory); setTerritoryToEdit(undefined); setWorkingIndex(undefined); setDisableDetails(false); clearHash() }}>
      {/* Territory name input */}
      <label htmlFor="route-name" className="text-right">Name</label>
      <input name="route-name" id="route-name" type="text" className="border px-1 rounded col-span-2" value={territory.name} onChange={e => updateTerritoryName(e.target.value)} />
      {/* Territory color input */}
      <div className="flex justify-end">
        <div style={{ background: territory.color }} className="border w-full h-full mr-2" />
        <label htmlFor="route-color" className="text-right">Color</label>
      </div>
      <input name="route-color" id="route-color" type="text" className={`border px-1 rounded col-span-2`} value={territory.color} onChange={e => updateTerritoryColor(e.target.value)} />
      {addParsec || removeParsec ?
        // Add or remove parsec dialog
        <div className="col-span-3 flex flex-col">
          <p className="text-center underline text-lg">{addParsec ? "Adding" : "Removing"} Parsec</p>
          <button type="button" className="border px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-700 hover:cursor-pointer mx-auto" onClick={() => { setAddParsec(false); setRemoveParsec(false); }}>Done {addParsec ? "Adding" : "Removing"}</button>
        </div> :
        // Add or remove parsec buttons
        <div className="col-span-3 flex justify-center gap-2">
          <button type="button" className="border px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-700 hover:cursor-pointer" onClick={() => { setAddParsec(true) }}>Add Parsec</button>
          <button type="button" className={`${buttonStyle}`} onClick={() => setRemoveParsec(true)}>Remove Parsec</button>
        </div>}
      <button type="submit" className={`${buttonStyle} col-span-3 w-[150px] mx-auto`}>Done</button>
    </form>
  </>)
}
