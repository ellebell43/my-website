type trackerDataIntervals = {
  "8am"?: 0 | 1 | 2 | 3 | 4 | 5,
  "10am"?: 0 | 1 | 2 | 3 | 4 | 5,
  "12pm"?: 0 | 1 | 2 | 3 | 4 | 5,
  "2pm"?: 0 | 1 | 2 | 3 | 4 | 5,
  "4pm"?: 0 | 1 | 2 | 3 | 4 | 5,
  "6pm"?: 0 | 1 | 2 | 3 | 4 | 5,
}

export default class TrackerEntry {
  date: Date
  fatigue: trackerDataIntervals
  mood: trackerDataIntervals
  stress: trackerDataIntervals
  adhd: trackerDataIntervals
  activity: trackerDataIntervals
  social: trackerDataIntervals
  medications: {
    vitaminD?: boolean,
    estradiol?: boolean,
    caffeine?: boolean
  }
  tag?: "Depressed" | "Rest" | "Busy" | "Sick" | "Peaceful" | "Weird" | "Outside" | "Bad"

  constructor(
    date: Date,
    fatigue: trackerDataIntervals,
    mood: trackerDataIntervals,
    stress: trackerDataIntervals,
    adhd: trackerDataIntervals,
    activity: trackerDataIntervals,
    social: trackerDataIntervals,
    // oura: { <- PULL FROM OURA API
    //   activity?: number,
    //   readiness?: number,
    //   sleep?: number,
    //   steps?: number
    // },
    // sleep: {
    //   awake?: number,
    //   rem?: number,
    //   light?: number,
    //   deep?: number,
    //   naps?: [
    //     { napTime: Date, napLength: number }
    //   ]
    // },
    medications: {
      vitaminD?: boolean,
      estradiol?: boolean,
      caffeine?: boolean
    },
    tag?: "Depressed" | "Rest" | "Busy" | "Sick" | "Peaceful" | "Weird" | "Outside" | "Bad"
  ) {
    this.date = date
    this.fatigue = fatigue
    this.mood = mood
    this.stress = stress
    this.adhd = adhd
    this.activity = activity
    this.social = social
    this.medications = medications
    this.tag = tag
  }
}

export function createEmptyTrackerEntry(): TrackerEntry {
  return new TrackerEntry(new Date(), {}, {}, {}, {}, {}, {}, {})
}