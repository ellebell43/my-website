import { useEffect, useState } from "react"

export default function Pomodoro() {
  let [mode, setMode] = useState<"Pomo" | "Stopwatch">("Pomo")
  let [active, setActive] = useState(false)
  let [isBreak, setIsBreak] = useState(false)
  let [elapsedTime, setElapsedTime] = useState(0) // time in seconds
  let [timerLength, setTimerLength] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [active])

  const resetTime = () => {
    setActive(false)
    setElapsedTime(0)
  }

  const parseTime = () => {
    let hours = Math.floor(elapsedTime / 60 / 60)
    let minutes = Math.floor((elapsedTime - (hours * 60 * 60)) / 60)
    let seconds = Math.floor(elapsedTime - (minutes * 60))

    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 border">
      <div className="md:w-[400px] w-[250px] md:h-[400px] h-[250px] border-8 rounded-[100%] flex items-center-safe justify-center shadow-xl bg-blue-100 dark:bg-blue-800">
        <p className="md:text-[80px] text-[50px]">{parseTime()}</p>
      </div>
      <div className="flex gap-4">
        <button className="hover:cursor-pointer" onClick={() => setActive(true)}>Start</button>
        <button className="hover:cursor-pointer" onClick={() => setActive(false)}>Stop</button>
        <button className="hover:cursor-pointer" onClick={() => resetTime()}>Reset</button>
      </div>
    </div>
  )
}