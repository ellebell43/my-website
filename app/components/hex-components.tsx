export const Hex = (props: { id: string }) => {
  return (
    <div className={`hexagon-out relative`}>
      <div className="hexagon-in absolute top-[.025in] left-[.025in]">
        <p className="text-center">{props.id}</p>
      </div>
    </div>
  )
}

export const HexCol = (props: { id: string, start: number, style?: string }) => {
  const { id, start, style } = props
  // Create an array of Hexes of specified amount
  // start and stop are used to determine length and for the first 2 digits of the Hex id
  const arr = []
  for (let i = start; i < start + 10; i++) {
    const hexId = i < 10 ? "0" + String(i) : String(i)
    arr.push(<Hex key={i} id={id + hexId} />)
  }
  // Map the array out in a div container
  return (
    <div className={style}>
      {arr.map((el, i) => {
        return el
      })}
    </div>
  )
}

export const HexColDouble = (props: { id: number, start: number }) => {
  const { id, start } = props
  // parse first 2 digits of hex id for both columns
  const id1 = id < 10 ? "0" + String(id) : String(id)
  const id2 = id + 1 < 10 ? "0" + String(id + 1) : String(id + 1)
  // Create two hex columns, offset the second to create a tight grid
  return (
    <div className="relative w-[2.3in]">
      <HexCol id={id1} start={start} />
      <HexCol id={id2} start={start} style="absolute top-[.67in] right-[-.4in]" />
    </div>
  )
}

export const SubSector = (props: { startX: 1 | 9 | 17 | 25, startY: 1 | 11 | 21 | 31 }) => {
  const { startX, startY } = props
  // Determine subsector offset by column (startX)
  const offset = startX == 1 ? .18 : startX == 9 ? .18 : startX == 17 ? .18 : .18;

  return (
    <div className={`relative border-2 overflow-hidden w-[9.2in] h-[13.4in]`}>
      <div className={`flex absolute top-[-.05in] left-[-.2in]`}>
        {/* Extra column for consistent border widths */}
        <HexCol id={"00"} start={0} style="absolute top-[.67in] left-[-1.15in]" />
        {/* Total of 8 columns, 8x10 hex grid */}
        <HexColDouble id={startX} start={startY} />
        <HexColDouble id={startX + 2} start={startY} />
        <HexColDouble id={startX + 4} start={startY} />
        <HexColDouble id={startX + 6} start={startY} />
        {/* Extra column for consistent border widths */}
        <HexCol id={"00"} start={0} style="w-[0.3in] absolute right-[-.3in]" />
      </div>
    </div>
  )
}

export const Sector = () => {
  return (
    <div className="p-4">
      <div className="flex">
        <SubSector startX={1} startY={1} />
        <SubSector startX={9} startY={1} />
        <SubSector startX={17} startY={1} />
        <SubSector startX={25} startY={1} />
      </div>
      <div className="flex">
        <SubSector startX={1} startY={11} />
        <SubSector startX={9} startY={11} />
        <SubSector startX={17} startY={11} />
        <SubSector startX={25} startY={11} />
      </div>
      <div className="flex">
        <SubSector startX={1} startY={21} />
        <SubSector startX={9} startY={21} />
        <SubSector startX={17} startY={21} />
        <SubSector startX={25} startY={21} />
      </div>
      <div className="flex">
        <SubSector startX={1} startY={31} />
        <SubSector startX={9} startY={31} />
        <SubSector startX={17} startY={31} />
        <SubSector startX={25} startY={31} />
      </div>
    </div>
  )
}
