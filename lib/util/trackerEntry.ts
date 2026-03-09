type trackerDataIntervals = {
  "8am"?: 0 | 1 | 2 | 3 | 4,
  "10am"?: 0 | 1 | 2 | 3 | 4,
  "12pm"?: 0 | 1 | 2 | 3 | 4,
  "2pm"?: 0 | 1 | 2 | 3 | 4,
  "4pm"?: 0 | 1 | 2 | 3 | 4,
  "6pm"?: 0 | 1 | 2 | 3 | 4,
  "8pm"?: 0 | 1 | 2 | 3 | 4,
}

type entryDate = {
  day: number,
  month: number,
  year: number
}

export default class TrackerEntry {
  date: entryDate
  fatigue: trackerDataIntervals
  mood: trackerDataIntervals
  stress: trackerDataIntervals
  adhd: trackerDataIntervals
  activity: trackerDataIntervals
  social: trackerDataIntervals
  substances: {
    vitaminD?: boolean,
    estradiol?: boolean,
    caffeine?: boolean,
    alcohol?: boolean
  }
  ouraData?: object
  tags?: string[]

  constructor(
    date: entryDate,
    fatigue: trackerDataIntervals,
    mood: trackerDataIntervals,
    stress: trackerDataIntervals,
    adhd: trackerDataIntervals,
    activity: trackerDataIntervals,
    social: trackerDataIntervals,
    substances: {
      vitaminD?: boolean,
      estradiol?: boolean,
      caffeine?: boolean,
      alcohol?: boolean
    },
    tags?: string[]
  ) {
    this.date = date
    this.fatigue = fatigue
    this.mood = mood
    this.stress = stress
    this.adhd = adhd
    this.activity = activity
    this.social = social
    this.substances = substances
    this.tags = tags
  }
}

export function createEmptyTrackerEntry(): TrackerEntry {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth()
  const year = today.getFullYear()
  const date: entryDate = { day, month, year }
  return new TrackerEntry(date, {}, {}, {}, {}, {}, {}, {})
}