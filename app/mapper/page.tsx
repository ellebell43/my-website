import { Metadata } from "next"
import MapperClient from "./client"

export const metadata: Metadata = {
  title: "Traveller Mapper Tool",
  description: "Randomly generate a new sector or subsector map. For use with the Traveller TTRPG",
  openGraph: { images: './opengraph-image.png' }
}

export default function Page() {
  return <MapperClient />
}