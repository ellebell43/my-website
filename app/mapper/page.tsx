'use client'

import { useState } from "react"
import { Sector, Subsector } from "../components/map-components"

export default function Page() {
  const [generateSystems, setGenerateSystems] = useState(true)
  const [sector, setSector] = useState(false)
  const [prompt, setPrompt] = useState(true)

  // Component for selecting grid size (subsector vs sector) and if systems are generated
  const InitPrompt = () => {
    return (
      <div className="dark:bg-slate-900 bg-slate-100 min-h-screen min-w-scren">
        <h1 className="text-3xl font-bol text-center mb-2 py-8">Traveller Map Tool</h1>
        <form onSubmit={() => setPrompt(false)} className="bg-slate-100 dark:bg-slate-800 shadow border rounded w-fit mx-auto p-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center justify-start">
            <input type="checkbox" id="generate-systems" name="generate-systems" onChange={() => { setGenerateSystems(!generateSystems) }} checked={generateSystems} />
            <label htmlFor="generate-systems">Generate Systems</label>
          </div>
          <div className="flex gap-4 justify-start items-center">
            <input type="radio" id="subsector" name="sector" onChange={() => { setSector(false) }} checked={!sector} />
            <label htmlFor="subsector">Subsector (8 x 10)</label>
          </div>
          <div className="flex gap-4 justify-start items-center">
            <input type="radio" id="sector" name="sector" onChange={() => { setSector(true) }} checked={sector} />
            <label htmlFor="sector">Sector (32 x 40)</label>
          </div>
          <button type="submit" className="border shadow rounded py-2 dark:bg-slate-800 dark:hover:bg-slate-700 bg-slate-200 hover:bg-gray-100 transition-all hover:cursor-pointer">Generate Map</button>
        </form>
      </div>
    )
  }

  if (prompt) return <InitPrompt />
  return (
    <div>
      {/* REGENERATE BUTTON */}
      <button className="button-link fixed top-6 left-6 z-50" onClick={() => setPrompt(true)}>Regenerate</button>
      <div className="overflow-scroll">
        {sector ? <Sector generateSystems={generateSystems} /> : <Subsector generateSystems={generateSystems} startX={1} startY={1} sector={false} />}
      </div>
    </div>
  )
}

