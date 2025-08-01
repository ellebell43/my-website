import Link from "next/link";

export default function ProjectCard(props: { title: string, href: string, description?: string, right?: boolean }) {
  return (
    <Link href={props.href} className={`bg-violet-50 border-2 rounded hover:bg-violet-100 block transition-all p-4 shadow-lg w-[300px] md:w-[450px] h-[175px] md:h-[150px] overflow-scroll ${props.right ? "self-end" : ""}`}>
      <p className={`text-2xl font-bold mb-4 ${props.right ? "text-right" : ""}`}>{props.title}</p>
      {props.description ? <p className={``}>{props.description}</p> : <></>}
    </Link>
  )
}