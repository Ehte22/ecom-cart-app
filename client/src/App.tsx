import React from 'react'

import './index.scss'
import { Outlet, Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PageNotFound from './pages/PageNotFound'

const App = () => {

  return <>
    <Routes>
      <Route path='/' element={<><Outlet /></>}>
        <Route index element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </>
}

export default App