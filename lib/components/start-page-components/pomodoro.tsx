import { useEffect, useState } from "react"

export default function Pomodoro() {
  let [mode, setMode] = useState<"Pomo" | "Stopwatch">("Pomo")
  let [active, setActive] = useState(false)
  let [isBreak, setIsBreak] = useState(false)
  let [elapsedTime, setElapsedTime] = useState(0) // time in seconds
  let [timerLength, setTimerLength] = useState(25 * 60) // 25 minutes by default

  const defaultBreak = 10 * 60 // 10 minutes
  const defaultTimer = 25 * 60 // 25 minutes

  // initialize a 1 second and increase time elapsed if active
  // remove 
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (active) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [active])

  useEffect(() => { if (elapsedTime === timerLength && mode === "Pomo") completePomo() }, [elapsedTime])

  const resetTime = () => {
    setActive(false)
    setElapsedTime(0)
  }

  const completePomo = () => {
    const timerDoneSound = new Audio('audio/timer-complete.mp3')
    timerDoneSound.play()
    setActive(false)
  }

  const parseTime = () => {
    let minutes = mode == "Stopwatch" ? Math.floor(elapsedTime / 60) : Math.floor((timerLength - elapsedTime) / 60)
    let secondsRemaining = elapsedTime - (minutes * 60)
    let seconds = mode == "Stopwatch" ? Math.floor(secondsRemaining) : Math.floor(timerLength - elapsedTime - (minutes * 60))

    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
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