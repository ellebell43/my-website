'use client'

import { useState } from "react"
import { Hex, HexCol, Sector } from "./components/hexes"
import { randomSystem, System } from "./components/system"

export default function Page() {
  const [system, setSystem] = useState<System>()

  return (
    <>
      <Sector />
      <div>
        {/* <button
          className="border p-2 hover:pointer"
          onClick={() => {
            let sys = randomSystem("Test", 1, 1);
            setSystem(sys);
            console.log("new system generated")
            console.log(sys)
          }}
        >
          Generate system
        </button> */}
        {/* <p>{system ? system.getUWP() : ""}</p> */}
      </div>
    </>
  )
}