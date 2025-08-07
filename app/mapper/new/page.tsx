'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  const Body = () => {
    const id = useSearchParams().get("id")
    const pass = useSearchParams().get("pass")
    return (
      <div className="p-6 text-center">
        <h1 className="font-bold text-4xl my-10">New map successfully saved!</h1>
        <p>View the map at <Link className="underline text-blue-700 dark:text-blue-200" href={`/mapper/${id}`}>/mapper/{id}</Link></p>
        <p>To make edits, use the password you set. The password you set is <span className="font-bold">{pass}</span></p>
        <p className="text-red-800 dark:text-red-300">The password you set cannot be changed!! Make sure to save it somewhere!</p>
        <p>Also, make sure to follow the link and then bookmark it, otherwise it will very difficult to get back to.</p>
      </div>
    )
  }

  return (
    <Suspense>
      <Body />
    </Suspense>
  )
}