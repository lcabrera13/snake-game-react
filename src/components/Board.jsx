import Apple from './Apple'
import Snake from './Snake'

function Board({ snake, apple }) {
  return (
    <div className='grid grid-cols-20 grid-rows-20 w-full h-full bg-slate-900'>
      <Snake snake={snake} />
      {apple && <Apple apple={apple} />}
    </div>
  )
}

export default Board
