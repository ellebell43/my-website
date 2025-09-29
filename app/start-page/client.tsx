'use client'

import PrimaryPageWrapper from "@/lib/components/primary-page-wrapper";
import Clock from "@/lib/components/start-page-components/clock";
import Events from "@/lib/components/start-page-components/events";
import KiwiWidget from "@/lib/components/start-page-components/kiwi-widget";
import MusicPlayer from "@/lib/components/start-page-components/music-player";
import Pomodoro from "@/lib/components/start-page-components/pomodoro";
import ToDo from "@/lib/components/start-page-components/to-do";

export default function StartPageClient() {
  return (
    <PrimaryPageWrapper noMaxWidth={true}>
      <div className="grid grid-cols-3 text-center">
        <div id="col-1">
          <div>
            <p>unknown</p>
            {/* To be determined Widget */}
          </div>
          <KiwiWidget />
        </div>
        <div id="col-2" className="">
          <Clock />
          <Pomodoro />
          <MusicPlayer />
        </div>
        <div id="col-3">
          <ToDo />
          <Events />
        </div>
      </div>
    </PrimaryPageWrapper>
  )
}