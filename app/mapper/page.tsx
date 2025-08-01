'use client'

import { useState } from "react"
import SelectButton from "../components/select-button"
import { Sector, Subsector } from "../components/map-components"

export default function Page() {
  const [generateSystems, setGenerateSystems] = useState(false)
  const [sector, setSector] = useState(false)
  const [prompt, setPrompt] = useState(true)

  // Component for selecting grid size (subsector vs sector) and if systems are generated
  const InitPrompt = () => {
    return (
      <div className="bg-slate-100 shadow border rounded w-fit mx-auto my-24 p-6 flex flex-col gap-4">
        <SelectButton enabled={generateSystems} setState={setGenerateSystems} label="Generate Systems" />
        <div className="flex gap-8">
          <SelectButton enabled={sector} setState={setSector} label="Sector" />
          <SelectButton enabled={!sector} setState={setSector} reverseSetEnable={true} label="Subsector" />
        </div>
        <button
          onClick={() => {
            setPrompt(false)
          }}
          className="button-link"
        >
          Confirm
        </button>
      </div>
    )
  }

  if (prompt) return <InitPrompt />
  return (
    <div>
      {/* REGENERATE BUTTON */}
      <button className="button-link fixed top-6 left-6 z-50 bg-white" onClick={() => setPrompt(true)}>Regenerate</button>
      {sector ? <Sector generateSystems={generateSystems} /> : <Subsector generateSystems={generateSystems} startX={1} startY={1} border={false} sector={false} />}
    </div>
  )
}

