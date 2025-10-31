import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Games from "../pages/Games/Games";
import Layout from "../components/Layout/Layout";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import MyRecords from "../pages/MyRecords/MyRecords";
import SaveTest from "../pages/Dev/SaveTest";
import ReactionGame from "../pages/Games/ReactionGame";
import Profile from "../pages/Me/Profile";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "games", element: <Games /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      { path: "/me/records", element: <MyRecords /> },
      { path: "/dev/save-test", element: <SaveTest /> },
      { path: "/games/reaction", element: <ReactionGame /> },
      { path: "/me/profile", element: <Profile /> },
      { path: "*", element: <div style={{padding:16}}>페이지를 찾을 수 없습니다.</div> },
    ],
  },
]);

export default router;
