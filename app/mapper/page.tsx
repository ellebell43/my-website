import { Metadata } from "next"
import Map from "@/lib/components/map"

export const metadata: Metadata = {
  title: "Traveller Mapper Tool",
  description: "Randomly generate a new sector or subsector map. For use with the Traveller TTRPG",
  openGraph: { images: '/mapper/opengraph-image.png' }
}

export default function Page() {
  return <Map />
}