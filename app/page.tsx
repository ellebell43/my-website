import { Winky_Sans } from "next/font/google"
import Link from "next/link"
import ProjectCard from "./components/project-card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGithub, faMastodon } from "@fortawesome/free-brands-svg-icons"
import { faComputer, faFaceGrin, faFish, faHippo, faKiwiBird, faSmile } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"

const winkySans = Winky_Sans({ weight: "500", subsets: ["latin"] })


export default function Page() {
  return (
    <div className={`p-6 from-blue-50 to-purple-100 bg-gradient-to-br min-h-screen ${winkySans.className}`}>
      <div className="max-w-[750px] mx-auto relative">
        <div className="my-[120px] relative flex md:flex-row flex-col justify-end items-end gap-6">

          <h1 className="md:text-7xl text-6xl text-right flex flex-col md:flex-row gap-2"><span><FontAwesomeIcon width={84} className="self-end inline relative bottom-4 -rotate-60" icon={faKiwiBird} /> Hi,</span><span> I'm Elle!</span></h1>
        </div>
        <p className="text-xl my-3">Welcome to my little corner of the internet! I'm just some random transfem girl from PDX with a big interest in technology <FontAwesomeIcon className="inline" width={20} icon={faComputer} /> This is were you can find links to most of my projects and socials. I think I might get into blogging about what I do with my time. I won't bother with any kind of newsletter if I do, though, but I will post about it on Mastodon <FontAwesomeIcon width={18} className="inline relative bottom-0.5" icon={faSmile} /> So, be sure to just check there periodically!</p>

        <p className="text-xl my-4">I really enjoy self-hosting things, and all my projects (including this site) are self-hosted. I'm currently working on setting up an email server. I have a couple other projects that are usable, but not listed here due to having less secure connections.</p>

        <h2 className="border-b-2 mt-12 mb-6 text-4xl pb-4">Projects</h2>
        <div className="flex flex-col gap-8">
          <ProjectCard href="/mapper" title="(WIP) Traveller Mapper" description="A fun little tool for randomly generating hex maps for the game Traveller (a TTRPG)" />
          <ProjectCard href="https://recipes.ellebell.dev/g/the-council/" title="Mealie" description="My self hosted recipe manager. Got some recipes for me to add? DM me!" right={true} />
          <p className="text-xl">I'm also running servers locally for Jellyfin (streaming my movies), Joplin (notes and to-dos), reverse proxy, and dynamic DNS!</p>
        </div>

        <div className="flex justify-center gap-6 mt-12 text-5xl">
          <Link rel="me" href="https://dice.camp/@ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faMastodon} /></Link>
          <Link href="https://github.com/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faGithub} /></Link>
          <Link href="https://discord.com/users/ellebell43"><FontAwesomeIcon className="w-12 transition-all hover:opacity-80" icon={faDiscord} /></Link>
        </div>
      </div>
    </div>
  )
}