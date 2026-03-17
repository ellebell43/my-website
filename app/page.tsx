import Link from "next/link"
import ProjectCard from "../lib/components/project-card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGithub, faMastodon } from "@fortawesome/free-brands-svg-icons"
import { faComputer, faKiwiBird, faSmile, faHandLizard } from "@fortawesome/free-solid-svg-icons"
import { Metadata } from "next"
import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper"

export const metadata: Metadata = {
  title: "ellebell.dev",
  description: "Hi 👋 I'm Elle. Welcome to my little corner of the internet."
}

export default function Page() {
  return (
    <PrimaryPageWrapper>
      <div className="my-30 relative flex md:flex-row flex-col justify-end items-end gap-6">

        <h1 className="md:text-7xl text-6xl text-right flex flex-col md:flex-row gap-2 border-0"><span><FontAwesomeIcon width={84} className="self-end inline relative bottom-4 -rotate-60" icon={faKiwiBird} /> Hi,</span><span> I'm Elle!</span></h1>
      </div>
      <p className="text-xl my-3">Welcome to my little corner of the internet. I'm just some random transfem girl from PDX. I love programming, self-hosting, pinball, board games, and table top role play games. Here are my projects! Want to say hi? Find me <Link href="https://social.ellebell.dev/@ellebell43">on the Fediverse</Link>!</p>

      <h2 className="border-b-2 mt-12 mb-6 text-4xl pb-4">Projects</h2>
      <div className="flex flex-col gap-8 max-w-187.5 mx-auto">
        <ProjectCard href="/root/hollowglade" title="Hollowglade Woodland" description="The setting for my current Root TTRPG campaign." right={true} />
        <ProjectCard href="/mapper" title="Traveller Mapper" description="A fun little tool for randomly generating, editing, and saving hex maps for the table top role play game, Traveller" />
        <ProjectCard href="/kendoris" title="Kendoris Subsector" description="A map of Kendoris Subsector, the setting for my current Traveller game that I'm running." right={true} />
        <ProjectCard href="https://recipes.ellebell.dev/g/the-council/" title="Mealie" description="My self hosted recipe manager. Got some recipes for me to add? DM me!" />
      </div>

      <div className="flex justify-center gap-6 mt-12 text-5xl">
        <Link rel="me" href="https://social.ellebell.dev/@ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faMastodon} /></Link>
        <Link href="https://github.com/ellebell43/my-website"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faGithub} /></Link>
        <Link href="https://discord.com/users/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faDiscord} /></Link>
      </div>
    </PrimaryPageWrapper>
  )
}