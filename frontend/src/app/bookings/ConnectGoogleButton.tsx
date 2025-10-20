// app/bookings/ConnectGoogleButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { http } from "@/api/http";
import { routes } from "@/api/routes";
import type { ApiResponse, OAuthUrlPayload } from "@/types/api";

type StatusRes = ApiResponse<{ connected: boolean }>;

export default function ConnectGoogleButton() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [connecting, setConnecting] = useState(false);


  // fetch Google Calendar connection status
  const fetchStatus = useCallback(async () => {
    try {
      setChecking(true);
      const res = await http<StatusRes>(
        routes.integrations.googleCalendarStatus
      );
      setIsConnected(res?.data?.connected ?? false);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to verify Google Calendar connection. Please try again."
      );
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  }, []);


  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // handle connect button click to initiate OAuth flow
  const handleConnect = async () => {
    try {
      setConnecting(true);
      const res = await http<ApiResponse<OAuthUrlPayload>>(
        routes.integrations.googleOAuthUrl
      );
      const url = res?.data?.url;
      if (!url) throw new Error("Missing OAuth URL");
      router.push(url);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to initiate Google Calendar connection. Please try again."
      );
      setConnecting(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      {/* Estado visual */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        {checking ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-500" />
            </span>
            <span className="text-sm text-gray-600">
              Checking Google Calendar status…
            </span>
          </>
        ) : isConnected ? (
          <>
            {/* Dot con pulso cuando está conectado */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-emerald-700">
              Connected to Google Calendar
            </span>
          </>
        ) : (
          <>
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-300" />
            </span>
            <span className="text-sm text-gray-700">Not connected</span>
            <button
              type="button"
              onClick={fetchStatus}
              className="ml-1 text-sm font-medium text-blue-600 hover:underline"
            >
              Retry
            </button>
          </>
        )}
      </div>

      {/* Button for connecting to Google Calendar and show status */}
      {!isConnected && !checking ? (
        <button
          type="button"
          onClick={handleConnect}
          disabled={connecting}
          aria-busy={connecting}
          className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
        >
          {connecting ? (
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="opacity-25"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-75"
              />
            </svg>
          ) : (
            <GoogleCalendarIcon className="w-6 h-6" />
          )}
          {connecting ? "Redirecting…" : "Connect with Google Calendar"}
        </button>
      ) : null}

      <style jsx>{`
        /* No necesitas nada extra: usamos utilidades de Tailwind (animate-ping / animate-spin) */
      `}</style>
    </div>
  );
}

function GoogleCalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google Calendar"
      role="img"
      viewBox="0 0 512 512"
      className={className}
    >
      <rect width="512" height="512" rx="15%" fill="#ffffff" />
      <path d="M100 340h74V174H340v-74H137Q100 100 100 135" fill="#4285f4" />
      <path d="M338 100v76h74v-41q0-35-35-35" fill="#1967d2" />
      <path d="M338 174h74V338h-74" fill="#fbbc04" />
      <path d="M100 338v39q0 35 35 35h41v-74" fill="#188038" />
      <path d="M174 338H338v74H174" fill="#34a853" />
      <path d="M338 412v-74h74" fill="#ea4335" />
      <path
        d="M204 229a25 22 1 1 1 25 27h-9h9a25 22 1 1 1-25 27M270 231l27-19h4v-7V308"
        stroke="#4285f4"
        strokeWidth="15"
        strokeLinejoin="bevel"
        fill="none"
      />
    </svg>
  );
}
