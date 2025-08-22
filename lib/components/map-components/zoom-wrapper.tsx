import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

export default function ZoomWrapper(props: { children: React.ReactNode }) {
  let [zoom, setZoom] = useState<1 | 2 | 3 | 4>(4)

  const newZoom = (up: boolean) => {
    let newZoom: 1 | 2 | 3 | 4 = zoom
    if (up && zoom < 4) newZoom++
    if (!up && zoom > 1) newZoom--
    //@ts-expect-error
    setZoom(newZoom)
  }
  return (
    <>
      <div className="fixed top-2 right-2 flex flex-col z-50" id="zoom-wrapper">
        <button
          className={`border text-xs flex items-center justify-center ${zoom < 4 ? "bg-white dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-600"} h-[40px] w-[40px] hover:bg-gray-100 dark:hover:bg-gray-600 disabled:hover:bg-gray-200 dark:disabled:bg-gray-600 hover:cursor-pointer disabled:hover:cursor-auto`}
          onClick={() => newZoom(true)}
          disabled={zoom === 4}
        >
          <FontAwesomeIcon icon={faPlus} />
          <p className="scale-0 absolute">Increase Zoom</p>
        </button>
        <button
          className={`border text-xs flex items-center justify-center ${zoom > 1 ? "bg-white dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-600"} h-[40px] w-[40px] hover:bg-gray-100 dark:hover:bg-gray-600 disabled:hover:bg-gray-200 dark:disabled:bg-gray-600 hover:cursor-pointer disabled:hover:cursor-auto`}
          onClick={() => newZoom(false)}
          disabled={zoom === 1}
        >
          <FontAwesomeIcon icon={faMinus} />
          <p className="scale-0 absolute">Decrease Zoom</p>
        </button>
        <p className="border text-center text-[8px] bg-gray-200 dark:bg-gray-700">Zoom {zoom}</p>
      </div>
      <div className={`origin-top-left pb-32 md:pb-28`} style={{ transform: `scale(${zoom === 4 ? "1" : zoom === 3 ? ".75" : zoom === 2 ? ".50" : ".25"})` }}>
        {props.children}
      </div>
    </>
  )
}