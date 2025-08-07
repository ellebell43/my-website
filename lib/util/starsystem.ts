import { clampToDiceRange, deHexify, hexify, roll1D3, roll1D6, roll2D6, rollD66 } from "./functions"
import { xRange, yRange, starportRange, sizeRange, fullRange, popRange, numRange, faction, d66Range, travelCode, diceRange, tradeCode, facilityCode, lawRange } from "./types"

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
  law: lawRange
  tech: numRange | 10 | 11 | 12 | 13 | 14 | 15
  travelCode: travelCode
  temp: diceRange
  gasGiant: boolean
  factions: faction[]
  culture: d66Range
  facilities: facilityCode[]
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
    law: lawRange,
    tech: numRange | 10 | 11 | 12 | 13 | 14 | 15,
    travelCode?: travelCode,
    temp?: diceRange,
    factions?: faction[],
    culture?: d66Range,
    facilities?: facilityCode[],
    details?: string,
    gasGiant?: boolean) {
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
    this.factions = factions ? factions : this.#determineFactions()
    this.culture = culture ? culture : rollD66()
    this.facilities = facilities ? facilities : this.#determineFacilities()
    this.details = details
    this.gasGiant = gasGiant !== undefined ? gasGiant : roll2D6() < 10
  }

  // === PRIVATE FUNCTIONS FOR DETERMINING OBJECT PROPERTIES ===

  #determineFactions() {
    const factionCount = roll1D3()
    let factions: faction[] = []
    for (let i = 0; i < factionCount; i++) {
      let strength = roll2D6()
      let factionGov = hexify(clampToDiceRange(roll2D6() - 7 + deHexify(this.gov)))
      //@ts-expect-error
      let newFaction: faction = { strength, gov: factionGov }
      factions.push(newFaction)
    }
    return factions
  }

  #determineFacilities() {
    let facArr: facilityCode[] = []
    if (this.starport == "A") {
      // Highport
      const hDM = (this.tech >= 9 && this.tech <= 11 ? 1 : this.tech >= 12 ? 2 : 0) + (deHexify(this.pop) >= 9 ? 1 : deHexify(this.pop) <= 6 ? -1 : 0)
      if (roll2D6() + hDM >= 6) facArr.push("H")
      // Military
      if (roll2D6() >= 8) facArr.push("M")
      // Naval
      if (roll2D6() >= 8) facArr.push("N")
      // Scout
      if (roll2D6() >= 10) facArr.push("S")
    } else if (this.starport == "B") {
      // Highport
      const hDM = (this.tech >= 9 && this.tech <= 11 ? 1 : this.tech >= 12 ? 2 : 0) + (deHexify(this.pop) >= 9 ? 1 : deHexify(this.pop) <= 6 ? -1 : 0)
      if (roll2D6() + hDM >= 8) facArr.push("H")
      // Military
      if (roll2D6() >= 8) facArr.push("M")
      // Naval
      if (roll2D6() >= 8) facArr.push("N")
      // Scout
      if (roll2D6() >= 9) facArr.push("S")
    } else if (this.starport == "C") {
      // Highport
      const hDM = (this.tech >= 9 && this.tech <= 11 ? 1 : this.tech >= 12 ? 2 : 0) + (deHexify(this.pop) >= 9 ? 1 : deHexify(this.pop) <= 6 ? -1 : 0)
      if (roll2D6() + hDM >= 10) facArr.push("H")
      // Military
      if (roll2D6() >= 10) facArr.push("M")
      // Scout
      if (roll2D6() >= 9) facArr.push("S")
    } else if (this.starport == "D") {
      // Highport
      const hDM = (this.tech >= 9 && this.tech <= 11 ? 1 : this.tech >= 12 ? 2 : 0) + (deHexify(this.pop) >= 9 ? 1 : deHexify(this.pop) <= 6 ? -1 : 0)
      if (roll2D6() + hDM >= 12) facArr.push("H")
      // Scout
      if (roll2D6() >= 8) facArr.push("S")
      // Corsair
      const cDM = this.law == 0 ? 2 : this.law >= 2 ? -2 : 0
      if (roll2D6() + cDM >= 12) facArr.push("C")
    }
    else if (this.starport == "E" || this.starport == "X") {
      const cDM = this.law == 0 ? 2 : this.law >= 2 ? -2 : 0
      if (roll2D6() + cDM >= 10) facArr.push("C")
    }
    return facArr
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

  // === UWP AND GRID ID GET FUNCTIONS ===

  // Condense system data to a UWP string
  getUWP(): string {
    const id = `${this.x < 10 ? "0" + String(this.x) : this.x}${this.y < 10 ? "0" + String(this.y) : this.y}`
    return `${this.name} ${id} ${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech} ${this.facilities.toString().replaceAll(",", " ")} ${this.getTradeCodes().toString().replaceAll(",", " ")} ${this.travelCode}`
  }
  getUWPBroken(): string[] {
    const id = `${this.x < 10 ? "0" + String(this.x) : this.x}${this.y < 10 ? "0" + String(this.y) : this.y}`
    return [
      `${this.name} ${id} ${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`,
      `${this.facilities.toString().replaceAll(",", " ")} ${this.getTradeCodes().toString().replaceAll(",", " ")} ${this.travelCode}`
    ]
  }
  // Condense system to UWP string, shorthand for hex maps
  getUWPSmall(): string {
    return `${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`
  }
  // Get grid ID via x,y values
  getGridID(): string {
    return `${this.x < 10 ? "0" + String(this.x) : this.x}${this.y < 10 ? "0" + String(this.y) : this.y}`
  }

  // === STARPORT, TRADE, SYSTEM CHARACTERISTICS GET VERBOSE FUNCTIONS

  getStarportQuality(): string {
    switch (this.starport) {
      case ("A"): return "Excellent";
      case ("B"): return "Good";
      case ("C"): return "Routine";
      case ("D"): return "Poor";
      case ("E"): return "Frontier";
      case ("X"): return "None";
    }
  }

  getFacilitiesArrayVerbose(): string[] {
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

  getBasesArrayVerbose(): string[] {
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

  getRandomBerthingCost(): number {
    switch (this.starport) {
      case ("A"): return roll1D6() * 1000;
      case ("B"): return roll1D6() * 500;
      case ("C"): return roll1D6() * 100;
      case ("D"): return roll1D6() * 10;
      case ("E"): return 0;
      case ("X"): return 0;
    }
  }

  getBerthingCost(): number {
    switch (this.starport) {
      case ("A"): return 3000;
      case ("B"): return 1500;
      case ("C"): return 300;
      case ("D"): return 30;
      case ("E"): return 0;
      case ("X"): return 0;
    }
  }

  getFuelType(): string {
    switch (this.starport) {
      case ("A"): return "Refined"
      case ("B"): return "Refined"
      case ("C"): return "Unrefined"
      case ("D"): return "Unrefined"
      case ("E"): return "None"
      case ("X"): return "None"
    }
  }

  // Use system data to determine trade codes
  getTradeCodes() {
    let codes: tradeCode[] = []
    const atmos = deHexify(this.atmos)
    const size = deHexify(this.size)
    const hydro = deHexify(this.hydro)
    const pop = deHexify(this.pop)
    const gov = deHexify(this.gov)
    const law = deHexify(this.law)
    const tech = this.tech

    // Agricultural
    if ((atmos >= 4 && atmos <= 9) && (hydro >= 4 && hydro <= 8) && (pop >= 5 && pop <= 7)) codes.push("Ag")
    // Asteroids
    if (size == 0 && atmos == 0 && hydro == 0) codes.push("As")
    // Barren
    if (pop == 0 && gov == 0 && law == 0) codes.push("Ba")
    // Desert
    if ((atmos >= 2 && atmos <= 9) && hydro == 0) codes.push("De")
    // Fluid Oceans
    if (atmos >= 10 && hydro >= 1) codes.push("Fl")
    // Garden
    if ((size >= 6 && size <= 8) && (atmos == 5 || atmos == 6 || atmos == 7) && (hydro >= 5 && hydro <= 7)) codes.push("Ga")
    // High Pop
    if (pop >= 9) codes.push("Hi")
    // High Tech
    if (tech >= 12) codes.push("Ht")
    // Ice-Capped
    if (atmos <= 1 && hydro >= 1) codes.push("Ic")
    // Industrial
    if (pop >= 9 && (atmos <= 2 || atmos == 4 || atmos == 7 || atmos >= 9 && atmos <= 12)) codes.push("In")
    // Low Pop
    if (pop >= 1 && pop <= 3) codes.push("Lo")
    // Low Tech
    if (pop >= 1 && tech <= 5) codes.push("Lt")
    // Non-Agricultural
    if (atmos <= 3 && hydro <= 3 && pop >= 6) codes.push("Na")
    // Non-Industrial
    if (pop >= 4 && pop <= 6) codes.push("Ni")
    // Poor
    if ((atmos >= 2 && atmos <= 5) && hydro <= 3) codes.push("Po")
    // Rich
    if ((atmos == 6 || atmos == 8) && (pop >= 6 && pop <= 8) && (gov >= 4 && gov <= 9)) codes.push("Ri")
    // Vacuum
    if (atmos == 0) codes.push("Va")
    // Water World
    if (hydro >= 10 && ((atmos >= 3 && atmos <= 9) || atmos >= 13)) codes.push("Wa")
    return codes
  }

  getTradeCodesVerbose(): string[] {
    let codes = this.getTradeCodes()
    let tradeArr: string[] = []
    codes.forEach(e => {
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

  // === PHYSICAL CHARACTERISTICS GET VERBOSE FUNCTIONS

  getDiameter(): number {
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

  getGravity(): number {
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

  getAtmosphereType(): string {
    switch (this.atmos) {
      case (0): return "None"
      case (1): return "Trace"
      case (2): return "Very thin, tainted"
      case (3): return "Very thin"
      case (4): return "Thin, tainted"
      case (5): return "Thin"
      case (6): return "Standard"
      case (7): return "Standard, tainted"
      case (8): return "Dense"
      case (9): return "Dense, tainted"
      case ("A"): return "Exotic"
      case ("B"): return "Corrosive"
      case ("C"): return "Insidious"
      case ("D"): return "Very dense"
      case ("E"): return "Low"
      case ("F"): return "Unusual"
    }
  }

  getTempType(): string {
    if (this.temp <= 2) return "Frozen, -51° or less"
    if (this.temp >= 3 && this.temp <= 4) return "Cold, -51° to 0°"
    if (this.temp >= 5 && this.temp <= 9) return "Temperate, 0° to 30°"
    if (this.temp >= 10 && this.temp <= 11) return "Hot, 31° to 80°"
    return "Boiling, 81° or more"
  }

  getHydroType(): string {
    switch (this.hydro) {
      case (0): return "Desert world (0 - 5%)"
      case (1): return "Dry world (6 - 15%)"
      case (2): return "Few small seas (16 - 25%)"
      case (3): return "Small seas and oceans (26 - 35%)"
      case (4): return "Wet world (36 - 45%)"
      case (5): return "A large ocean (46 - 55%)"
      case (6): return "Large oceans (56 - 65%)"
      case (7): return "Earth-like (66 - 75%)"
      case (8): return "A few islands (76 - 85%)"
      case (9): return "Almost only water (86 - 95%)"
      case ("A"): return "Waterworld (96 - 100%)"
    }
  }

  // === SOCIAL CHARACTERISTICS GET VERBOSE FUNCTIONS

  getGovernmentType(gov: fullRange): string {
    switch (gov) {
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

  getPopType(): string {
    switch (this.pop) {
      case (0): return "None"
      case (1): return "A few"
      case (2): return "Hundreds"
      case (3): return "Thousands"
      case (4): return "Tens of thousands"
      case (5): return "Hundreds of thousands"
      case (6): return "Millions"
      case (7): return "Tens of millions"
      case (8): return "Hundreds of millions"
      case (9): return "Billions"
      case ("A"): return "Tens of billions"
      case ("B"): return "Hundreds of billions"
      case ("C"): return "Trillions"
    }
  }

  getFactionArrayVerbose(): { strength: string, gov: string, details?: string }[] {
    let arr: { strength: string, gov: string, details?: string }[] = []
    if (!this.factions) return arr
    for (let i = 0; i < this.factions.length; i++) {
      let faction: { strength: string, gov: string, details?: string } = { strength: "", gov: "", details: undefined }
      switch (this.factions[i].strength) {
        case (2): faction.strength = "Obscure"; break;
        case (3): faction.strength = "Obscure"; break;
        case (4): faction.strength = "Fringe"; break;
        case (5): faction.strength = "Fringe"; break;
        case (6): faction.strength = "Minor"; break;
        case (7): faction.strength = "Minor"; break;
        case (8): faction.strength = "Notable"; break;
        case (9): faction.strength = "Notable"; break;
        case (10): faction.strength = "Significant"; break;
        case (11): faction.strength = "Significant"; break;
        case (12): faction.strength = "Overwhelming"; break;
      }
      faction.gov = this.getGovernmentType(this.factions[i].gov)
      faction.details = this.factions ? this.factions[i].details : undefined
      arr.push(faction)
    }
    return arr
  }

  getCultureType(): string {
    switch (this.culture) {
      case (11): return "Sexist"
      case (12): return "Religious"
      case (13): return "Artistic"
      case (14): return "Ritualized"
      case (15): return "Conservative"
      case (16): return "Xenophobic"
      case (21): return "Taboo"
      case (22): return "Deceptive"
      case (23): return "Liberal"
      case (24): return "Honorable"
      case (25): return "Influenced"
      case (26): return "Fusion"
      case (31): return "Barbaric"
      case (32): return "Remnant"
      case (33): return "Degenerate"
      case (34): return "Progressive"
      case (35): return "Recovering"
      case (36): return "Nexus"
      case (41): return "Tourist attraction"
      case (42): return "Violent"
      case (43): return "Peaceful"
      case (44): return "Obsessed"
      case (45): return "Fashion"
      case (46): return "At war"
      case (51): return "Unusual custom around offworlders"
      case (52): return "Unusual custom around the starport"
      case (53): return "Unusual custom around the media"
      case (54): return "Unusual custom around technology"
      case (55): return "Unusual custom around lifecycles"
      case (56): return "Unusual custom around social standings"
      case (61): return "Unusual custom around trade"
      case (62): return "Unusual custom around nobility"
      case (63): return "Unusual custom around sex"
      case (64): return "Unusual custom around eating"
      case (65): return "Unusual custom around travel"
      case (66): return "Unusual custom around conspiracy"
    }
  }
}