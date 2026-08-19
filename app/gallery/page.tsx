import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | ellebell.dev",
  description: "My art! Mostly pixel art. Enjoy!"
}

export default function Page() {
  return (
    <PrimaryPageWrapper>
      <h1>Gallery</h1>
    </PrimaryPageWrapper>
  )
}