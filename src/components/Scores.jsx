function Scores({ currentScore, bestScore }) {
  return (
    <div className='flex flex-row justify-between gap-24 text-slate-500 font-semibold'>
      <p className='flex-1 flex flex-row'>
        <span className='flex-1'>Current Score:</span>
        <span className='flex-none'>{currentScore}</span>
      </p>
      <p className='flex-1 flex flex-row'>
        <span className='flex-1'>Best Score:</span>
        <span className='flex-none'>{bestScore}</span>
      </p>
    </div>
  )
}

export default Scores
