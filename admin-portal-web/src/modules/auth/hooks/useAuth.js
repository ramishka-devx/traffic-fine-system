import { useEffect, useState } from "react";
import { loginOfficer, logoutOfficer } from "../api/authApi";
import { clearSession, readSession, saveSession } from "../../../shared/auth/session";

export function useAuth() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSession(readSession());
    setHydrated(true);
  }, []);

  async function login(credentials) {
    setLoading(true);
    setError("");

    try {
      const data = await loginOfficer(credentials);
      const nextSession = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        user: data.user
      };

      saveSession(nextSession);
      setSession(nextSession);
      return nextSession;
    } catch (err) {
      setError(err.message || "Unable to log in.");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (session?.refreshToken) {
      try {
        await logoutOfficer(session.refreshToken);
      } catch {
        // Clear local session even if server-side logout fails.
      }
    }

    clearSession();
    setSession(null);
  }

  return {
    hydrated,
    session,
    loading,
    error,
    login,
    logout
  };
}