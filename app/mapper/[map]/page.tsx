import { map } from "@/lib/util/types";
import MapperMapClient from "./client";

type props = { params: { map: string } }

export default async function Page(props: props) {
  const { map } = await props.params
  /// fully get the map and pass it to the client, but don't allow change unless the correct password in put in
  try {
    // return <p>hi</p>
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "GET", headers: { id: map } })
    if (!res.ok) {
      return <p>{res.json()}</p>
    } else {
      const response: map = await res.json()
      return <MapperMapClient map={response} />
    }
  } catch (error) {
    return <p>{String(error)}</p>
  }
}