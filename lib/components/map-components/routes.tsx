'use client'

import { createGridIDString } from "@/lib/util/functions";
import { route } from "@/lib/util/types";
import React from "react";

export default function Routes(props: { routes: route[] }) {
  const { routes } = props

  return <div>
    {routes.map((a, ai) => {
      return a.segments.map((b, bi) => {
        // get grid ids of both ends of the segment
        const id1 = createGridIDString(b.x1, b.y1)
        const id2 = createGridIDString(b.x2, b.y2)
        // Find corresponding HTML elements and get their position
        const item1 = document.getElementById(`id${id1}`)?.getBoundingClientRect()
        const item2 = document.getElementById(`id${id2}`)?.getBoundingClientRect()
        // If neither item exists, return nothing
        if (!item1 || !item2) return <></>
        // Get items center position instead of a position of a corner
        const zoomScrollY = document.querySelector("#map-container")?.firstElementChild?.scrollTop
        const zoomScrollX = document.querySelector("#map-container")?.firstElementChild?.scrollLeft
        const scrollX = zoomScrollX ? zoomScrollX : 0
        const scrollY = zoomScrollY ? zoomScrollY : 0
        const pos1 = { x: item1.left + (item1.width / 2) + scrollX, y: item1.top + (item1.height / 2) + scrollY }
        const pos2 = { x: item2.left + (item1.width / 2) + scrollX, y: item2.top + (item1.height / 2) + scrollY }
        return (
          <svg id={`route-${ai}-segment-${bi}`} key={`route-${ai}-segment-${bi}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} className="opacity-50 pointer-events-none overflow-visible" >
            <title>{a.name} segment</title>
            <desc>Connecting {id1} to {id2}</desc>
            <line stroke={a.color} strokeWidth={item1.width / 20} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} strokeLinecap="round" />
          </svg>
        )
      })
    })}
  </div>
}