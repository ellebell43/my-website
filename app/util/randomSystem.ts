import { clampToDiceRange, clampToTechRange, clampToZero, hexify, roll1D3, roll2D6, rollD66 } from "./functions"
import StarSystem from "./starsystem"
import { facilityCode, faction, sizeRange, starportRange, travelCode, xRange, yRange } from "./types"

// Create a random star system
export const randomSystem = (name: string, x: xRange, y: yRange): StarSystem => {
  // size
  let size = roll2D6() - 2

  // atmosphere
  let atmos = roll2D6() - 7 + size
  atmos = clampToZero(atmos)

  // temperature
  let temp = roll2D6()
  switch (atmos) {
    case (2 | 3): atmos -= 2; break;
    case (4 | 5 | 14): atmos -= 1; break;
    case (8 | 9): atmos += 1; break;
    case (10 | 13 | 15): atmos += 2; break;
    case (11 | 12): atmos += 6; break;
  }
  temp = clampToDiceRange(temp)

  // hydrographics
  let hydro = roll2D6() - 7 + atmos
  if (size == 0 || size == 1) hydro = 0
  if (atmos == 0 || atmos == 1 || atmos > 9) hydro -= 4
  hydro = clampToZero(hydro)

  // population
  let pop = roll2D6()

  // government
  let gov = roll2D6() - 7 + pop
  gov = clampToZero(gov)

  // law
  let law = roll2D6() - 7 + gov
  law = clampToZero(law)

  // starport
  let num = roll2D6()
  //Determine modifier and adjust number rolled
  if (pop <= 2) {
    num -= 2
  } else if (pop <= 4) {
    num -= 1
  } else if (pop >= 10) {
    num += 2
  } else if (pop >= 8) {
    num += 1
  }
  // Determine starport class from number
  let starport: starportRange
  if (num >= 11) {
    starport = "A"
  } else if (num >= 9) {
    starport = "B"
  } else if (num >= 7) {
    starport = "C"
  } else if (num >= 5) {
    starport = "E"
  } else if (num >= 3) {
    starport = "E"
  } else {
    starport = "X"
  }

  // Tech level
  let tech: number = roll1D3()
  // Figure out modifiers based on other UWP values
  switch (starport) {
    case ("A"): tech += 6; break;
    case ("B"): tech += 4; break;
    case ("C"): tech += 2; break;
    case ("X"): tech -= 4; break;
  }
  switch (size) {
    case (0 || 1): tech += 2; break;
    case (Number(2) || 3 || 4): tech += 1; break;
  }
  switch (atmos) {
    case (1 || 2 || 3 || 10 || 11 | 12 | 13 | 14 | 15): tech += 1; break;
  }
  switch (hydro) {
    case (0 || 9): tech += 1; break;
    case (10): tech += 2; break;
  }
  switch (pop) {
    case (1 | 2 | 3 | 4 | 5 | 8): tech += 1; break;
    case (9): tech += 2; break;
    case (10): tech += 4; break;
  }
  switch (gov) {
    case (0 | 5): tech += 1; break;
    case (7): tech += 2; break;
    case (13 | 14): tech -= 2; break;
  }
  switch (atmos) {
    case (0 | 1 | 10 | 15): if (tech < 8) tech = 8; break;
    case (2 | 3 | 13 | 14): if (tech < 5) tech = 5; break;
    case (4 | 7 | 9): if (tech < 3) tech = 3; break;
    case (11): if (tech < 9) tech = 9; break;
    case (12): if (tech < 10) tech = 10; break;
  }
  tech = clampToTechRange(tech)

  // Travel code
  let travelCode: travelCode = "G"
  if (atmos >= 10 || gov == 0 || gov == 7 || gov == 10 || law == 0 || law >= 9) travelCode = "A"

  // Factions
  const factionCount = roll1D3()
  let factions: faction[] = []
  for (let i = 0; i++; i < factionCount) {
    let strength = roll2D6()
    let factionGov = hexify(roll2D6() - 7 + gov)
    //@ts-expect-error
    let newFaction: faction = { strength, gov: factionGov }
    factions.push(newFaction)
  }

  // culture
  const culture = rollD66()

  // facilities
  let facArr: facilityCode[] = []
  if (starport == "A") {
    // Highport
    const hDM = (tech >= 9 && tech <= 11 ? 1 : tech >= 12 ? 2 : 0) + (pop >= 9 ? 1 : pop <= 6 ? -1 : 0)
    if (roll2D6() + hDM >= 6) facArr.push("H")
    // Military
    if (roll2D6() >= 8) facArr.push("M")
    // Naval
    if (roll2D6() >= 8) facArr.push("N")
    // Scout
    if (roll2D6() >= 10) facArr.push("S")
  } else if (starport == "B") {
    // Highport
    const hDM = (tech >= 9 && tech <= 11 ? 1 : tech >= 12 ? 2 : 0) + (pop >= 9 ? 1 : pop <= 6 ? -1 : 0)
    if (roll2D6() + hDM >= 8) facArr.push("H")
    // Military
    if (roll2D6() >= 8) facArr.push("M")
    // Naval
    if (roll2D6() >= 8) facArr.push("N")
    // Scout
    if (roll2D6() >= 9) facArr.push("S")
  } else if (starport == "C") {
    // Highport
    const hDM = (tech >= 9 && tech <= 11 ? 1 : tech >= 12 ? 2 : 0) + (pop >= 9 ? 1 : pop <= 6 ? -1 : 0)
    if (roll2D6() + hDM >= 10) facArr.push("H")
    // Military
    if (roll2D6() >= 10) facArr.push("M")
    // Scout
    if (roll2D6() >= 9) facArr.push("S")
  } else if (starport == "D") {
    // Highport
    const hDM = (tech >= 9 && tech <= 11 ? 1 : tech >= 12 ? 2 : 0) + (pop >= 9 ? 1 : pop <= 6 ? -1 : 0)
    if (roll2D6() + hDM >= 12) facArr.push("H")
    // Scout
    if (roll2D6() >= 8) facArr.push("S")
    // Corsair
    const cDM = law == 0 ? 2 : law >= 2 ? -2 : 0
    if (roll2D6() + cDM >= 12) facArr.push("C")
  }
  else if (starport == "E" || starport == "X") {
    const cDM = law == 0 ? 2 : law >= 2 ? -2 : 0
    if (roll2D6() + cDM >= 10) facArr.push("C")
  }

  // hexify values
  //@ts-ignore
  size = hexify(size)
  //@ts-ignore
  atmos = hexify(atmos)
  //@ts-ignore
  hydro = hexify(hydro)
  //@ts-ignore
  pop = hexify(pop)
  //@ts-ignore
  gov = hexify(gov)

  /**
   * constructor(x: xRange,
       y: yRange,
       name: string,
       starport: starportRange,
       size: sizeRange,
       atmos: fullRange,
       hydro: sizeRange,
       pop: popRange,
       gov: fullRange,
       law: fullRange,
       tech: numRange | 10 | 11 | 12 | 13 | 14 | 15,
       travelCode?: travelCode,
       temp?: diceRange,
       factions?: faction[],
       culture?: d66Range) {
   */

  //@ts-expect-error
  let newSys = new StarSystem(x, y, name, starport, size, atmos, hydro, pop, gov, law, tech, travelCode, temp, factions, culture, facArr)
  return newSys
}