export const Planet = (props: { water: boolean, asteroid: boolean }) => {
  const { water } = props
  if (!props.asteroid) {
    return (
      <div className={`${water ? "bg-blue-400" : "bg-yellow-700"} rounded-full border w-[.4in] h-[.4in]`} />
    )
  } else {
    const style = "w-[.1in] h-[.1in] border rounded-full bg-slate-400"
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex gap-1">
          <div className={style} />
          <div className={style} />
        </div>
        <div className="flex gap-1">
          <div className={style} />
          <div className={style} />
          <div className={style} />
        </div>
        <div className="flex gap-1">
          <div className={style} />
          <div className={style} />
        </div>
      </div>
    )
  }
}

export const GasGiant = () => {
  return (
    <div className="absolute top-[.4in] right-[-.2in]">
      <div className="bg-black rounded-full w-[15px] h-[15px]" />
      <div className="border-2 rounded-[100%] w-[25px] h-[8px] absolute top-[4px] left-[-5px] rotate-12" />
    </div>
  )
}