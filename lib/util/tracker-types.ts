import { ObjectId, UUID } from "mongodb"

type OuraDailyActivity = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  active_calories: number, // Calories burned above basal metabolic rate
  average_met_minutes: number, // Average MET value across the day (1.0 = resting)
  class_5_min: string, // Activity classification per 5-min window: 0=non-wear, 1=rest, 2=low, 3=medium, 4=high
  contributors: {
    meet_daily_targets: number, // Score for progress toward calorie/distance goals (0–100)
    move_every_hour: number, // Score for avoiding prolonged sedentary periods (0–100)
    recovery_time: number, // Score for adequate rest between intense activity (0–100)
    stay_active: number, // Score for overall movement throughout the day (0–100)
    training_frequency: number, // Score for workout consistency over recent days (0–100)
    training_volume: number, // Score for appropriate training load (0–100)
  },
  day: Date, // The calendar date this record covers
  equivalent_walking_distance: number, // Total movement converted to walking-equivalent meters
  high_activity_met_minutes: number, // MET-minutes accumulated during vigorous activity
  high_activity_time: number, // Time in vigorous activity (seconds)
  inactivity_alerts: number, // Number of nudges to move after prolonged inactivity
  low_activity_met_minutes: number, // MET-minutes accumulated during light activity
  low_activity_time: number, // Time in light activity (seconds)
  medium_activity_met_minutes: number, // MET-minutes accumulated during moderate activity
  medium_activity_time: number, // Time in moderate activity (seconds)
  met: {
    interval: number, // Sampling interval in seconds (e.g., 60)
    items: number[], // MET values per interval, ~0.9 = rest, higher = more intense activity
    timestamp: Date, // Start time for the MET sample array
  },
  meters_to_target: number, // Remaining meters to reach the daily distance goal
  non_wear_time: number, // Time the ring was not worn (seconds)
  resting_time: number, // Time spent at rest (seconds)
  score: number, // Overall daily activity score (0–100)
  sedentary_met_minutes: number, // MET-minutes accumulated while sedentary
  sedentary_time: number, // Time spent sedentary (seconds)
  steps: number, // Total step count for the day
  target_calories: number, // Daily active calorie burn goal
  target_meters: number, // Daily distance goal in meters
  timestamp: Date, // Timestamp when the record was generated/synced
  total_calories: number, // Total calories burned including BMR
}


type OuraDailyReadiness = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  contributors: {
    activity_balance: number | null, // Score for balance between activity and rest (0–100)
    body_temperature: number | null, // Score based on skin temperature deviation (0–100)
    hrv_balance: number | null, // Score for heart rate variability trends (0–100)
    previous_day_activity: number | null, // Score reflecting prior day's activity load (0–100)
    previous_night: number | null, // Score for previous night's sleep quality (0–100)
    recovery_index: number | null, // Score for how well resting heart rate recovered overnight (0–100)
    resting_heart_rate: number | null, // Score based on resting heart rate relative to baseline (0–100)
    sleep_balance: number | null, // Score for sleep debt over recent days (0–100)
    sleep_regularity: number | null, // Score for consistency of sleep schedule (0–100)
  },
  day: Date, // The calendar date this record covers
  score: number, // Overall daily readiness score (0–100)
  temperature_deviation: number, // Skin temperature deviation from baseline (°C)
  timestamp: Date, // Timestamp when the record was generated/synced
}


type OuraDailySleep = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  contributors: {
    deep_sleep: number, // Score for time spent in deep sleep (0–100)
    efficiency: number, // Score for sleep efficiency (time asleep vs. time in bed) (0–100)
    latency: number, // Score for how quickly you fell asleep (0–100)
    rem_sleep: number, // Score for time spent in REM sleep (0–100)
    restfulness: number, // Score for how undisturbed your sleep was (0–100)
    timing: number, // Score for alignment with your ideal bedtime window (0–100)
    total_sleep: number, // Score for total sleep duration (0–100)
  },
  day: Date, // The calendar date this record covers
  score: number, // Overall daily sleep score (0–100)
  timestamp: Date, // Timestamp when the record was generated/synced
}


type OuraRawLocation = {
  _id: ObjectId, // MongoDB document identifier
  timestamp: Date, // When this location was recorded
  altitude: number, // Altitude in meters above sea level
  course: number, // Direction of travel in degrees (0–360, 0 = north)
  course_accuracy: number, // Accuracy of course reading in degrees
  horizontal_accuracy: number, // Horizontal GPS accuracy in meters
  latitude: number, // Latitude coordinate
  longitude: number, // Longitude coordinate
  speed: number, // Speed of movement in meters per second
  speed_accuracy: number, // Accuracy of speed reading in m/s
  vertical_accuracy: number, // Vertical GPS accuracy in meters
}

type OuraHeartRate = {
  _id: ObjectId, // MongoDB document identifier
  timestamp: Date, // When this heart rate reading was taken
  bpm: number, // Heart rate in beats per minute
  source: "awake" | "sleep" | "workout" | "live", // Context of the reading
}

type OuraDaytimeStress = {
  _id: ObjectId, // MongoDB document identifier
  timestamp: Date, // When this stress sample was recorded
  recovery_value: number, // Recovery/stress value at this point in time
}

type OuraDailyStress = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  day: Date, // The calendar date this record covers
  day_summary: "normal" | "stressed" | "restored", // Overall stress summary for the day (e.g., "normal", "stressed", "restored")
  recovery_high: number, // Total time in high recovery during the day (seconds)
  stress_high: number, // Total time in high stress during the day (seconds)
}

type OuraSession = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  day: Date, // The calendar date this session covers
  end_datetime: Date, // When the session ended
  motion_count: {
    interval: number, // Sampling interval in seconds
    items: number[], // Motion intensity values per interval
    timestamp: Date, // Start time for the motion sample array
  },
  start_datetime: Date, // When the session started
  type: string, // Session type (e.g., "rest", "meditation")
}

type OuraSleepModel = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  average_breath: number, // Average breaths per minute during sleep
  average_heart_rate: number, // Average heart rate during sleep (bpm)
  average_hrv: number, // Average heart rate variability during sleep (ms)
  awake_time: number, // Total time spent awake during the sleep period (seconds)
  bedtime_end: Date, // When you got out of bed
  bedtime_start: Date, // When you got into bed
  day: Date, // The calendar date this record covers
  deep_sleep_duration: number, // Time in deep sleep (seconds)
  efficiency: number, // Sleep efficiency percentage (time asleep / time in bed)
  heart_rate: {
    interval: number, // Sampling interval in seconds (e.g., 300)
    items: (number | null)[], // Heart rate readings per interval, null when unavailable
    timestamp: Date, // Start time for the heart rate sample array
  },
  hrv: {
    interval: number, // Sampling interval in seconds (e.g., 300)
    items: (number | null)[], // HRV readings per interval (ms), null when unavailable
    timestamp: Date, // Start time for the HRV sample array
  },
  latency: number, // Time to fall asleep (seconds)
  light_sleep_duration: number, // Time in light sleep (seconds)
  low_battery_alert: boolean, // Whether a low battery alert was triggered during sleep
  lowest_heart_rate: number, // Lowest heart rate recorded during sleep (bpm)
  movement_30_sec: string, // Movement intensity per 30-sec window: 1=low, 2=medium, 3=high
  period: number, // Sleep period index (0 = primary sleep)
  readiness: {
    contributors: {
      activity_balance: number, // Score for balance between activity and rest (0–100)
      body_temperature: number, // Score based on skin temperature deviation (0–100)
      hrv_balance: number, // Score for HRV trends (0–100)
      previous_day_activity: number, // Score reflecting prior day's activity load (0–100)
      previous_night: number, // Score for previous night's sleep quality (0–100)
      recovery_index: number, // Score for overnight resting heart rate recovery (0–100)
      resting_heart_rate: number, // Score based on resting heart rate vs. baseline (0–100)
      sleep_balance: number, // Score for sleep debt over recent days (0–100)
      sleep_regularity: number | null, // Score for consistency of sleep schedule (0–100)
    },
    score: number, // Readiness score derived from this sleep period (0–100)
    temperature_deviation: number, // Skin temperature deviation from baseline (°C)
    temperature_trend_deviation: number | null, // Longer-term temperature trend deviation (°C)
  },
  readiness_score_delta: number, // Change in readiness score compared to previous period
  rem_sleep_duration: number, // Time in REM sleep (seconds)
  restless_periods: number, // Number of restless periods during sleep
  sleep_algorithm_version: string, // Version of the sleep detection algorithm used
  sleep_analysis_reason: string, // What triggered the sleep analysis (e.g., "foreground_sleep_analysis")
  sleep_phase_30_sec: string, // Sleep stage per 30-sec window: 1=deep, 2=light, 3=REM, 4=awake
  sleep_phase_5_min: string, // Sleep stage per 5-min window: 1=deep, 2=light, 3=REM, 4=awake
  sleep_score_delta: number, // Change in sleep score compared to previous period
  time_in_bed: number, // Total time in bed (seconds)
  total_sleep_duration: number, // Total time asleep (seconds)
  type: string, // Sleep type (e.g., "long_sleep", "rest", "nap")
}

type OuraTemperature = {
  _id: ObjectId, // MongoDB document identifier
  timestamp: Date, // When this temperature reading was taken
  skin_temp: number, // Skin temperature in degrees Celsius
}

type OuraWorkout = {
  _id: ObjectId, // MongoDB document identifier
  id: UUID, // Unique record identifier
  activity: string, // Type of workout (e.g., "walking", "running", "cycling")
  calories: number, // Calories burned during the workout
  day: Date, // The calendar date this workout covers
  end_datetime: Date, // When the workout ended
  intensity: string, // Workout intensity level (e.g., "easy", "moderate", "hard")
  source: string, // How the workout was recorded (e.g., "confirmed", "automatic")
  start_datetime: Date, // When the workout started
}

type SelfReport = {
  _id: ObjectId, // MongoDB document identifier
  date: string, // Date of the self-report entry (e.g., "3/1/26")
  fatigue: number[], // Fatigue ratings at 2-hour intervals from 8am–8pm (0–4 scale)
  mood: number[], // Mood ratings at 2-hour intervals from 8am–8pm (0–4 scale)
  stress: number[], // Stress ratings at 2-hour intervals from 8am–8pm (0–4 scale)
  adhd_difficulties: number[], // ADHD difficulty ratings at 2-hour intervals from 8am–8pm (0–4 scale)
  social_demand: number[], // Social demand ratings at 2-hour intervals from 8am–8pm (0–4 scale)
  substances: {
    vitamin_d: boolean, // Whether Vitamin D was taken
    estradiol: boolean, // Whether Estradiol was taken
    caffeine: boolean, // Whether caffeine was consumed
    alcohol: boolean, // Whether alcohol was consumed
  },
  tags: string[], // Freeform tags for the day (e.g., "busy")
}