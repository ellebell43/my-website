import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | ellebell.dev",
  description: "Hi 👋 I'm Elle. Welcome to my little corner of the internet."
}

export default function Page() {
  return (
    <PrimaryPageWrapper>
      <h1>Blog</h1>
    </PrimaryPageWrapper>
  )
}