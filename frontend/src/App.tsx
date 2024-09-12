import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./components/StartPage";
import GamePage from "./components/GamePage";


export default function App() {

  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<StartPage/>}></Route>
      <Route path="/game" element={<GamePage/>}></Route>
    </Routes>
   </BrowserRouter>
  );
}
