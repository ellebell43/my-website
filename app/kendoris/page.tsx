import MDParse from "@/lib/components/md-parse";
import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper";
import { headers } from "next/headers";

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

  return (
    <PrimaryPageWrapper>
      <h1>Kendoris Subsecotr</h1>
      <div className="text-lg">
        <MDParse content={content} noContainer={true} />
      </div>
    </PrimaryPageWrapper>
  )
}