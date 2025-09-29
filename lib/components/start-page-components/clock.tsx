import { useEffect, useState } from "react"

export default function Clock() {
  let [time, setTime] = useState<string>()
  useEffect(() => { parseTime() }, [])

  const startTimer = () => { setTimeout(() => { parseTime(); startTimer() }, 5000) }

  startTimer()

  const parseTime = () => {
    const time = new Intl.DateTimeFormat('en-US', { timeZone: "US/Pacific", minute: '2-digit', hour: "2-digit", hour12: true }).format()
    setTime(time)
  }

  return (
    <p className="text-center text-[64px]">{time}</p>
  )
}