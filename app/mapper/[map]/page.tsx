import { map } from "@/lib/util/types";
import MapperMapClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traveller Mapper Tool",
  description: "Randomly generate a new sector or subsector map. For use with the Traveller TTRPG",
  openGraph: { images: '../opengraph-image.png' }
}

export default async function Page({ params, }: { params: Promise<{ map: string }> }) {
  const { map } = await params
  // fully get the map and pass it to the client, but don't allow change unless the correct password in put in
  try {
    // return <p>hi</p>
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "GET", headers: { id: String(map) } })
    if (!res.ok) {
      return <p>{res.status}: {res.statusText}</p>
    } else {
      const response: map = await res.json()
      return <MapperMapClient map={response} />
    }
  } catch (error) {
    return <p>{String(error)}</p>
  }
}