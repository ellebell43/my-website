import { faPentagon, faPlay, faStar, faStarOfLife } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Planet = (props: { water: boolean, asteroid: boolean }) => {
  const { water } = props
  if (!props.asteroid) {
    return (
      <div className={`${water ? "bg-blue-400" : "bg-yellow-700"} rounded-full border w-[50px] h-[50px]`} />
    )
  } else {
    const style = "w-[.1in] h-[.1in] border rounded-full bg-slate-400"
    return (
      <div className="flex flex-col items-center justify-center gap-1 relative bottom-3 rotate-45 scale-75">
        <div className="flex gap-1">
          <div className={`${style} w-[.17in] h-[.17in] relative top-4`} />
          <div className="flex flex-col gap-1">
            <div className={`${style} relative top-2 right-2`} />
            <div className={`${style} relative top-2`} />
            <div className={`${style} w-[.12in] h-[.12in] relative right-6 top-2`} />
          </div>
        </div>
        <div className={`${style} w-[.14in] h-[.14in] relative bottom-1 left-1`} />
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
    <FontAwesomeIcon className="absolute top-[40px] left-[-15px] text-xs text-black dark:text-gray-100" icon={faStar} />
  )
}

export const MilitaryBase = () => {
  return (
    <FontAwesomeIcon className="absolute top-[60px] left-[-20px] text-xs text-black  dark:text-gray-100" icon={faPentagon} />
  )
}

export const ScoutBase = () => {
  return (
    <FontAwesomeIcon className="absolute top-[80px] left-[-15px] text-xs text-black  dark:text-gray-100 -rotate-90" icon={faPlay} />
  )
}