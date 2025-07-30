'use client'

import { SubSector } from "../components/map-components"
import { useState } from "react"

export default function Page() {
  const [subSector, setSubSector] = useState<typeof SubSector>()
  return (
    <>
      <button>Create Sub Sector</button>
      {subSector ? subSector : <></>}
    </>
  )
}