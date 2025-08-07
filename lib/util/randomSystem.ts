import { clampToDiceRange, clampToLawRange, clampToTechRange, clampToZero, hexify, roll1D3, roll1D6, roll2D6, rollD66 } from "./functions"
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
  let pop = roll2D6() - 2

  // government
  let gov = roll2D6() - 7 + pop
  gov = clampToZero(gov)

  // law
  let law = roll2D6() - 7 + gov
  law = clampToLawRange(law)

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
  let tech: number = roll1D6()
  // Figure out modifiers based on other UWP values
  switch (starport) {
    case ("A"): tech += 6; break;
    case ("B"): tech += 4; break;
    case ("C"): tech += 2; break;
    case ("X"): tech -= 4; break;
  }

  if (size <= 1) tech += 2
  else if (size >= 2 || size <= 4) tech += 1

  if (atmos >= 1 && atmos <= 3 || atmos >= 10) tech += 1

  if (hydro === 0 || hydro === 9) tech += 1
  else if (hydro >= 10) tech += 2

  if (pop >= 1 && pop <= 5 || pop === 8) tech += 1
  else if (pop === 9) tech += 2
  else if (pop === 10) tech += 4

  if (gov === 0 || gov === 5) tech += 1
  else if (gov === 7) tech += 2
  else if (gov === 13 || gov === 14) tech -= 2

  if ((atmos <= 1 || atmos === 10 || atmos === 15) && tech < 8) tech = 8
  if ((atmos == 2 || atmos == 3 || atmos === 13 || atmos === 14) && tech < 5) tech = 5
  if ((atmos == 4 || atmos == 7 || atmos === 9) && tech < 3) tech = 3
  if (atmos === 11 && tech < 9) tech = 9
  if (atmos === 12 && tech < 10) tech = 10
  tech = clampToTechRange(tech)

  // Travel code
  let travelCode: travelCode = "G"
  if (atmos >= 10) {
    travelCode = "A"
  } else if (gov === 0 || gov === 7 || gov === 10) {
    travelCode = "A"
  } else if (law === 0 || law >= 9) {
    travelCode = "A"
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
    //@ts-expect-error
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
       tech: numRange | 10 | 11 | 12 | 13 | 14 | 15 {
   */

  //@ts-expect-error
  let newSys = new StarSystem(x, y, name, starport, size, atmos, hydro, pop, gov, law, tech, travelCode)
  return newSys
}