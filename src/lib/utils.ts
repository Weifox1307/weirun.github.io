import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Для объединения Tailwind классов
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Формат времени: из секунд в ММ:СС или ЧЧ:ММ:СС
export function formatDuration(sec: number) {
  if (!sec) return "00:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Расчет темпа: секунды на километр -> ММ:СС /км
export function calculatePace(durationSec: number, distanceMeters: number) {
  if (!distanceMeters || !durationSec) return "0:00";
  const km = distanceMeters / 1000;
  const secPerKm = durationSec / km;
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Конвертация даты из timestamp (мс)
export function formatDate(timestamp: number) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Расчет возраста из timestamp рождения
export function calculateAge(birthDateTimestamp: number) {
  if (!birthDateTimestamp) return "--";
  const ageDifMs = Date.now() - birthDateTimestamp;
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
