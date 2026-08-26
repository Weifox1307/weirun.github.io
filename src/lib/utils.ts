import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Формат для архива (без долей секунд)
export function formatDuration(sec: number | null | undefined): string {
  if (!sec) return "00:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Формат для экрана бега (с десятыми: 00:11.5)
export function formatStopwatch(ms: number): string {
  if (!ms) return "00:00.0";
  const totalSec = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${tenths}`;
}

export function calculatePace(durationSec: number | null | undefined, distanceMeters: number | null | undefined): string {
  if (!distanceMeters || !durationSec || distanceMeters === 0) return "--:--";
  const km = distanceMeters / 1000;
  const secPerKm = durationSec / km;
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  if (m > 99) return ">99:59"; // Если стоим на месте
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("ru-RU", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function calculateAge(birthDateTimestamp: number | null | undefined): string | number {
  if (!birthDateTimestamp) return "--";
  const ageDate = new Date(Date.now() - birthDateTimestamp);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; 
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
