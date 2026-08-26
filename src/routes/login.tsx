import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Для регистрации
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      // 1. Регистрация в Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("Ошибка регистрации: " + error.message);
      } else {
        // 2. Создаем запись в таблице profiles
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            name: name,
            total_distance_meters: 0,
            total_run_count: 0
          });
        }
        alert("Регистрация успешна! Теперь вы можете войти.");
        setMode("login");
      }
    } else {
      // Вход
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Ошибка входа. Проверьте почту и пароль.");
      } else {
        router.navigate({ to: "/home" });
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-background relative overflow-hidden">
      {/* Фоновое свечение */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <img src="/logo-mark.png" alt="WEIRUN" className="w-20 h-20 mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(200,248,8,0.3)]" />
      <h1 className="text-4xl font-display font-bold uppercase tracking-widest mb-8 relative z-10">WEIRUN</h1>
      
      {/* Переключатель Вход / Регистрация */}
      <div className="flex bg-card border border-border p-1 rounded-xl mb-8 relative z-10 w-full max-w-sm">
        <button 
          onClick={() => setMode("login")}
          className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${mode === "login" ? "bg-primary text-black" : "text-muted hover:text-white"}`}
        >
          Вход
        </button>
        <button 
          onClick={() => setMode("register")}
          className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${mode === "register" ? "bg-primary text-black" : "text-muted hover:text-white"}`}
        >
          Регистрация
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 relative z-10">
        {mode === "register" && (
          <input 
            type="text" 
            placeholder="Ваше имя и фамилия" 
            className="w-full bg-card/80 backdrop-blur-md border border-border rounded-xl px-4 py-4 text-white focus:border-primary outline-none transition-colors"
            value={name} onChange={(e) => setName(e.target.value)} required 
          />
        )}
        
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full bg-card/80 backdrop-blur-md border border-border rounded-xl px-4 py-4 text-white focus:border-primary outline-none transition-colors"
          value={email} onChange={(e) => setEmail(e.target.value)} required 
        />
        
        <input 
          type="password" 
          placeholder="Пароль (минимум 6 символов)" 
          className="w-full bg-card/80 backdrop-blur-md border border-border rounded-xl px-4 py-4 text-white focus:border-primary outline-none transition-colors"
          value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-black font-display font-bold text-xl uppercase tracking-widest py-4 rounded-xl mt-4 shadow-[0_0_20px_rgba(200,248,8,0.3)] hover:brightness-110 active:scale-95 transition-all"
        >
          {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
        </button>
      </form>

      <p className="text-muted text-xs mt-8 text-center max-w-xs relative z-10">
        Продолжая, вы соглашаетесь с условиями использования платформы WEIRUN.
      </p>
    </div>
  );
}
