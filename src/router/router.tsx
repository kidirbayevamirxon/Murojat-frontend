import { createBrowserRouter } from "react-router-dom";
import SidebarLayout from "../layout/sidebarLayout";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Organizations from "../components/Organizations";
import Applications from "../pages/Applications";
import ApplicationInformation from "@/components/ApplicationInformation";
import AdminStatistics from "@/pages/Statistics";
import AdminStatisticsDetail from "@/components/StatisticsDetails";
import Settings from "@/pages/Settings";
import Organ from "@/pages/Organ";
import OrganSidebarLayout from "@/layout/OrganSideBarLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
    children: [
      { path: "/", element: <Organizations /> },
      { path: "applications", element: <Applications /> },
      { path: "applications/info/:id", element: <ApplicationInformation /> },
      { path: "statistics", element: <AdminStatistics /> },
      { path: "statistics/:id", element: <AdminStatisticsDetail /> },
      {path: "settings", element: <Settings />},
    ],
  },
  {
    path: "/organ",
    element: <OrganSidebarLayout/>,
    children: [
      {path: "/organ", element: <Organ/>},
      {path: "/organ/settings", element: <Settings/>},
    ]
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
