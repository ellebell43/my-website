import Link from "next/link";

export default function ProjectCard(props: { title: string, href: string, description?: string, right?: boolean }) {
  return (
    <Link href={props.href} className={`bg-violet-50  dark:bg-violet-900 border-2 rounded hover:bg-violet-100 dark:hover:bg-violet-800 block transition-all p-4 shadow-lg w-[300px] md:w-[450px] h-[175px] md:h-[150px] overflow-y-scroll no-underline ${props.right ? "self-end" : ""}`}>
      <h3 className={`text-2xl font-bold mb-4 ${props.right ? "text-right" : ""}`}>{props.title}</h3>
      {props.description ? <p>{props.description}</p> : <></>}
    </Link>
  )
}