import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/layouts/admin-layout";
import PublicLayout from "@/layouts/public-layout";
import HomePage from "@/pages/home-page";
import ExplorePage from "@/pages/explore-page";
import CategoriesPage from "@/pages/categories-page";
import SearchPage from "@/pages/search-page";
import QuizDetailPage from "@/pages/quiz-detail-page";
import { QuizTakePage } from "@/pages/quiz-take-page";
import { QuizResultPage } from "@/pages/quiz-result-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import FAQPage from "@/pages/faq-page";
import PrivacyPage from "@/pages/privacy-page";
import TermsPage from "@/pages/terms-page";
import { AdminLoginPage } from "@/pages/admin-login-page";
import { AdminDashboardPage } from "@/pages/admin-dashboard-page";
import { AdminSettingsPage } from "@/pages/admin-settings-page";
import { AdminArticlesPage } from "@/pages/admin-articles-page";
import { AdminQuizzesPage } from "@/pages/admin-quizzes-page";
import { AdminCategoriesPage } from "@/pages/admin-categories-page";
import { AdminMediaPage } from "@/pages/admin-media-page";
import { ArticlesPage } from "@/pages/articles-page";
import { ArticleDetailPage } from "@/pages/article-detail-page";
import { ProtectedAdminRoute } from "@/components/auth/protected-admin-route";
import NotFoundPage from "@/pages/not-found-page";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "quiz/:slug", element: <QuizDetailPage /> },
      {
        path: "quiz/:slug/take",
        element: <QuizTakePage />,
      },
      {
        path: "quiz/:slug/result/:resultId",
        element: <QuizResultPage />,
      },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "articles", element: <ArticlesPage /> },
      { path: "articles/:slug", element: <ArticleDetailPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "privacy-policy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "login",
        element: <AdminLoginPage />,
      },
      {
        index: true,
        element: (
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: "quizzes",
        element: (
          <ProtectedAdminRoute>
            <AdminQuizzesPage />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedAdminRoute>
            <AdminCategoriesPage />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: "media",
        element: (
          <ProtectedAdminRoute>
            <AdminMediaPage />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedAdminRoute>
            <AdminSettingsPage />
          </ProtectedAdminRoute>
        ),
      },
      {
        path: "articles",
        element: (
          <ProtectedAdminRoute>
            <AdminArticlesPage />
          </ProtectedAdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
