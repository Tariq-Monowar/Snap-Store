import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateData from './components/CreateData'
import Home from './components/Home'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} /> 
        <Route path='/form' element={<CreateData />} /> 
      </Routes> 
    </BrowserRouter>
  )
}

export default App