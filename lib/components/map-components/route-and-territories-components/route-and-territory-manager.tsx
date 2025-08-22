import { route } from "@/lib/util/types";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RouteAndTerritoryManager(props: { routeMode: boolean, routes: route[], setRouteToEdit: Function, setWorkingIndex: Function, deleteRoute: Function, addNewItem: Function }) {
  const { routeMode, routes, setRouteToEdit, setWorkingIndex, deleteRoute, addNewItem } = props
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