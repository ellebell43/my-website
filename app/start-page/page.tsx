import { createDAVClient } from "tsdav";
import StartPageClient from "./client";

const davClient = await createDAVClient({
  serverUrl: "https://calendar.ellebell.dev/hello%40ellebell.dev/e0eb0745-d9e8-3866-c13b-64707f2b6f8f/",
  credentials: {
    username: process.env.CALDAV_USER,
    password: process.env.CALDAV_PASS
  },
  authMethod: "Basic",
  defaultAccountType: "caldav"
})

const calendars = await davClient.fetchCalendars()

const davEvents = await davClient.fetchCalendarObjects({ calendar: calendars[0] })

console.log("events:", davEvents)

export default async function Page() {

  return (
    <StartPageClient />
  )
}