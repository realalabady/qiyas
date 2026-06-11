import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";

import { appRouter } from "@/app/router";
import { AdminProvider } from "@/contexts/admin-context";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/stores/theme-store";

function App() {
  const { language, getDirection } = useLanguage();
  const { theme, applyTheme } = useTheme();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDirection();
  }, [language, getDirection]);

  useEffect(() => {
    applyTheme();
  }, [
    applyTheme,
    theme.primaryColor,
    theme.accentColor,
    theme.logo,
    theme.favicon,
  ]);

  return (
    <AdminProvider>
      <RouterProvider router={appRouter} />
    </AdminProvider>
  );
}

export default App;
