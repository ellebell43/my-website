import { ObjectId } from "mongodb"
import StarSystem from "./starsystem"

// Basic ranges for star system UWP values
export type numRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
export type letterRange = "A" | "B" | "C" | "D" | "E" | "F"
export type fullRange = numRange | letterRange
export type starportRange = "A" | "B" | "C" | "D" | "E" | "X"
export type sizeRange = numRange | "A"
export type popRange = numRange | "A" | "B" | "C"
export type travelCode = "G" | "A" | "R"
export type tradeCode = "Ag" | "As" | "Ba" | "De" | "Fl" | "Ga" | "Hi" | "Ht" | "Ic" | "In" | "Lo" | "Lt" | "Na" | "Ni" | "Po" | "Ri" | "Va" | "Wa"
export type facilityCode = "H" | "M" | "N" | "S" | "C" | "D"
export type lawRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

// Ranges for types of die rolls
export type diceRange = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type d6Range = 1 | 2 | 3 | 4 | 5 | 6
export type d3Range = 1 | 2 | 3
export type d66Range = 11 | 12 | 13 | 14 | 15 | 16 | 21 | 22 | 23 | 24 | 25 | 26 | 31 | 32 | 33 | 34 | 35 | 36 | 41 | 42 | 43 | 44 | 45 | 46 | 51 | 52 | 53 | 54 | 55 | 56 | 61 | 62 | 63 | 64 | 65 | 66

// x and y range for possible hex position within a sector
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type xRange = IntRange<1, 32>
export type yRange = IntRange<1, 40>

export type faction = {
  strength: diceRange,
  gov: fullRange,
  details?: string,
  name?: string
}

export class EmptyParsec {
  x: xRange
  y: yRange
  constructor(x: xRange, y: yRange) { this.x = x; this.y = y }
}

export type map = {
  _id?: ObjectId,
  pass?: string,
  systems: (StarSystem | EmptyParsec)[]
}