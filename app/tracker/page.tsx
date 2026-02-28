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

import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Elle's Health Tracker",
  description: "Data entry and visualization of how I'm doing on a variety of metrics",
  openGraph: { images: '/mapper/opengraph-image.png' }
}

export default function Page() {
  return <>
    <h1>Tracker!</h1>
  </>
}
