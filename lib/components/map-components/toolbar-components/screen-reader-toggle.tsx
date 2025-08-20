import { faBook, faTable, faTableCells } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { buttonStyle } from "../toolbar"

export default function ScreenReaderToggle(props: { screenReader: boolean, setScreenReader: Function }) {
  const { screenReader, setScreenReader } = props
  return <button onClick={() => setScreenReader(!screenReader)} className={`${buttonStyle(screenReader)}`}><FontAwesomeIcon icon={faTableCells} /><span className="absolute scale-0">Screen Reader Toggle</span></button>
}