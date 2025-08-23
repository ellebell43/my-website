import { map } from "@/lib/util/types";
import { Metadata } from "next";
import Map from "@/lib/components/map";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Traveller Mapper Tool",
  description: "View and edit a map. For use with the Traveller TTRPG",
  openGraph: { images: '../opengraph-image.png' }
}

export default async function Page({ params, }: { params: Promise<{ map: string }> }) {
  const { map } = await params
  // fully get the map and pass it to the client, but don't allow change unless the correct password in put in
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "GET", headers: { id: String(map) } })
    if (!res.ok) {
      return <p>{res.status}: {res.statusText}</p>
    } else {
      const response: map = await res.json()
      return <Suspense><Map map={response} /></Suspense>
    }
  } catch (error) {
    return <p>{String(error)}</p>
  }
}