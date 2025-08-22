import { map, route, territory } from "@/lib/util/types";
import { faAngleUp, faArrowAltCircleDown, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function RouteAndTerritoryMenu(props: { map: map, setMap: Function, routeMode: boolean, territoryMode: boolean, setRouteToEdit: Function, setTerritoryToEdit: Function }) {
  const { map, setMap, routeMode, territoryMode } = props

  let [visible, setVisible] = useState(true)
  let [routes, setRoutes] = useState(map.routes ? map.routes : [])
  let [routeToEdit, setRouteToEdit] = useState<route>()
  let [territories, setTerritories] = useState(map.territories ? map.territories : [])
  let [territoryToEdit, setTerritoryToEdit] = useState<territory>()
  let [workingIndex, setWorkingIndex] = useState<number>()

  useEffect(() => {
    let newMap = { ...map }
    newMap.routes = routes
    setMap(newMap)
  }, [routes])

  const addNewItem = () => {
    if (routeMode) {
      const arr = [...routes]
      arr.push({ name: "New Route", color: "#FFFFFF", segments: [] })
      setRoutes(arr)
    }

    if (territoryMode) {
      const arr = [...territories]
      arr.push({ name: "New Route", color: "#FFFFFF", parsecs: [] })
      setTerritories(arr)
    }
  }

  const updateRoute = (route: route) => {
    if (workingIndex === undefined) return
    const arr = [...routes]
    arr[workingIndex] = route
    setRoutes(arr)
  }

  const deleteRoute = (i: number) => {
    const arr = [...routes]
    arr.splice(i, 1)
    setRoutes(arr)
  }

  const Manager = () => {
    return (
      <>
        <h2 className="text-center mt-0 p-0 text-lg">{routeMode ? "Routes" : "Territories"}</h2>
        <div className="mb-4">
          {routeMode ? <>
            {routes.map((el, i) => {
              return (
                <div key={i} className="grid grid-cols-2 w-full gap-2 my-1">
                  <p className="m-0 text-right">{el.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border w-full h-full" style={{ background: el.color }} />
                    <div className="col-span-2 flex gap-2">
                      <button className="hover:opacity-75 hover:cursor-pointer" onClick={() => { setRouteToEdit(el); setWorkingIndex(i) }}><FontAwesomeIcon icon={faEdit} /><span className="absolute scale-0">Edit route</span></button>
                      <button className="hover:opacity-75 hover:cursor-pointer" onClick={() => { deleteRoute(i) }}><FontAwesomeIcon icon={faTrash} /><span className="absolute scale-0">Delete route</span></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </> : <></>}
        </div>
        <button className="block mx-auto border rounded px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 hover:cursor-pointer" onClick={e => addNewItem()}>Create new {routeMode ? "route" : "territory"}</button></>
    )
  }

  const RouteEditor = (props: { route: route }) => {
    if (!routeToEdit || workingIndex === undefined) return <></>

    let [route, setRoute] = useState(props.route)
    let [addSegment, setAddSegment] = useState(false)
    let [removeSegment, setRemoveSegment] = useState(false)
    let [system1, setSystem1] = useState<{ x: number, y: number }>()
    let [system2, setSystem2] = useState<{ x: number, y: number }>()

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
      <h2 className="text-center mt-0 p-0 text-lg font-bold">{routes[workingIndex].name} Edit</h2>
      <div className="grid grid-cols-3 gap-2 px-4 max-w-[400px]">
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

  if (!(routeMode || territoryMode)) return <></>
  return (
    <div style={{ bottom: visible ? "45px" : "-180px" }} className={`fixed left-0 w-screen bg-gray-100 dark:bg-slate-800 border-2 transition-all h-[260px] overflow-y-scroll p-1`}>
      <button className={`${visible ? "rotate-180" : "rotate-0"} hover:cursor-pointer transition-all text-2xl absolute top-0 left-0`} onClick={() => setVisible(!visible)}><FontAwesomeIcon icon={faAngleUp} /><span className="absolute scale-0">Show panel</span></button>
      {routeToEdit === undefined && territoryToEdit == undefined ?
        <Manager /> : routeToEdit ?
          <RouteEditor route={routeToEdit} /> : <></>}
    </div>
  )
}