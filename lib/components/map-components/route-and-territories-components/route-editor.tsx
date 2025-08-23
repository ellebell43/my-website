import { buttonStyle } from "@/lib/util/button-style"
import { createGridIDString } from "@/lib/util/functions"
import { route } from "@/lib/util/types"
import { useHash } from "@/lib/util/useHash"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RouteEditor(props: { route: route, updateRoute: Function, setRouteToEdit: Function, setWorkingIndex: Function, setDisableDetails: Function }) {
  const { updateRoute, setRouteToEdit, setWorkingIndex, setDisableDetails } = props

  let [route, setRoute] = useState(props.route)
  let [addSegment, setAddSegment] = useState(false)
  let [removeSegment, setRemoveSegment] = useState(false)
  let [system1, setSystem1] = useState<{ x: number, y: number }>()

  useEffect(() => { setDisableDetails(true) }, [])

  let router = useRouter()

  // Hash to determine which parsec is selected
  const hash = useHash()

  const createSegment = (x: number, y: number) => {
    router.push("#")
    if (!system1) return
    const newSegment = { x1: system1.x, y1: system1.y, x2: x, y2: y }
    route.segments.push(newSegment)
  }

  const deleteSegment = (x: number, y: number) => {
    if (!system1) return
    router.push("#")
    const i = route.segments.findIndex(el => (el.x1 === x && el.y1 === y && el.x2 === system1.x && el.y2 === system1.y) || (el.x2 === x && el.y2 === y && el.x1 === system1.x && el.y1 === system1.y))
    const newRoute = { ...route }
    newRoute.segments.splice(i, 1)
    setRoute(newRoute)
  }

  useEffect(() => {
    if (hash && (addSegment || removeSegment)) {
      const id = hash.split('#')[1];
      const x = Number(id.substring(0, 2))
      const y = Number(id.substring(2))
      if (!system1) setSystem1({ x, y })
      else {
        if (addSegment) { createSegment(x, y) } else { deleteSegment(x, y) }
        setSystem1(undefined)
        setAddSegment(false)
        setRemoveSegment(false)
      }
      router.push("#")
    }
  }, [hash])

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
    <form className="grid grid-cols-3 gap-2 px-4" onSubmit={e => { e.preventDefault(); updateRoute(route); setRouteToEdit(undefined); setWorkingIndex(undefined); setDisableDetails(false); router.push("#") }}>
      {/* Route name input */}
      <label htmlFor="route-name" className="text-right">Name</label>
      <input name="route-name" id="route-name" type="text" className="border px-1 rounded col-span-2" value={route.name} onChange={e => updateRouteName(e.target.value)} />
      {/* Route color input */}
      <div className="flex justify-end">
        <div style={{ background: route.color }} className="border w-full h-full mr-2" />
        <label htmlFor="route-color" className="text-right">Color</label>
      </div>
      <input name="route-color" id="route-color" type="text" className={`border px-1 rounded col-span-2`} value={route.color} onChange={e => updateRouteColor(e.target.value)} />
      {addSegment || removeSegment ?
        // Add or remove segment dialog
        <div className="col-span-3 flex flex-col">
          <p className="text-center underline text-lg">{addSegment ? "Adding" : "Removing"} Segment</p>
          <p className="text-center m-0">System 1: {system1 ? createGridIDString(system1.x, system1.y) : "-"}</p>
          <p className="font-bold text-center m-0 mb-4">Select system {system1 ? "2" : "1"}</p>
          <button type="button" className="border px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-700 hover:cursor-pointer mx-auto" onClick={() => { setAddSegment(false); setRemoveSegment(false); setSystem1(undefined) }}>Cancel</button>
        </div> :
        // Add or remove segment buttons
        <div className="col-span-3 flex justify-center gap-2">
          <button type="button" className="border px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-700 hover:cursor-pointer" onClick={() => { setAddSegment(true) }}>Add Segment</button>
          <button type="button" className={`${buttonStyle}`} onClick={() => setRemoveSegment(true)}>Delete Segment</button>
        </div>}
      <button type="submit" className={`${buttonStyle} col-span-3 w-[150px] mx-auto`}>Done</button>
    </form>
  </>)
}
