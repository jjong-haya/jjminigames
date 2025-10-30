import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Layout from "../components/Layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      // 예시 보호 라우트: { path: "play", element: <ProtectedRoute><Play /></ProtectedRoute> }
    ],
  },
]);
export default router;
