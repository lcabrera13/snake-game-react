import './App.css'
import Game from './components/Game'

function App() {
  return (
    <main className='App w-full md:w-96 flex flex-col gap-2 mx-2 md:mx-0'>
      <h1 className='text-slate-500 text-2xl font-bold text-center'>Snake Game</h1>
      <Game />
    </main>
  )
}

export default App
