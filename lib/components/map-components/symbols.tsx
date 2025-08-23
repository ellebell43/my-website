import { faPentagon, faPlay, faStar, faStarOfLife } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Planet = (props: { water: boolean, asteroid: boolean }) => {
  const { water } = props
  if (!props.asteroid) {
    return (
      <div className={`${water ? "bg-blue-400 dark:bg-blue-900" : "bg-yellow-700 dark:bg-yellow-900"} rounded-full border w-[50px] h-[50px]`} />
    )
  } else {
    const style = "absolute border rounded-full bg-gray-400 dark:bg-gray-600"
    return (
      <div className="relative flex flex-col items-center justify-center gap-1 rounded-full w-[50px] h-[50px] rotate-45">
        <div className={`${style} w-[6px] h-[6px] left-6 top-2`} />
        <div className={`${style} w-[10px] h-[10px] right-2 top-3`} />
        <div className={`${style} w-[10px] h-[10px] top-8`} />
        <div className={`${style} w-[14px] h-[14px] left-3 top-4`} />
        <div className={`${style} w-[8px] h-[8px] bottom-[16px] right-3`} />
      </div>
    )
  }
}

export const GasGiant = () => {
  return (
    <div className="absolute top-[.4in] right-[-.2in]">
      <div className="bg-black dark:bg-gray-100 rounded-full w-[15px] h-[15px]" />
      <div className="border-2 border-black dark:border-gray-100 rounded-[100%] w-[25px] h-[8px] absolute top-[4px] left-[-5px] rotate-12" />
    </div>
  )
}

export const NavalBase = () => {
  return (
    <FontAwesomeIcon className="absolute top-[45px] left-[-15px] text-xs text-black dark:text-gray-100 w-3 h-3" icon={faStar} />
  )
}

export const MilitaryBase = () => {
  return (
    <FontAwesomeIcon className="absolute top-[65px] left-[-23px] text-xs text-black  dark:text-gray-100 w-3 h-3" icon={faPentagon} />
  )
}

export const ScoutBase = () => {
  return (
    <FontAwesomeIcon className="absolute top-[85px] left-[-15px] text-xs text-black  dark:text-gray-100 -rotate-90 w-3 h-3" icon={faPlay} />
  )
}