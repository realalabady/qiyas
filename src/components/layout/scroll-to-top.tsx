import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to the top whenever the route path changes.
 * Without this, React Router keeps the previous page's scroll position, so
 * navigating (e.g. into an article from a scrolled-down list) lands mid-page.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
