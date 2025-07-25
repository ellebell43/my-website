export type numRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
export type letterRange = "A" | "B" | "C" | "D" | "E" | "F"
export type fullRange = numRange | letterRange
export type starportRange = "A" | "B" | "C" | "E" | "X"
export type sizeRange = numRange | "A"
export type popRange = numRange | "A" | "B" | "C"

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

type xRange = IntRange<1, 32>
type yRange = IntRange<1, 40>

/** to add later
 * Bases
 * Trade codes
 * Travel code
 */

export const roll1D6 = () => Math.floor(Math.random() * 6 + 1)
export const roll2D6 = (modifier?: number): number => {
  const num1 = Math.floor(Math.random() * 6 + 1)
  const num2 = Math.floor(Math.random() * 6 + 1)
  return num1 + num2 + (modifier ? modifier : 0)
}

export const hasSystem = (): boolean => {
  const num = roll1D6()
  if (num > 3) { return true } else { return false }
}

export class System {
  x: xRange
  y: yRange
  name: string
  starport: starportRange
  size: sizeRange
  atmos: fullRange
  hydro: sizeRange
  pop: popRange
  gov: fullRange
  law: numRange
  tech: numRange | 10 | 11 | 12 | 13 | 14 | 15
  constructor(x: xRange, y: yRange, name: string, starport: starportRange, size: sizeRange, atmos: fullRange, hydro: sizeRange, pop: popRange, gov: fullRange, law: numRange, tech: numRange | 10 | 11 | 12 | 13 | 14 | 15) {
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
  }
  getUWP(): string {
    const id = `${this.x < 10 ? "0" + String(this.x) : this.x}${this.y < 10 ? "0" + String(this.y) : this.y}`
    return `${this.name} ${id} ${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`
  }
  getUWPSmall(): string {
    return `${this.starport}${this.size}${this.atmos}${this.hydro}${this.pop}${this.gov}${this.law}-${this.tech}`

  }
}

export const hexify = (num: number): letterRange | number => {
  let newItem: letterRange | number = num
  switch (num) {
    case (10): newItem = "A"; break;
    case (11): newItem = "B"; break;
    case (12): newItem = "C"; break;
    case (13): newItem = "D"; break;
    case (14): newItem = "E"; break;
    case (15): newItem = "F"; break;
  }
  return newItem
}

export const randomSystem = (name: string, x: xRange, y: yRange): System => {
  // size
  let size = roll2D6(-2)
  if (size < 0) size = 0

  // atmosphere
  let atmos = roll2D6(-7) + size
  if (atmos < 0) atmos = 0

  // hydrographics
  let hydro = roll2D6(-7) + atmos
  if (size == 0 || size == 1) hydro = 0
  if (atmos == 0 || atmos == 1 || atmos > 9) hydro -= 4
  if (hydro < 0) hydro = 0

  // population
  let pop = roll2D6()

  // government
  let gov = roll2D6(-7) + pop
  if (gov < 0) gov = 0

  // law
  let law = roll2D6(-7) + gov
  if (law < 0) law = 0

  // starport
  let num = roll2D6()
  if (pop <= 2) {
    num -= 2
  } else if (pop <= 4) {
    num -= 1
  } else if (pop >= 10) {
    num += 2
  } else if (pop >= 8) {
    num += 1
  }
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
  let tech = Math.floor(Math.random() * 3)
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
  if (tech > 15) tech = 15
  switch (atmos) {
    case (0 | 1 | 10 | 15): if (tech < 8) tech = 8; break;
    case (2 | 3 | 13 | 14): if (tech < 5) tech = 5; break;
    case (4 | 7 | 9): if (tech < 3) tech = 3; break;
    case (11): if (tech < 9) tech = 9; break;
    case (12): if (tech < 10) tech = 10; break;
  }
  if (tech < 1) tech = 1

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

  //@ts-ignore
  let newSys = new System(x, y, name, starport, size, atmos, hydro, pop, gov, law, tech)
  return newSys
}