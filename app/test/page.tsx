'use client'

import { useState } from "react";
import { Hex } from "../components/map-components";
import StarSystem from "../util/starsystem";

export default function Page() {
  const [details, setDetails] = useState<StarSystem | undefined>()
  return (
    <div>
      <Hex id="0101" setDetails={setDetails} details={details} possibleSystem={true} />
    </div>
  )
}