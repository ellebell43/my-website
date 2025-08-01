import { clampToDiceRange, deHexify, roll1D6, roll2D6 } from "./functions"
import { xRange, yRange, starportRange, sizeRange, fullRange, popRange, numRange, faction, d66Range, travelCode, diceRange, tradeCode, facilityCode } from "./types"

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
  temp: diceRange
  factions?: faction[]
  culture?: d66Range
  tradeCodes?: tradeCode[]
  facilities: facilityCode[]
  details?: string
  governmentType: string
  diameter: number
  gravity: number
  starportQuality: string
  facilitiesVerbose: string[]
  berthingCost: number
  basesVerbose: string[]
  fuelType: string
  tradeCodesVerbose: string[]
  gasGiant: boolean
  atmosphereType: string
  tempType: string
  hydroType: string

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
    culture?: d66Range,
    facilities?: facilityCode[],) {
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
    this.temp = temp ? temp : this.#determineTemp()
    this.factions = factions ? factions : undefined
    this.culture = culture ? culture : undefined
    this.facilities = facilities ? facilities : []
    this.#determineTradeCodes()
    this.governmentType = this.#getGovernmentType()
    this.diameter = this.#getDiameter()
    this.gravity = this.#getGravity()
    this.starportQuality = this.#getStarportQuality()
    this.facilitiesVerbose = this.#getFacilitiesArrayVerbose()
    this.berthingCost = this.#getBerthingCost()
    this.basesVerbose = this.#getBasesArrayVerbose()
    this.fuelType = this.#getFuelType()
    this.tradeCodesVerbose = this.#getTradeCodesVerbose()
    this.gasGiant = roll2D6() < 10
    this.atmosphereType = this.#getAtmosphereType()
    this.tempType = this.#getTempType()
    this.hydroType = this.#getHydroType()
  }
  // Use system data to determine trade codes
  #determineTradeCodes() {
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
    return `${this.name} ${id} ${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech} ${this.facilities.toString().replaceAll(",", " ")} ${this.tradeCodes?.toString().replaceAll(",", " ")} ${this.travelCode}`
  }
  // Condense system to UWP string, shorthand for hex maps
  getUWPSmall(): string {
    return `${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`
  }
  // Get grid ID via x,y values
  getGridID(): string {
    return `${this.x < 10 ? "0" + String(this.x) : this.x}${this.y < 10 ? "0" + String(this.y) : this.y}`
  }
  // Get verbose government data
  #getGovernmentType(): string {
    switch (this.gov) {
      case (0): return "None";
      case (1): return "Corporation";
      case (2): return "Participating Democracy";
      case (3): return "Self-Perpetuating Oligarchy";
      case (4): return "Representative Democracy";
      case (5): return "Feudal Technocracy";
      case (6): return "Captive Government";
      case (7): return "Balkanisation";
      case (8): return "Civil Service Bureaucracy";
      case (9): return "Impersonal Bureaucracy";
      case ("A"): return "Charismatic Dictator";
      case ("B"): return "Non-Charismatic Leader";
      case ("C"): return "Charismatic Oligarchy";
      case ("D"): return "Religious Dictatorship";
      case ("E"): return "Religious Autocracy";
      case ("F"): return "Totalitarian Oligarchy";
    }
  }

  #getDiameter(): number {
    switch (this.size) {
      case (0): return 1000;
      case (1): return 1600;
      case (2): return 3200;
      case (3): return 4800;
      case (4): return 6400;
      case (5): return 8000;
      case (6): return 9600;
      case (7): return 11200;
      case (8): return 12800;
      case (9): return 14400;
      case ("A"): return 16000;
    }
  }

  #getGravity(): number {
    switch (this.size) {
      case (0): return 0;
      case (1): return .05;
      case (2): return .15;
      case (3): return .25;
      case (4): return .35;
      case (5): return .45;
      case (6): return .7;
      case (7): return .9;
      case (8): return 1;
      case (9): return 1.25;
      case ("A"): return 1.4;
    }
  }

  #getStarportQuality(): string {
    switch (this.starport) {
      case ("A"): return "Excellent";
      case ("B"): return "Good";
      case ("C"): return "Routine";
      case ("D"): return "Poor";
      case ("E"): return "Frontier";
      case ("X"): return "None";
    }
  }

  #getFacilitiesArrayVerbose(): string[] {
    let arr: string[] = []
    this.facilities.forEach(e => {
      switch (e) {
        case ("H"): arr.push("Highport"); break;
      }
    })
    switch (this.starport) {
      case ("A"): arr.push("Shipyard (all)"); arr.push("Repair"); break;
      case ("B"): arr.push("Shipyard (spacecraft)"); arr.push("Repair"); break;
      case ("C"): arr.push("Shipyard (small craft)"); arr.push("Repair"); break;
      case ("D"): arr.push("Limited Repair)"); arr.push("Limited Repair"); break;
    }
    return arr
  }

  #getBasesArrayVerbose(): string[] {
    let arr: string[] = []
    this.facilities.forEach(e => {
      switch (e) {
        case ("M"): arr.push("Military"); break;
        case ("N"): arr.push("Naval"); break;
        case ("S"): arr.push("Scout"); break;
        case ("D"): arr.push("Depot"); break;
        case ("C"): arr.push("Corsair"); break;
      }
    })
    return arr
  }

  #getBerthingCost(): number {
    switch (this.starport) {
      case ("A"): return roll1D6() * 1000;
      case ("B"): return roll1D6() * 500;
      case ("C"): return roll1D6() * 100;
      case ("D"): return roll1D6() * 10;
      case ("E"): return 0;
      case ("X"): return 0;
    }
  }

  #getFuelType(): string {
    switch (this.starport) {
      case ("A"): return "Refined"
      case ("B"): return "Refined"
      case ("C"): return "Unrefined"
      case ("D"): return "Unrefined"
      case ("E"): return "None"
      case ("X"): return "None"
    }
  }

  #getTradeCodesVerbose(): string[] {
    let tradeArr: string[] = []
    this.tradeCodes?.forEach(e => {
      switch (e) {
        case ("Ag"): tradeArr.push("Agricultural"); break;
        case ("As"): tradeArr.push("Asteroid"); break;
        case ("Ba"): tradeArr.push("Barren"); break;
        case ("De"): tradeArr.push("Desert"); break;
        case ("Fl"): tradeArr.push("Fluid Oceans"); break;
        case ("Ga"): tradeArr.push("Garden"); break;
        case ("Hi"): tradeArr.push("High Population"); break;
        case ("Ht"): tradeArr.push("High Technology"); break;
        case ("Ic"): tradeArr.push("Ice-Capped"); break;
        case ("In"): tradeArr.push("Industrial"); break;
        case ("Lo"): tradeArr.push("Low Population"); break;
        case ("Lt"): tradeArr.push("Low Technology"); break;
        case ("Na"): tradeArr.push("Non-Agricultural"); break;
        case ("Ni"): tradeArr.push("Non-Industrial"); break;
        case ("Po"): tradeArr.push("Poor"); break;
        case ("Ri"): tradeArr.push("Rich"); break;
        case ("Va"): tradeArr.push("Vacuum"); break;
        case ("Wa"): tradeArr.push("Water World"); break;
      }
    })
    return tradeArr;
  }

  #getAtmosphereType(): string {
    switch (this.atmos) {
      case (0): return "None"
      case (1): return "Trace"
      case (2): return "Very Thin, Tainted"
      case (3): return "Very Thin"
      case (4): return "Thin, Tainted"
      case (5): return "Thin"
      case (6): return "Standard"
      case (7): return "Standard, Tainted"
      case (8): return "Dense"
      case (9): return "Dense, Tainted"
      case ("A"): return "Exotic"
      case ("B"): return "Corrosive"
      case ("C"): return "Insidious"
      case ("D"): return "Very Dense"
      case ("E"): return "Low"
      case ("F"): return "Unusual"
    }
  }

  #determineTemp(): diceRange {
    let dm = 0
    if (this.atmos === 2 || this.atmos === 3) dm = -2
    else if (this.atmos === 4 || this.atmos === 5 || this.atmos === "E") dm = -1
    else if (this.atmos === 8 || this.atmos === 9) dm = 1
    else if (this.atmos === "A" || this.atmos === "D" || this.atmos === "F") dm = 2
    else if (this.atmos === "B" || this.atmos === "C") dm = 6
    return clampToDiceRange(roll2D6() + dm)
  }

  #getTempType(): string {
    if (this.temp <= 2) return "Frozen, -51° or less"
    if (this.temp >= 3 && this.temp <= 4) return "Cold, -51° to 0°"
    if (this.temp >= 5 && this.temp <= 9) return "Temperate, 0° to 30°"
    if (this.temp >= 10 && this.temp <= 11) return "Hot, 31° to 80°"
    return "Boiling, 81° or more"
  }

  #getHydroType(): string {
    switch (this.hydro) {
      case (0): return "Desert World (0 - 5%)"
      case (1): return "Dry World (6 - 15%)"
      case (2): return "Few Small Seas (16 - 25%)"
      case (3): return "Small Seas and Oceans (26 - 35%)"
      case (4): return "Wet World (36 - 45%)"
      case (5): return "A Large Ocean (46 - 55%)"
      case (6): return "Large Oceans (56 - 65%)"
      case (7): return "Earth-like (66 - 75%)"
      case (8): return "A Few Islands (76 - 85%)"
      case (9): return "Almost Only Water (86 - 95%)"
      case ("A"): return "Waterworld (96 - 100%)"
    }
  }
}