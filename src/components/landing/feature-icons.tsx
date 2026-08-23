import {
  Activity,
  BarChart3,
  History,
  Navigation,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  navigation: Navigation,
  activity: Activity,
  whistle: Users,
  user: UserRound,
  history: History,
  chart: BarChart3,
  medal: Trophy,
};

export function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Navigation;
  return <Icon className={className} strokeWidth={1.75} />;
}
