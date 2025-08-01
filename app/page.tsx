import { Winky_Sans } from "next/font/google"
import Link from "next/link"
import ProjectCard from "./components/project-card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGithub, faMastodon } from "@fortawesome/free-brands-svg-icons"

const winkySans = Winky_Sans({ weight: "500" })


export default function Page() {
  return (
    <div className={`p-6 from-blue-100 to-purple-200 bg-gradient-to-br min-h-screen ${winkySans.className}`}>
      <div className="max-w-[750px] mx-auto relative">
        <h1 className="my-[120px] md:text-7xl text-6xl text-right">Hello 👋 I'm Elle!</h1>
        <p className="text-xl my-2">Welcome to my little corner of the internet! I'm just some random transfem girl from PDX with a big interest in technology 🖥️ This is were you can find links to most of my projects and socials. I think I might get into blogging about what I do with my time. I won't bother with any kind of newsletter if I do, though, but I will post about it on Mastodon 🙂 So, be sure to just check there periodically!</p>

        <p className="text-xl my-2">I really enjoy self-hosting things, and all my projects (including this site) are self-hosted. I'm currently working on setting up an email server. I have a couple other projects that are usable, but not listed here due to having less secure connections.</p>



        <h2 className="border-b-2 pb-">Projects</h2>
        <div className="flex flex-col gap-8">
          <ProjectCard href="/mapper" title="Traveller RPG Mapper" description="A fun little tool for randomly generating hex maps for the game Traveller (a TTRPG)" />
          <ProjectCard href="https://recipes.ellebell.dev/g/the-council/" title="Mealie" description="A self hosted recipe manager. Got some recipes for me to add? DM me!" right={true} />
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <Link href="https://dice.camp/@ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faMastodon} /></Link>
          <Link href="https://github.com/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faGithub} /></Link>
          <Link href="https://discord.com/users/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faDiscord} /></Link>
        </div>
      </div>
    </div>
  )
}