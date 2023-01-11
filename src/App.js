import * as React from "react";
import { Route, Routes } from 'react-router-dom';
import Tracker from "./components/Tracker";
import Navbar from "./components/Navbar";
function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '75px' }}>
        <Routes>
          <Route path='/' element={<Tracker />}></Route>
          <Route path='/tracker' element={<Tracker />}></Route>
        </Routes>
      </div>

    </>

  );
}

export default App;
