import { RouterProvider } from "react-router-dom";

import { appRouter } from "@/app/router";
import { AdminProvider } from "@/contexts/admin-context";

function App() {
  return (
    <AdminProvider>
      <RouterProvider router={appRouter} />
    </AdminProvider>
  );
}

export default App;
