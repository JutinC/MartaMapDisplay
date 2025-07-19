import { useState } from 'react'
import './App.css'
import TrainMap from './components/trainMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <TrainMap></TrainMap>
  )
}

export default App
