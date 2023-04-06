import { useReducer, useState, useEffect } from 'react'
import { FaPlay, FaPause, FaStop, FaArrowLeft, FaArrowUp, FaArrowDown, FaArrowRight } from 'react-icons/fa'
import Scores from './Scores'
import Board from './Board'

const LOCAL_STORAGE_BEST_SCORE = 'BEST_SCORE'

function reducer(state, action) {
  const newState = { ...state }

  if (action.type === 'create_game') {
    newState.snake = generateSnake()
  } else if (action.type === 'start_game') {
    newState.isStarted = !newState.isStarted

    if (!newState.apple) {
      newState.apple = generateApple(newState.snake)
    }

    if (newState.direction[0] === 0 && newState.direction[1] === 0) {
      newState.direction = [1, 0]
    }
  } else if (action.type === 'stop_game') {
    newState.isStarted = false
    newState.snake = generateSnake()
    newState.apple = null
    newState.direction = [0, 0]
    newState.currentScore = 0
    newState.gameOver = false
  } else if (action.type === 'move_left' && Math.abs(newState.direction[0]) !== 1) {
    newState.direction = [-1, 0]
  } else if (action.type === 'move_up' && Math.abs(newState.direction[1]) !== 1) {
    newState.direction = [0, -1]
  } else if (action.type === 'move_right' && Math.abs(newState.direction[0]) !== 1) {
    newState.direction = [1, 0]
  } else if (action.type === 'move_down' && Math.abs(newState.direction[1]) !== 1) {
    newState.direction = [0, 1]
  } else if (action.type === 'move_snake') {
    let newSnake = [...newState.snake]

    const head = { ...newSnake[newSnake.length - 1] }
    head.positionX += newState.direction[0]
    head.positionY += newState.direction[1]

    const tail = newSnake[0]

    const isValidPosition = validateSnakeHead(newSnake, head)
    if (isValidPosition) {
      newSnake.push({ ...head })
      newSnake.shift()

      if (head.positionX === newState.apple.positionX && head.positionY === newState.apple.positionY) {
        newState.previousApples.push(newState.apple)
        newState.apple = generateApple(newSnake)
        newState.currentScore += 1
      }

      if (
        newState.previousApples.length > 0 &&
        tail.positionX === newState.previousApples[0].positionX &&
        tail.positionY === newState.previousApples[0].positionY
      ) {
        newState.previousApples.shift()
        newSnake.unshift({ ...tail })
      }
    } else {
      if (newState.currentScore > newState.bestScore) {
        newState.bestScore = newState.currentScore
        localStorage.setItem(LOCAL_STORAGE_BEST_SCORE, newState.bestScore)
      }
      newSnake = []
      newState.apple = null
      newState.gameOver = true
    }

    newState.snake = newSnake
  }

  return newState
}

function generateSnake() {
  const positionX = Math.floor(Math.random() * 20) + 1
  const positionY = Math.floor(Math.random() * 20) + 1
  return [{ positionX, positionY }]
}

function generateApple(snake) {
  const positionX = Math.floor(Math.random() * 20) + 1
  const positionY = Math.floor(Math.random() * 20) + 1
  if (snake.some((s) => s.positionX === positionX && s.positionY === positionY)) {
    return generateApple(snake)
  }
  return { positionX, positionY }
}

function validateSnakeHead(snake, head) {
  if (snake.some((s) => s.positionX === head.positionX && s.positionY === head.positionY)) {
    return false
  }

  if (head.positionX >= 0 && head.positionX <= 20 && head.positionY >= 0 && head.positionY <= 20) {
    return true
  }

  return false
}

const initialState = {
  isStarted: false,
  snake: [],
  previousApples: [],
  apple: null,
  direction: [0, 0],
  currentScore: 0,
  bestScore: Number.parseInt(localStorage.getItem(LOCAL_STORAGE_BEST_SCORE)) || 0,
  gameOver: false
}

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { isStarted, snake, apple, direction, currentScore, bestScore, gameOver } = state
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    dispatch({ type: 'create_game' })
  }, [])

  useEffect(() => {
    let timer

    if (moving && !gameOver) {
      document.addEventListener('keydown', handleSnakeMoveWithKeyboard)
      timer = setInterval(() => {
        dispatch({ type: 'move_snake' })
      }, 500)
    }

    return () => {
      document.removeEventListener('keydown', handleSnakeMoveWithKeyboard)
      clearInterval(timer)
    }
  }, [moving, gameOver])

  const startGame = () => {
    const action = { type: 'start_game' }
    dispatch(action)
    const nextState = reducer(state, action)
    setMoving(nextState.isStarted)
  }

  const stopGame = () => {
    const action = { type: 'stop_game' }
    dispatch(action)
    const nextState = reducer(state, action)
    setMoving(nextState.isStarted)
  }

  const handleSnakeMoveWithKeyboard = (e) => {
    switch (e.keyCode) {
      case 37:
        dispatch({ type: 'move_left' })
        break
      case 38:
        dispatch({ type: 'move_up' })
        break
      case 39:
        dispatch({ type: 'move_right' })
        break
      case 40:
        dispatch({ type: 'move_down' })
        break
    }
  }

  const handleSnakeMoveWithButton = (move) => {
    if (isStarted) {
      dispatch({ type: move })
    }
  }

  return (
    <>
      <Scores currentScore={currentScore} bestScore={bestScore} />
      <div className='w-auto h-80 md:h-96 relative'>
        <Board snake={snake} apple={apple} />
        {gameOver && (
          <div className='text-red-700 text-2xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            Game Over
          </div>
        )}
      </div>
      <div className='flex flex-row gap-2'>
        <button onClick={startGame} disabled={gameOver} className='btn' type='button'>
          {isStarted ? <FaPause className='m-auto' /> : <FaPlay className='m-auto' />}
        </button>
        <button onClick={stopGame} className='btn' type='button'>
          <FaStop className='m-auto' />
        </button>
      </div>
      <div className='flex flex-row gap-2'>
        <button
          id='btnLeft'
          onClick={() => handleSnakeMoveWithButton('move_left')}
          disabled={!isStarted || gameOver || Math.abs(direction[0]) === 1}
          className='btn'
          type='button'
        >
          <FaArrowLeft className='m-auto' />
        </button>
        <button
          id='btnUp'
          onClick={() => handleSnakeMoveWithButton('move_up')}
          disabled={!isStarted || gameOver || Math.abs(direction[1]) === 1}
          className='btn'
          type='button'
        >
          <FaArrowUp className='m-auto' />
        </button>
        <button
          id='btnDown'
          onClick={() => handleSnakeMoveWithButton('move_down')}
          disabled={!isStarted || gameOver || Math.abs(direction[1]) === 1}
          className='btn'
          type='button'
        >
          <FaArrowDown className='m-auto' />
        </button>
        <button
          id='btnRight'
          onClick={() => handleSnakeMoveWithButton('move_right')}
          disabled={!isStarted || gameOver || Math.abs(direction[0]) === 1}
          className='btn'
          type='button'
        >
          <FaArrowRight className='m-auto' />
        </button>
      </div>
    </>
  )
}
