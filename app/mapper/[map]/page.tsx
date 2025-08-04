import MapperMapClient from "./client";

type props = { params: { map: string } }

export default async function Page(props: props) {
  /// fully get the map and pass it to the client, but don't allow change unless the correct password in put in
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "GET", headers: { id: props.params.map } })
    if (!res.ok) {
      return <p></p>
    }
  } catch (error) {
    return <p>{String(error)}</p>
  }
}