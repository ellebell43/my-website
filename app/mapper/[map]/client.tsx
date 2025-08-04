'use client'

import { map } from "@/lib/util/types"
import { useParams } from "next/navigation"

export default function MapperMapClient(props: { map: map }) {
  const params = useParams()
  return (
    <div>
      <p>Hello world!</p>
      <p>{params.map}</p>
      <p>test</p>
    </div>
  )
}