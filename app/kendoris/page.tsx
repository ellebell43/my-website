import MDParse from "@/lib/components/md-parse";
import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper";
import StarSystem from "@/lib/util/starsystem";
import { map } from "@/lib/util/types";
import Link from "next/link";

export default async function Page() {
  // let content = ""
  // try {
  //   const res = await fetch(`${process.env.JOPLIN_CONNECTION_STRING}/notes/6b14c1049a34483996fca44ff52e8d01?token=${process.env.JOPLIN_TOKEN}&fields=body`)
  //   if (!res.ok) {
  //     return <p>Error {res.status}: {res.statusText}</p>
  //   } else {
  //     const response = await res.json()
  //     content = response.body
  //   }
  // } catch (error) {
  //   console.log(error)
  //   return <p>{String(error)}</p>
  // }

  let systems: StarSystem[] = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "GET", headers: { id: "68952847043ff9cef4865f67" } })
    if (!res.ok) {
      return <p>{res.status}: {res.statusText}</p>
    } else {
      const response: map = await res.json()
      const systemsArr = [...response.systems]
      for (let i = 0; i < systemsArr.length; i++) {
        // @ts-ignore
        if (systemsArr[i].size) {
          // @ts-ignore
          const system = new StarSystem(systemsArr[i].x, systemsArr[i].y, systemsArr[i].name, systemsArr[i].starport, systemsArr[i].size, systemsArr[i].atmos, systemsArr[i].hydro, systemsArr[i].pop, systemsArr[i].gov, systemsArr[i].law, systemsArr[i].tech, systemsArr[i].travelCode, systemsArr[i].temp, systemsArr[i].factions, systemsArr[i].culture, systemsArr[i].facilities, systemsArr[i].details, systemsArr[i].gasGiant)
          systems.push(system)
        }
      }
      return (
        <PrimaryPageWrapper>
          <h1>Kendoris Subsecotr</h1>
          <div className="text-lg">
            {/* <MDParse content={content} noContainer={true} /> */}
            <p>Kendoris subsector is fully a United Protectorate space and lies within the larger Haliter Sector. It is known for being a place of diversity and most systems in the subsector have a surprising distribution of species from throughout the settle systems. It's capital location is Crossjump Station, named after being a major crossroads for all of Haliter Sector. Almost every thing traveling through the subsector is touched by Crossjump Station at some point.</p>

            <Link href="https://ellebell.dev/mapper/68952847043ff9cef4865f67">View the map</Link>

            <section id="contents">
              <h2>Contents</h2>

              <h3>Polities</h3>
              <ul>
                <li><Link href="#the-united-protectorate">The United Protectorate</Link></li>
                <li><Link href="#the-paradise-pact">The Paradise Pact</Link></li>
                <li><Link href="#the-oordani-reserve">The Oordani Reserve</Link></li>
              </ul>

              <h3>Major Sophonts</h3>
              <ul>
                <li><Link href="#humans">Humans</Link></li>
                <li><Link href="#oordani">Oordani</Link></li>
                <li><Link href="#taluran">Taluran</Link></li>
                <li><Link href="#Scaelem">Scaelem</Link></li>
              </ul>

              <h3><Link href="#systems">Systems</Link></h3>
            </section>

            <section id="polities">
              <h2>Polities</h2>

              <h3 id="#the-united-protectorate">The United Protectorate</h3>
              <p>The Kendoris Subsector lies within the UP (United Protectorate), where all planets have a military alliance against invaders, raiders, and terrorists. Data, science, and military power is spread throughout all systems in the UP, but each system is responsible for their own technology, economics, and governing. The only time the UP steps in to stop the actions of a particular system is if it encroaches on the freedoms of another system. All systems are required to supply the UP navy with ships, weapon, and personnel, if able. Those are used to protect interstellar trade and boundaries, but are never used for inter-planetary disputes.</p>

              <p>Each subsector will have one system designated for the UP to utilize for inter-stellar operations, military depot, and other functions. These systems are restricted from civilian travel in order to protect UP assets. System dignitaries and representatives are free to tour UP systems to monitor how their resources are being used. The UP will only use resources from a subsector for deployment in that subsector, meaning that the more a subsector contributes to the UP, the more protection and interstellar mediation assets will be used by the UP.</p>

              <p>The only time UP deploys resources from one sub sector to another is if the UP is being attack as an entity from some other entity. Luckily, Kendoris is insulated from the UP borders by a few subsectors, so does need to worry about inter-polity war. Inter-system states have been formed within the Protectorate, which means that the UP treats the entire state as a singular system, though with much higher requirements for resource donation if the state wishes to continue benefiting from UP protections.</p>

              <p>The United Protectorate has a reputation for non-conformity and chaos, but that is primarily due to the Protectorate's "hands-off" approach. Most systems approve of how the UP operates, and as such, more systems are joining the UP all the time. </p>

              <h3 id="the-paradise-pact">The Paradise Pact</h3>

              <p>The Paradise Pact is a state separated from the UP that consist of 3 systems, each with a paradise (or near-paradise) planet: <Link href="https://ellebell.dev/mapper/68952847043ff9cef4865f67#0201">Horizon (0201)</Link>, <Link href="https://ellebell.dev/mapper/68952847043ff9cef4865f67#0102">Avend (0102)</Link>, and <Link href="https://ellebell.dev/mapper/68952847043ff9cef4865f67#0301">Cassady (0301)</Link>. Being rich in resources with luxurious planets, the people of the Paradise Pact worried that outsiders would come to pillage or claim their planets. So, they joined together and formed a state, renouncing the UP. They focus on trade between each other and protection from outside parties, and have become very untrusting of the outside universe. The distrust has led to major restrictions and regulations on dealing with people from outside the pact.</p>

              <p>This, however, has caused some upset. The government structure of Horizon (0201) has been slow and inefficient, and the governemnt of Avend (0102) has become insulated from the citizens and their input. The people of Cassady (0301) are part of a corporate entity, and also wish to open up their business opportunities with the rest of the UP. The withdraw from the UP has left the citizens lacking in interstellar news, trade, and connections, and many citizens wish to rejoin the UP. In recent months, the political upset has reached a fever pitch and a civil war has broken out within the Paradise Pact.</p>

              <p><em>*All Travellers should proceed with extreme caution if they wish to enter the Pardise Pact; many ships have entered Pact space and not returned.</em></p>

              <h3 id="the-oordani-reserve">The Oordani Reserve</h3>

              <p>The Oordani people evolved in the microgravity of a gas giant's rings. As such, they cannot tolerate gavity over 0.05G without technological assistance. Since most gas giant rings, asteroid belts, and similar stellar bodies are generally used for inter-stellar mining operation, the Oordani faced great difficulty when trying to find places to settle where they would not be pushed out of there homes.</p>

              <p>In a rare display of interstellar politics, the UP designated certain systems where microgravity environments where to be set aside for Oordani populations. The Oordani Reserve in the Kendoris Subsector is one such place, consisting of they systems <Link href="https://ellebell.dev/mapper/68952847043ff9cef4865f67#0407">Xarix (0407)</Link> and <Link href="https://ellebell.dev/mapper/68952847043ff9cef4865f67#0408">Utra'im (0408)</Link>. The vast majority of people living in these systems are Oordani, and their governments/cultures/people have precident over these systems and how they are operated. The UP dedicates a minor amount of resources to ensure that the Reserve is enforced and protected and to ensure that the Oordani are allowed to live quietly, even if their settled area could be rich in metals and water.</p>

              <p>The Oordani Reserve, especially Xarix (0407), is known for being a very peaceful and welcoming place. It's high technological level means it's a pleasant stop for any wanderers or traders working their way through the Kendoris Subsector. Just make sure you leave your weapons and armor on your starship, as no combat materials of any kind are allowed in the Oordani Reserve. And get used to microgravity environments, as you won't find any gravity plates anywhere, even at the starports.</p>
            </section>

            <section id="major-sophonts">
              <h2>Major Sophonts</h2>
            </section>

            <h2>Systems</h2>
            <ul className="grid md:grid-cols-3">
              {systems.map((el, i) => {
                return <div key={`system-link-${i}`} className="">
                  <li><Link href={`/mapper/68952847043ff9cef4865f67#${el.getGridID()}`}>{el.getGridID()} {el.name} {el.getUWPSmall()}</Link></li>
                </div>
              })}
            </ul>
          </div>
        </PrimaryPageWrapper>
      )
    }
  } catch (error) {
    return <p>Error: {String(error)}</p>
  }



}