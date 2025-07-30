import { ReactNode } from "react";

export default function SelectButton(props: { enabled: boolean, setState: Function, label: string, reverseSetEnable?: boolean }) {
  const { enabled, setState, label, reverseSetEnable } = props
  return (
    <button onClick={() => setState(reverseSetEnable ? enabled :
      !enabled)} className="flex gap-4 hover:cursor-pointer hover:text-slate-500">
      <div className={`w-[25px] h-[25px] border rounded ${enabled ? "bg-slate-300" : "bg-white"}`} />
      <p>{label}</p>
    </button>
  )
}