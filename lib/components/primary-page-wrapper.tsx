import { Winky_Sans } from "next/font/google"

const winkySans = Winky_Sans({ weight: "500", subsets: ["latin"] })

export default function PrimaryPageWrapper(props: { children: React.ReactNode }) {
  return (
    <div className={`p-6 from-blue-50 to-purple-100 dark:from-blue-900 dark:to-purple-900 bg-gradient-to-br min-h-screen ${winkySans.className} `}>
      <div className="max-w-[1000px] mx-auto relative">
        {props.children}
      </div>
    </div>
  )
}