import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Mappa from './Mappa'
import Info from './Info'
import Accetta from './Accetta'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Info />} />
        <Route path="/accetta" element={<Accetta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
