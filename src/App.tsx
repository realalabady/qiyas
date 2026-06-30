import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";

import { appRouter } from "@/app/router";
import { AdminProvider } from "@/contexts/admin-context";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/stores/theme-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useArticles } from "@/stores/articles-store";
import { useCategories } from "@/stores/categories-store";

function App() {
  const { language, getDirection } = useLanguage();
  const { theme, applyTheme } = useTheme();

  // Load published content from Firestore so every device sees the same data.
  useEffect(() => {
    useQuizzesAdmin.getState().hydrate();
    useArticles.getState().hydrate();
    useCategories.getState().hydrate();
  }, []);

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
