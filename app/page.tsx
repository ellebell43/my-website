import Link from "next/link"
import ProjectCard from "../lib/components/project-card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGithub, faMastodon, faKoFi } from "@fortawesome/free-brands-svg-icons"
import { faArrowDown, faBook, faComputer, faEnvelope, faKiwiBird } from "@fortawesome/free-solid-svg-icons"
import { Metadata } from "next"
import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper"

export const metadata: Metadata = {
  title: "ellebell.dev",
  description: "Hi 👋 I'm Elle. Welcome to my little corner of the internet."
}

export default function Page() {
  return (
    <PrimaryPageWrapper>
      <div className="my-[120px] relative flex md:flex-row flex-col justify-end items-end gap-6">

        <h1 className="md:text-7xl text-6xl text-right flex flex-col md:flex-row gap-2 border-0"><span><FontAwesomeIcon width={84} className="self-end inline relative bottom-4 -rotate-60" icon={faKiwiBird} /> Hi,</span><span> I'm Elle!</span></h1>
      </div>
      <p className="text-xl my-3">Welcome to my little corner of the internet! I'm just some random transfem girl from PDX with a big interest in technology <FontAwesomeIcon className="inline" width={20} icon={faComputer} /> and story telling <FontAwesomeIcon className="inline" width={20} icon={faBook} /> This is were you can find links to most of my projects and socials.</p>

      <p className="text-xl my-3">I consider everything that I do to be a public good and all of it is published under the <Link href="https://opensource.org/license/GPL-3.0">GPL v3</Link> license. Like my projects and want to say thanks? Send me a little gift on <Link href="https://ko-fi.com/ellebell43">Ko-fi</Link>.</p>

      <p className="text-xl my-4">Want to chat? See my social links at the bottom of the page <FontAwesomeIcon className="inline" width={12} icon={faArrowDown} /></p>

      <h2 className="border-b-2 mt-12 mb-6 text-4xl pb-4">Projects</h2>
      <div className="flex flex-col gap-8 max-w-[750px] mx-auto">
        <ProjectCard href="https://guildsmenrpg.com" title="Guildsmen RPG" description="A free and open source table top role play game. Complete with website, character app, and community discord!" right={true} />
        <ProjectCard href="/mapper" title="Traveller Mapper" description="A fun little tool for randomly generating, editing, and saving hex maps for the table top role play game, Traveller" />
        <ProjectCard href="/kendoris" title="Kendoris Subsector" description="A map of Kendoris Subsector, the setting for a Traveller game I used to run." right={true} />
        <ProjectCard href="https://github.com/ellebell43/untitled-sandbox-game" title="Untitled Sandbox Game" description="A yet-to-be titled, 3D game I'm building in Godot. Think stylized, scaled down No Man's Sky with flying pirate ships instead of space ships." right={false} />
      </div>

      <div className="flex justify-center items-center gap-6 mt-12 text-5xl">
        {/* <Link rel="me" href="https://social.ellebell.dev/@ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faMastodon} /></Link> */}
        <Link href="https://github.com/ellebell43/"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faGithub} /></Link>
        <Link href="https://discord.com/users/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faDiscord} /></Link>
        <Link href="mailto:hello@ellebell.dev"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faEnvelope} /></Link>
        <Link href="https://ko-fi.com/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faKoFi} /></Link>
      </div>
    </PrimaryPageWrapper>
  )
}