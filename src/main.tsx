import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Form from "./pages/form_page";

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <Form />,
        errorElement: <h1>404 Not Found</h1>,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
