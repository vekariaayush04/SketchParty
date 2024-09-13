import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./components/StartPage";
import GamePage from "./components/GamePage";
import { RecoilRoot } from "recoil";


export default function App() {

  return (
   <RecoilRoot>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<StartPage/>}></Route>
      <Route path="/game" element={<GamePage/>}></Route>
    </Routes>
   </BrowserRouter>
   </RecoilRoot>
  );
}
