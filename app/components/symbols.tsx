export const Planet = (props: { water: boolean }) => {
  const { water } = props
  return (
    <div className={`${water ? "bg-blue-500" : "bg-amber-500"} rounded-full w-[.25in] h-[.25in]`} />
  )
}