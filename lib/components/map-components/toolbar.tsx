import { map } from "@/lib/util/types";
import { SaveButton } from "./toolbar-components/save-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faDiagramProject, faFlag, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import clearHash from "@/lib/util/clear-hash";

export const buttonStyle = (active: boolean) => `hover:bg-gray-300 dark:hover:bg-slate-700 hover:cursor-pointer py-2 transition-all text-[25px] border md:text-4xl ${active ? "bg-green-200 dark:bg-green-800 shadow-[inset_0_-1px_3px_rgba(0,0,0,.3)] hover:bg-green-100 hover:dark:bg-green-700" : "hover:bg-gray-300 dark:hover:bg-slate-700"}`

export default function Toolbar(props: { map: map, setMap: Function, isNew: boolean, screenReader: boolean, setScreenReader: Function, setPrompt?: Function, routeMode: boolean, setRouteMode: Function, setTerritoryMode: Function, territoryMode: boolean }) {
  const { map, setMap, isNew, screenReader, setScreenReader, setPrompt, routeMode, setRouteMode, territoryMode, setTerritoryMode } = props

  return (
    <div className="fixed bottom-0 left-0 w-screen md:w-fit bg-gray-200 dark:bg-slate-800 text-4xl max-h-[50px] md:max-h-[500px] grid grid-cols-4 md:grid-cols-1 border-t md:border-0">
      <h2 className="absolute scale-0">Toolbar</h2>
      {/* Screen reader toggle */}
      <button onClick={() => setScreenReader(!screenReader)} className={`${buttonStyle(screenReader)}`}><FontAwesomeIcon icon={faTableCells} /><span className="absolute scale-0">Screen Reader Toggle</span></button>
      {/* Route toggle */}
      <button onClick={() => { setRouteMode(!routeMode); if (territoryMode) setTerritoryMode(false); clearHash() }} className={buttonStyle(routeMode)}><FontAwesomeIcon icon={faDiagramProject} /><span className="absolute scale-0">Route Mode {routeMode ? "On" : "Off"}</span></button>
      {isNew ?
        // Regenerate toggle
        <button onClick={() => setPrompt ? setPrompt(true) : undefined} className={buttonStyle(false)}><FontAwesomeIcon icon={faArrowsRotate} /><span className="absolute scale-0">Regenerate</span></button> :
        // Territory toggle
        <button onClick={() => { setTerritoryMode(!territoryMode); if (routeMode) setRouteMode(false); clearHash() }} className={buttonStyle(territoryMode)}><FontAwesomeIcon icon={faFlag} /><span className="absolute scale-0">Territory Mode {territoryMode ? "On" : "Off"}</span></button>}
      <SaveButton map={map} new={isNew} />
    </div>
  )
}