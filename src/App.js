import * as React from "react";
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/';
import Tracker from "./components/Tracker";
import Navbar from "./components/Navbar";
function App() {
  return (
    <Routes>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/tracker' element={<Tracker />}></Route>
      <Route path='/navbar' element={<Navbar />}></Route>
    </Routes >
  );
}

export default App;
