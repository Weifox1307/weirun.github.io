const LAUNCH_AT = new Date("2026-08-25T12:00:00+03:00").getTime();
// Ссылка на APK из GitHub Releases (не из папки репозитория).
// Пример: https://github.com/LOGIN/REPO/releases/latest/download/WEIRUN.apk
const APK_URL = "";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function pad(n) {
  return String(n).padStart(2, "0");
}

function split(ms) {
  const t = Math.max(0, ms);
  return {
    days: Math.floor(t / 86400000),
    hours: Math.floor((t % 86400000) / 3600000),
    minutes: Math.floor((t % 3600000) / 60000),
    seconds: Math.floor((t % 60000) / 1000),
  };
}

function renderTimers() {
  const remaining = LAUNCH_AT - Date.now();
  $$("[data-countdown]").forEach((el) => {
    if (remaining <= 0) {
      el.outerHTML = '<p class="kicker">Доступно сейчас</p>';
      return;
    }
    const p = split(remaining);
    el.querySelector('[data-k="days"]').textContent = pad(p.days);
    el.querySelector('[data-k="hours"]').textContent = pad(p.hours);
    el.querySelector('[data-k="minutes"]').textContent = pad(p.minutes);
    el.querySelector('[data-k="seconds"]').textContent = pad(p.seconds);
  });
}

function toast(title, text) {
  const el = $("#toast");
  el.querySelector("b").textContent = title;
  el.querySelector("span").textContent = text;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 4200);
}

function downloadApk() {
  const url = (APK_URL || "").trim();
  if (!url) {
    toast("APK появится в день релиза", "Загрузи файл в GitHub Releases и вставь ссылку в APK_URL.");
    return;
  }
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  a.download = "WEIRUN.apk";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function setupNav() {
  const bar = $(".nav-bar");
  const menu = $("#mobile-nav");
  const toggle = $("#menu-toggle");
  const onScroll = () => bar.classList.toggle("is-solid", window.scrollY > 12 || menu.classList.contains("open"));
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    bar.classList.toggle("is-solid", open || window.scrollY > 12);
    $("#icon-menu").hidden = open;
    $("#icon-close").hidden = !open;
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      $("#icon-menu").hidden = false;
      $("#icon-close").hidden = true;
      onScroll();
    }),
  );
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) toggle.click();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTimers();
  setInterval(renderTimers, 1000);
  setupNav();
  $$("[data-apk]").forEach((el) => el.addEventListener("click", downloadApk));
});
