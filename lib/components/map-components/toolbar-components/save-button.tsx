'use client'

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faX } from "@fortawesome/free-solid-svg-icons"
import { map } from "../../../util/types"
import crypto from "crypto"
import { useRouter } from "next/navigation"
import { buttonStyle } from "../toolbar"

export const SaveButton = (props: { map: map, new: boolean }) => {
  let [error, setError] = useState<string>()
  let [pass, setPass] = useState<string>()
  let [visible, setVisible] = useState(false)
  let [saveSuccess, setSaveSuccess] = useState(false)
  let router = useRouter()

  async function saveMap() {
    let hashedPass = crypto.createHash("sha256").update(String(pass)).digest("hex")
    try {
      if (props.new) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", credentials: "include", method: "POST", body: JSON.stringify({ map: props.map, pass: hashedPass }) })
        if (!res.ok) {
          setError(`Failed to save. Error ${res.status}: ${res.statusText}`)
          return
        } else {
          // Push to new route on save of a new map
          const response: { _id: string } = await res.json()
          router.push(`/mapper/new?id=${response._id}&pass=${pass}`)
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/mapper/api`, { cache: "no-store", method: "PATCH", body: JSON.stringify({ map: props.map, pass: hashedPass }), credentials: "include" })
        if (!res.ok) {
          if (res.status == 404) setError("Not saved. Incorrect Password")
          else setError(`Failed to save. Error  ${res.status}: ${res.statusText}`)
          return
        } else {
          setSaveSuccess(true)
          setError("Map saved!")
        }
      }
    } catch (error) {
      setError(String(error))
    }
  }

  return (
    <>
      <button className={buttonStyle(visible)} onClick={() => setVisible(!visible)}><FontAwesomeIcon icon={faSave} /><span className="absolute scale-0">Save</span></button>
      {!visible ? <></> :
        <>
          <div className="fixed top-0 left-0 w-screen h-screen bg-gray-100 dark:bg-slate-800 opacity-75" />
          <div className="fixed top-0 left-0 w-screen h-screen flex  flex-col justify-center items-center">
            <form className="flex flex-col max-w-[325px] " onSubmit={e => { e.preventDefault(); saveMap() }}>
              <h2 className="absolute scale-0">Save map</h2>
              {/* Password input */}
              <input id="password " disabled={saveSuccess} onChange={e => setPass(e.target.value)} className="text-sm bg-white dark:bg-slate-700 disabled:bg-gray-100 disabled:dark:bg-slate-600 disabled:text-gray-500 disabled:dark:text-gray-400 border rounded-t-md px-2 py-1" placeholder={`${props.new ? "Set Password" : "Password"}`} type="text" />
              <label htmlFor="password" className="absolute scale-0">{props.new ? "Set Password" : "Password"}</label>
              <div className="grid grid-cols-2">
                <button
                  className="border rounded-bl-md bg-white dark:bg-slate-700 px-4 py-2 text-lg shadow transition-all hover:cursor-pointer disabled:bg-gray-100 disabled:dark:bg-slate-600 disabled:text-gray-500 disabled:dark:text-gray-400 disabled:hover:cursor-auto hover:bg-gray-100 dark:hover:bg-slate-800"
                  onClick={() => { setVisible(false); setError(undefined); setSaveSuccess(false) }}
                  type="button"
                >
                  Close
                </button>
                {/* Submit map to database */}
                <button
                  className="border rounded-br-md bg-white dark:bg-slate-700 px-4 py-2 text-lg shadow transition-all hover:cursor-pointer disabled:bg-gray-100 disabled:dark:bg-slate-600 disabled:text-gray-500 disabled:dark:text-gray-400 disabled:hover:cursor-auto hover:bg-gray-100 dark:hover:bg-slate-800"
                  onClick={() => saveMap()}
                  type="button"
                  disabled={pass === undefined || pass === "" || !(error === undefined || error === "")}
                >
                  {props.new ? "Save new map" : "Save"}
                </button>
              </div>
            </form>
            {/* If API error occurs, show error message */}
            {error ?
              <div className={`${error === "Map saved!" ? "bg-green-300 dark:bg-green-800" : "bg-red-300 dark:bg-red-800"} px-2 my-4 absolute bottom-18 border-2 rounded`}>
                <p className="text-center text-sm">{error}</p>
                {/* Dismiss error */}
              </div> : <></>}
          </div>
        </>}
    </>
  )
}