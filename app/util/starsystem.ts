import { deHexify } from "./functions"
import { xRange, yRange, starportRange, sizeRange, fullRange, popRange, numRange, faction, d66Range, travelCode, diceRange, tradeCode } from "./types"

export default class StarSystem {
  // Class property types
  x: xRange
  y: yRange
  name: string
  starport: starportRange
  size: sizeRange
  atmos: fullRange
  hydro: sizeRange
  pop: popRange
  gov: fullRange
  law: fullRange
  tech: numRange | 10 | 11 | 12 | 13 | 14 | 15
  travelCode: travelCode
  temp?: diceRange
  factions?: faction[]
  culture?: d66Range
  tradeCodes?: tradeCode[]
  details?: string

  constructor(
    // constructor arguments
    x: xRange,
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
    // constructor body
    this.x = x;
    this.y = y
    this.name = name
    this.starport = starport
    this.size = size
    this.atmos = atmos
    this.hydro = hydro
    this.pop = pop
    this.gov = gov
    this.law = law
    this.tech = tech
    this.travelCode = travelCode ? travelCode : "G"
    this.temp = temp ? temp : undefined
    this.factions = factions ? factions : undefined
    this.culture = culture ? culture : undefined
    this.#determineTradeCodes()
  }
  // Use system data to determine trade codes
  #determineTradeCodes() {
    console.log("determining trade codes")
    console.log("system info: " + Boolean(this.size))
    let arr: tradeCode[] = []
    const atmos = deHexify(this.atmos)
    const size = deHexify(this.size)
    const hydro = deHexify(this.hydro)
    const pop = deHexify(this.pop)
    const gov = deHexify(this.gov)
    const law = deHexify(this.law)
    const tech = this.tech

    // Agricultural
    if ((atmos >= 4 && atmos <= 9) && (hydro >= 4 && hydro <= 8) && (pop >= 5 && pop <= 7)) arr.push("Ag")
    // Asteroids
    if (size == 0 && atmos == 0 && hydro == 0) arr.push("As")
    // Barren
    if (pop == 0 && gov == 0 && law == 0) arr.push("Ba")
    // Desert
    if ((atmos >= 2 && atmos <= 9) && hydro == 0) arr.push("De")
    // Fluid Oceans
    if (atmos >= 10 && hydro >= 1) arr.push("Fl")
    // Garden
    if ((size >= 6 && size <= 8) && (atmos == 5 || atmos == 6 || atmos == 7) && (hydro >= 5 && hydro <= 7)) arr.push("Ga")
    // High Pop
    if (pop >= 9) arr.push("Hi")
    // High Tech
    if (tech >= 12) arr.push("Ht")
    // Ice-Capped
    if (atmos <= 1 && hydro >= 1) arr.push("Ic")
    // Industrial
    if (pop >= 9 && (atmos <= 2 || atmos == 4 || atmos == 7 || atmos >= 9 && atmos <= 12)) arr.push("In")
    // Low Pop
    if (pop >= 1 && pop <= 3) arr.push("Lo")
    // Low Tech
    if (pop >= 1 && tech <= 5) arr.push("Lt")
    // Non-Agricultural
    if (atmos <= 3 && hydro <= 3 && pop >= 6) arr.push("Na")
    // Non-Industrial
    if (pop >= 4 && pop <= 6) arr.push("Ni")
    // Poor
    if ((atmos >= 2 && atmos <= 5) && hydro <= 3) arr.push("Po")
    // Rich
    if ((atmos == 6 || atmos == 8) && (pop >= 6 && pop <= 8) && (gov >= 4 && gov <= 9)) arr.push("Ri")
    // Vacuum
    if (atmos == 0) arr.push("Va")
    // Water World
    if (hydro >= 10 && ((atmos >= 3 && atmos <= 9) || atmos >= 13)) arr.push("Wa")
    this.tradeCodes = arr
  }

  // Condense system data to a UWP string
  getUWP(): string {
    const id = `${this.x < 10 ? "0" + String(this.x) : this.x}${this.y < 10 ? "0" + String(this.y) : this.y}`
    return `${this.name} ${id} ${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`
  }
  getUWPSmall(): string {
    return `${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`

  }
}