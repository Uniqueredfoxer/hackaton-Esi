import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/home";
import Community from "./pages/community";
import Resources from "./pages/resources";
import Upload from "./pages/upload";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Signup from "./pages/signup";
import FAQ from "./pages/FAQ";
import Help from "./pages/help";
import Contact from "./pages/contact";
import About from "./pages/about";
import Post from "./pages/post";
import DocumentDetailPage from "./pages/documentDetailPage";
import PostDetailPage from "./pages/postDetailPage";
import AdminRoute from "./pages/admin/adminRoute";
import AdminDashboard from "./pages/admin/adminDashboard";
import ForgotPasswordForm from "./pages/forgottenPassword";
import UpdatePasswordPage from "./pages/updatePassword";
import ConfirmEmail from "./pages/confirmEmail";
import DocumentDetail from "./pages/documentDetailPage";

const Router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/community", element: <Community /> },
      { path: "/resources", element: <Resources /> },
      { path: "/upload", element: <Upload /> },
      { path: "/profile", element: <Profile /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/help", element: <Help /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about", element: <About /> },
      { path: "/post", element: <Post /> },
      { path: "/post/:id", element: <PostDetailPage /> },
      { path: "/document/:id", element: <DocumentDetailPage /> },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      { path: "/forgot-password", element: <ForgotPasswordForm /> },
      { path: "/update-password", element: <UpdatePasswordPage /> },
      { path: "/confirm-email", element: <ConfirmEmail /> },
      { path: ".document/:id", element: <DocumentDetail /> },
    ],
  },
]);

export default Router;
