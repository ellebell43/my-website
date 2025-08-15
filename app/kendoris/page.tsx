import MDParse from "@/lib/components/md-parse";
import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper";
import StarSystem from "@/lib/util/starsystem";
import { map } from "@/lib/util/types";
import Link from "next/link";

export default async function Page() {
  let content = ""
  try {
    const res = await fetch(`${process.env.JOPLIN_CONNECTION_STRING}/notes/6b14c1049a34483996fca44ff52e8d01?token=${process.env.JOPLIN_TOKEN}&fields=body`)
    if (!res.ok) {
      return <p>Error {res.status}: {res.statusText}</p>
    } else {
      const response = await res.json()
      content = response.body
    }
  } catch (error) {
    console.log(error)
    return <p>{String(error)}</p>
  }

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
            <MDParse content={content} noContainer={true} />
            <h1>Systems</h1>
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