import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import EditPostPage from "./routes/editPost/editPostPage";
import AgentProfile from "./routes/agentPage/agentProfile";
import AdminProfile from "./routes/adminPage/adminProfile";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import AgentList from "./routes/agentList/agentList";
import AgentPage from "./routes/agent/agentPage";
import NotificationsPage from "./routes/adminNotification/notificationPage";
import AgentHome from "./routes/agentHome/agentHome";
import BlogPage from "./routes/Blog/blog";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/agents",
          element: <AgentList />,
        },
        {
          path: "/agents/:id",
          element: <AgentHome />,
        },
        
      ],
    },
    {
      path: "/",
      element: <RequireAuth />, // Wrapper for protected routes
      children: [
        {
          path: "profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "add",
          element: <NewPostPage />,
        },
        {
          path: "edit/:id",
          element: <EditPostPage />,
        },
        {
          path: "agentProfile",
          element: <AgentProfile />,
          loader: profilePageLoader,
        },
        {
          path: "adminProfile",
          element: <AdminProfile />,

        },
        {
          path: "notifications",
          element: <NotificationsPage />,
        },
        {
          path: "/be_an_agent",
          element: <AgentPage />,
        },
        {
          path: "/blog",
          element: <BlogPage />,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
