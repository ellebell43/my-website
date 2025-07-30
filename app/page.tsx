'use client'

import { useState } from "react"
import Link from "next/link"
import { Hex, HexCol, Sector } from "./components/map-components"
import { randomSystem, System } from "./components/system"

export default function Page() {
  const [system, setSystem] = useState<System>()

  return (
    <>
      <Link href="mapper">Mapper</Link>
    </>
  )
}