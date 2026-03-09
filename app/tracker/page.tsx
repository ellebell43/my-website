/** GAME PLAN
 * - [ ] User interface to easily track my health stats
 * - [ ] Data is stored in a MongoDB database
 * - [ ] Data is visualized via Chart.js
 * - [ ] User must authenticate before data can be added
 * - [ ] Data visualizations can be seen by anyone
 * 
 * INTERFACE IDEAS
 * Page shows various visualizations of data
 * There's a + button that allows you to enter in data
 * You must authenticate before it allows you to fill out the form
 */

/** PRIMARY TO DOS
 * - [ ] Hook into Oura API and examine what data can be pulled. Preferably record oura data to database
 * - [ ] Create a basic form for self reporting data, post to the database
 * - [ ] Create a "today" view that shows current reporting for the day
 * - [ ] Create a calendar view that let's you view, edit, and delete previous days
 * - [ ] Create a db document that contains previously used tags
 */

import TrackerEntryForm from "@/lib/components/tracker-components/tracker-entry-form"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Elle's Health Tracker",
  description: "Data entry and visualization of how I'm doing on a variety of metrics",
  // openGraph: { images: '/mapper/opengraph-image.png' }
}

export default function Page() {
  return <>
    <h1>Tracker!</h1>
    <TrackerEntryForm />
  </>
}
