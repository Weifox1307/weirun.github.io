import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as History, d as Activity, i as Trophy, l as Download, n as Users, o as Navigation, r as UserRound, s as Menu, t as X, u as ChartColumn } from "../_libs/lucide-react.mjs";
import { a as SITE, i as SCREENS, n as FEATURES, r as NAV } from "./router-Dlk9rCYQ.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DygVHbvW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 transition-[background-color,box-shadow,color,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent),0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] hover:brightness-110",
			ghost: "bg-card/70 text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_12%,transparent)] hover:bg-card",
			outline: "bg-transparent text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_16%,transparent)] hover:bg-card/60",
			limeGhost: "bg-transparent text-primary shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] hover:bg-primary/10"
		},
		size: {
			sm: "h-10 rounded-lg px-3.5 text-sm",
			md: "h-12 rounded-xl px-5 text-sm",
			lg: "h-14 rounded-2xl px-6 text-base",
			icon: "size-11 rounded-full"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function split(ms) {
	const clamped = Math.max(0, ms);
	return {
		days: Math.floor(clamped / 864e5),
		hours: Math.floor(clamped % 864e5 / 36e5),
		minutes: Math.floor(clamped % 36e5 / 6e4),
		seconds: Math.floor(clamped % 6e4 / 1e3)
	};
}
var LABELS = [
	{
		key: "days",
		label: "Дни"
	},
	{
		key: "hours",
		label: "Часы"
	},
	{
		key: "minutes",
		label: "Минуты"
	},
	{
		key: "seconds",
		label: "Секунды"
	}
];
function useLaunchCountdown() {
	const target = (0, import_react.useMemo)(() => new Date(SITE.launchAt).getTime(), []);
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	if (now === null) return {
		ready: false,
		remaining: 0,
		parts: split(0),
		launched: false
	};
	const remaining = target - now;
	return {
		ready: true,
		remaining,
		parts: split(remaining),
		launched: remaining <= 0
	};
}
function Countdown({ className }) {
	const { ready, parts, launched } = useLaunchCountdown();
	if (launched) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("section-kicker", className),
		children: "Доступно сейчас"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid grid-cols-4 gap-2 sm:gap-3", className),
		role: "timer",
		"aria-live": "polite",
		"aria-label": "До релиза",
		children: LABELS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass flex flex-col items-center rounded-2xl px-2 py-3 sm:px-3 sm:py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-3xl font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-4xl",
				children: ready ? String(parts[item.key]).padStart(2, "0") : "––"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-2 text-xs font-medium uppercase tracking-section text-muted",
				children: item.label
			})]
		}, item.key))
	});
}
function RuStoreMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "store-rustore flex size-11 items-center justify-center rounded-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "size-6",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "white",
				d: "M7 6.5h4.2c2.4 0 3.8 1.3 3.8 3.2 0 1.4-.8 2.4-2 2.9l2.4 4.9h-2.5l-2.2-4.6H9.2V17.5H7V6.5Zm2.2 1.8v3.2h1.8c1.2 0 1.9-.5 1.9-1.6s-.7-1.6-1.9-1.6H9.2Z"
			})
		})
	});
}
function GalleryMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "store-gallery flex size-11 items-center justify-center rounded-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "size-6",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "white",
				d: "M7 8.2c0-1.8 1.6-3.2 5-3.2s5 1.4 5 3.2c0 1.2-.7 2.1-1.9 2.6 1.4.5 2.3 1.5 2.3 2.9 0 2-1.7 3.5-5.4 3.5S6.6 15.7 6.6 13.7c0-1.4.9-2.4 2.3-2.9C7.7 10.3 7 9.4 7 8.2Zm2.3.2c0 .8.8 1.3 2.7 1.3s2.7-.5 2.7-1.3-.8-1.3-2.7-1.3-2.7.5-2.7 1.3Zm-0.1 4.8c0 .9.9 1.5 3 1.5s3-.6 3-1.5-.9-1.4-3-1.4-3 .6-3 1.4Z"
			})
		})
	});
}
function StoreBadges() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-section text-muted",
			children: "Скоро в магазинах приложений"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: SITE.rustoreUrl,
				target: "_blank",
				rel: "noreferrer",
				className: "glass flex h-16 items-center gap-3 rounded-2xl px-4 transition-[background-color] duration-150 hover:bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuStoreMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-semibold text-foreground",
					children: "RuStore"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted",
					children: "Скоро"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: SITE.appgalleryUrl,
				target: "_blank",
				rel: "noreferrer",
				className: "glass flex h-16 items-center gap-3 rounded-2xl px-4 transition-[background-color] duration-150 hover:bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-semibold text-foreground",
					children: "AppGallery"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted",
					children: "Скоро"
				})] })]
			})]
		})]
	});
}
async function downloadApk() {
	try {
		if (!(await fetch(SITE.apkUrl, { method: "HEAD" })).ok) {
			toast.message("APK появится в день релиза", { description: "А пока следи за обратным отсчётом — файл подключится сюда же." });
			return;
		}
		const link = document.createElement("a");
		link.href = SITE.apkUrl;
		link.download = SITE.apkFileName;
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch {
		toast.message("APK появится в день релиза", { description: "Не удалось скачать файл. Попробуй ещё раз позже." });
	}
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/logo-mark.png",
		alt: "",
		width: 209,
		height: 214,
		className: cn("select-none object-contain", className)
	});
}
function LogoLockup({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "wordmark text-lg leading-none text-foreground",
			children: "WEIRUN"
		})]
	});
}
function DownloadSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "download",
		className: "mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass relative overflow-hidden rounded-3xl px-6 py-12 sm:rounded-3xl sm:px-12 sm:py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl",
				"aria-hidden": true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "mb-6 h-14 w-14" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-kicker",
						children: "Релиз"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl font-semibold uppercase tracking-section text-foreground sm:text-5xl",
						children: "Скачай WEIRUN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-base leading-relaxed text-muted",
						children: "Победы начинаются с тебя. Прямая установка APK — без ожидания витрин. Магазины подключим в день запуска."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { className: "mt-8 max-w-lg" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "lg",
							onClick: () => void downloadApk(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" }), "Скачать APK"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#showcase",
								children: "Смотреть экраны"
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreBadges, {})]
			})]
		})
	});
}
var MAP = {
	navigation: Navigation,
	activity: Activity,
	whistle: Users,
	user: UserRound,
	history: History,
	chart: ChartColumn,
	medal: Trophy
};
function FeatureIcon({ name, className }) {
	const Icon = MAP[name] ?? Navigation;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className,
		strokeWidth: 1.75
	});
}
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "features",
		className: "mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-kicker",
				children: "Возможности"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-4xl font-semibold uppercase tracking-section text-foreground sm:text-5xl",
				children: "Удобный трекер для любых дистанций, условий и целей"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: FEATURES.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "glass rounded-3xl p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "icon-ring flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureIcon, {
							name: feature.icon,
							className: "size-5"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 font-display text-2xl font-semibold uppercase tracking-wide text-foreground",
						children: feature.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: feature.text
					})
				]
			}, feature.id))
		})]
	});
}
function PhoneFrame({ src, alt, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("device", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "device-screen",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt,
				width: 780,
				height: 1420
			})
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center text-center lg:items-start lg:text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "soon-pill inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-section text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dot size-1.5 rounded-full bg-primary",
							"aria-hidden": true
						}), "Скоро релиз"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, { className: "logo-glow mb-5 h-16 w-16 sm:h-20 sm:w-20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex w-full max-w-md items-center gap-4 lg:max-w-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-foreground/20" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "wordmark text-xs text-foreground/80",
							children: SITE.tagline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-foreground/20" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium uppercase tracking-section text-muted sm:text-base",
					children: SITE.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "wordmark mt-2 text-6xl leading-none text-foreground sm:text-7xl lg:text-8xl",
					children: SITE.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl font-medium uppercase tracking-section text-foreground/85 sm:text-3xl",
					children: SITE.headline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-base leading-relaxed text-muted lg:max-w-lg",
					children: SITE.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { className: "mt-8 w-full max-w-md lg:max-w-lg" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "start-orb",
						onClick: () => void downloadApk(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-7",
							strokeWidth: 2.2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Скачать"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-3 sm:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#features",
								children: "Что внутри"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-[16rem] text-xs leading-relaxed text-muted",
							children: "Прямая загрузка APK. RuStore и AppGallery — в день релиза."
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto w-full max-w-xs sm:max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl",
				"aria-hidden": true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, {
				src: "/screens/01.jpg",
				alt: "Главный экран WEIRUN"
			})]
		})]
	});
}
function Showcase() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "showcase",
		className: "scroll-mt-24 py-20 lg:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 text-center sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-kicker",
					children: "Интерфейс"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl font-semibold uppercase tracking-section text-foreground sm:text-5xl",
					children: "Вся история забегов в одном месте"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted",
					children: "Тёмные стеклянные экраны, лаймовый акцент и шум — как в самом приложении."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mt-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-8 lg:px-12",
					children: SCREENS.map((screen) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "w-[220px] shrink-0 snap-center sm:w-[260px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, {
							src: screen.src,
							alt: screen.alt
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-4 text-center text-sm font-medium uppercase tracking-section text-muted",
							children: screen.caption
						})]
					}, screen.src))
				})
			]
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-foreground/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoLockup, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: [SITE.tagline, ". Современный GPS-трекер для бега — карта, тренер, архив и достижения."]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-3",
				"aria-label": "Подвал",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.href,
					className: "text-sm font-medium text-muted transition-[color] duration-150 hover:text-foreground",
					children: item.label
				}, item.href))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-10 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"© ",
				SITE.year,
				" ",
				SITE.name,
				". Все права защищены."
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "RuStore · AppGallery · APK" })]
		})]
	});
}
function SiteHeader() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("sticky top-0 z-40 px-4 pt-3 sm:px-6", open && "z-50"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-3 transition-[background-color,box-shadow] duration-200 ease-out sm:h-16 sm:px-4", scrolled || open ? "glass-strong" : "bg-transparent"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#top",
					className: "rounded-lg focus-visible:ring-2 focus-visible:ring-primary/70",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoLockup, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-8 md:flex",
					"aria-label": "Разделы",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: "text-sm font-medium text-muted transition-[color] duration-150 hover:text-foreground",
						children: item.label
					}, item.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						className: "hidden sm:inline-flex",
						onClick: () => void downloadApk(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Скачать APK"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						className: "md:hidden",
						"aria-expanded": open,
						"aria-controls": "mobile-nav",
						"aria-label": open ? "Закрыть меню" : "Открыть меню",
						onClick: () => setOpen((v) => !v),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "mobile-nav",
			className: "glass-strong mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-1",
				"aria-label": "Мобильная навигация",
				children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.href,
					className: "rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10",
					onClick: () => setOpen(false),
					children: item.label
				}, item.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					className: "mt-2 w-full",
					onClick: () => {
						setOpen(false);
						downloadApk();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Скачать APK"]
				})]
			})
		}) : null]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "page-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "noise-layer",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Showcase, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DownloadSection, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center",
				toastOptions: { className: "glass-strong !border-0 !text-foreground" }
			})
		]
	});
}
//#endregion
export { Home as component };
