import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import HomePage from "./pages/HomePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

// Root layout component
function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isAuthenticated = !!identity;
  const principalId = identity?.getPrincipal().toString();

  useEffect(() => {
    if (!isAuthenticated || !principalId || profileLoading || !isFetched) {
      setShowProfileModal(false);
      return;
    }

    // Check if user has dismissed the modal before
    const dismissedKey = `profile-setup-dismissed-${principalId}`;
    const hasDismissed = localStorage.getItem(dismissedKey) === "true";

    // Show modal only if user has no profile and hasn't dismissed it
    if (userProfile === null && !hasDismissed) {
      setShowProfileModal(true);
    } else {
      setShowProfileModal(false);
    }
  }, [isAuthenticated, principalId, userProfile, profileLoading, isFetched]);

  const handleDismissModal = () => {
    if (principalId) {
      const dismissedKey = `profile-setup-dismissed-${principalId}`;
      localStorage.setItem(dismissedKey, "true");
    }
    setShowProfileModal(false);
  };

  const handleProfileCreated = () => {
    setShowProfileModal(false);
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading SCOOPEX Shift...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {showProfileModal && (
        <ProfileSetupModal
          onDismiss={handleDismissModal}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </div>
  );
}

// Create root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Create route tree
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPolicyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsOfServicePage,
});

const routeTree = rootRoute.addChildren([indexRoute, privacyRoute, termsRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
