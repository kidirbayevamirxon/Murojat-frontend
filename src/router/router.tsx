import { createBrowserRouter } from "react-router-dom";
import SidebarLayout from "../layout/sidebarLayout";
// import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Organizations from "../components/Organizations";
import Applications from "../pages/Applications";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />, 
    children: [
      // { path: "/", element: <Home /> },
      { path: "/", element: <Organizations /> },
      { path: "applications", element: <Applications /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
