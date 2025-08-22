import { letterRange, diceRange, d3Range, d66Range, d6Range, fullRange, xRange, yRange, EmptyParsec, lawRange } from "./types"

// Dice rolling
//@ts-ignore
export const roll1D6 = (): d6Range => Math.floor(Math.random() * 6 + 1)
export const roll2D6 = (): diceRange => {
  const num1 = Math.floor(Math.random() * 6 + 1)
  const num2 = Math.floor(Math.random() * 6 + 1)
  //@ts-ignore
  return num1 + num2
}
export const rollD66 = (): d66Range => {
  const num1 = Math.floor(Math.random() * 6 + 1)
  const num2 = Math.floor(Math.random() * 6 + 1)
  //@ts-ignore
  return num1 * 10 + num2
}
//@ts-ignore
export const roll1D3 = (): d3Range => Math.floor(Math.random() * 3 + 1)

// Limiter functions
export function clampToDiceRange(num: number): diceRange {
  if (num < 2) return 2
  if (num > 12) return 12
  //@ts-ignore
  return num
}
export function clampToZero(num: number) {
  if (num < 0) return 0
  return num
}
export function clampToTechRange(num: number) {
  if (num < 1) return 1
  if (num > 15) return 15
  return num
}
export function clampToLawRange(num: number) {
  if (num < 1) return 1
  if (num > 9) return 9
  return num
}
export function clampToFullRange(num: number) {
  if (num < 1) return 1
  if (num > 15) return 15
  return num
}

// 50/50 chance for a parsec to contain a star system
export const determineIfSystem = (): boolean => {
  const num = roll1D6()
  if (num > 3) { return true } else { return false }
}

// Create hex value (letter) for given number
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
export const deHexify = (item: fullRange): number => {
  if (typeof (item) == "number") return item
  let newItem: number = 10
  switch (item) {
    case ("A"): newItem = 10; break;
    case ("B"): newItem = 11; break;
    case ("C"): newItem = 12; break;
    case ("D"): newItem = 13; break;
    case ("E"): newItem = 14; break;
    case ("F"): newItem = 15; break;
  }
  return newItem
}

export const createGridIDString = (x: number, y: number): string => `${x < 10 ? "0" + x : x}${y < 10 ? "0" + y : y}`