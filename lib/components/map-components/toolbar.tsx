import { map } from "@/lib/util/types";
import { SaveButton } from "./toolbar-components/save-button";
import ScreenReaderToggle from "./toolbar-components/screen-reader-toggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export const buttonStyle = (active: boolean) => `hover:bg-gray-300 dark:hover:bg-slate-700 hover:cursor-pointer py-2 transition-all text-[25px] border md:text-4xl ${active ? "bg-gray-300 dark:bg-slate-600 shadow-[inset_0_-1px_3px_rgba(0,0,0,.3)]" : ""}`

export default function Toolbar(props: { map: map, setMap: Function, isNew: boolean, screenReader: boolean, setScreenReader: Function, setPrompt?: Function }) {
  const { map, setMap, isNew, screenReader, setScreenReader, setPrompt } = props

  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 w-screen md:w-fit bg-gray-200 dark:bg-slate-800 text-4xl grid grid-cols-4 md:grid-cols-1 border-t-2 md:border-0">
      <h2 className="absolute scale-0">Toolbar</h2>
      <ScreenReaderToggle screenReader={screenReader} setScreenReader={setScreenReader} />
      {isNew ?
        <button onClick={() => setPrompt ? setPrompt(true) : undefined} className={buttonStyle(false)}><FontAwesomeIcon icon={faArrowsRotate} /><span className="absolute scale-0">Regenerate</span></button> : <></>
      }
      <SaveButton map={map} new={isNew} />
    </div>
  )
}