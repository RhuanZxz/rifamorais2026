import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const STORAGE_KEY = "rifa_admin_auth_v1";

export const Route = createFileRoute("/painel-admin-morais")({
  head: () => ({
    meta: [
      { title: "Painel — Rifa Professor Morais" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [auth, setAuth] = useState<{ username: string; password: string } | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setAuth(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const handleAuth = (username: string, password: string) => {
    const creds = { username, password };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
    setAuth(creds);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  if (!ready) return <div className="min-h-screen bg-background" />;

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      {auth ? (
        <AdminDashboard auth={auth} onLogout={logout} />
      ) : (
        <AdminLogin onAuth={handleAuth} />
      )}
    </>
  );
}
