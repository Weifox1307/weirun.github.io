import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.navigate({ to: "/profile" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <img src="/logo-mark.png" alt="WEIRUN" className="w-20 h-20 mb-8" />
      <h1 className="text-3xl font-display font-bold uppercase tracking-wider mb-8">Вход в систему</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
          value={password} onChange={(e) => setPassword(e.target.value)} required 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-black font-bold uppercase py-4 rounded-xl mt-4 hover:brightness-110 active:scale-95 transition-all"
        >
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
