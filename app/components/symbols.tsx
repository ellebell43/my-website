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