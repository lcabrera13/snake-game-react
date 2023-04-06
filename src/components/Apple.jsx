function Apple({ apple }) {
  const { positionX, positionY } = apple
  return (
    <div
      className='bg-red-600 text-xs text-center shadow-[0px_0px_13px_2px_rgba(255,0,0,0.51)]'
      style={{
        gridArea: `${positionY}/${positionX}/auto/auto`,
        zIndex: 1
      }}
    >
      &nbsp;
    </div>
  )
}

export default Apple
