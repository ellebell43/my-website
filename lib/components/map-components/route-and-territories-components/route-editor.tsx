import { route } from "@/lib/util/types"
import { useState } from "react"

export default function RouteEditor(props: { route: route, updateRoute: Function, setRouteToEdit: Function, setWorkingIndex: Function }) {
  const { updateRoute, setRouteToEdit, setWorkingIndex } = props

  let [route, setRoute] = useState(props.route)
  let [addSegment, setAddSegment] = useState(false)
  let [removeSegment, setRemoveSegment] = useState(false)
  let [system1, setSystem1] = useState<{ x: number, y: number }>()

  const updateRouteName = (name: string) => {
    const newItem = { ...route }
    newItem.name = name
    setRoute(newItem)
  }

  const updateRouteColor = (color: string) => {
    const newItem = { ...route }
    newItem.color = color
    setRoute(newItem)
  }

  return (<>
    <h2 className="text-center mt-0 p-0 text-lg font-bold">{route.name} Edit</h2>
    <div className="grid grid-cols-3 gap-2 px-4">
      <label htmlFor="route-name" className="text-right">Name</label>
      <input name="route-name" id="route-name" type="text" className="border px-1 rounded col-span-2" value={route.name} onChange={e => updateRouteName(e.target.value)} />
      <div className="flex justify-end">
        <div style={{ background: route.color }} className="border w-full h-full mr-2" />
        <label htmlFor="route-color" className="text-right">Color</label>
      </div>
      <input name="route-color" id="route-color" type="text" className={`border px-1 rounded col-span-2`} value={route.color} onChange={e => updateRouteColor(e.target.value)} />
      <button type="submit" className="border hover:pointer-cursor hover:opacity-75 px-2 py-1 mt-4 w-[150px] mx-auto rounded col-span-3" onClick={() => { updateRoute(route); setRouteToEdit(undefined); setWorkingIndex(undefined) }}>Done</button>
    </div>
  </>)
}
