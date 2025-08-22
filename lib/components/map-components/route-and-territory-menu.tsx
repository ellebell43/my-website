import { map, route, territory } from "@/lib/util/types";
import { faAngleUp, faArrowAltCircleDown, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import RouteEditor from "./route-and-territories-components/route-editor";
import RouteAndTerritoryManager from "./route-and-territories-components/route-and-territory-manager";

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

  if (!(routeMode || territoryMode)) return <></>
  return (
    <div style={{ bottom: visible && screen.width < 768 ? "45px" : !visible && screen.width < 768 ? "-180px" : visible ? "0px" : "-220px" }} className={`fixed left-0 md:left-[47px] w-screen max-w-[400px] bg-gray-100 dark:bg-slate-800 border-2 transition-all h-[260px] overflow-y-scroll p-1`}>
      <button className={`${visible ? "rotate-180" : "rotate-0"} hover:cursor-pointer transition-all text-2xl absolute top-0 left-0`} onClick={() => setVisible(!visible)}><FontAwesomeIcon icon={faAngleUp} /><span className="absolute scale-0">Show panel</span></button>
      {routeToEdit === undefined && territoryToEdit == undefined ?
        <RouteAndTerritoryManager setRouteToEdit={setRouteToEdit} routes={routes} setWorkingIndex={setWorkingIndex} deleteRoute={deleteRoute} addNewItem={addNewItem} routeMode={routeMode} /> : routeToEdit ?
          <RouteEditor route={routeToEdit} setRouteToEdit={setRouteToEdit} setWorkingIndex={setWorkingIndex} updateRoute={updateRoute} /> : <></>}
    </div>
  )
}