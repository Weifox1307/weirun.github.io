import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const [message, setMessage] = useState("");
  
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && message) {
      await supabase.from('messages').insert({ user_id: user.id, message });
      alert("Сообщение отправлено тренеру!");
      setMessage("");
    }
  };

  return (
    <div className="pt-safe px-6 py-8 pb-24">
      <h1 className="text-3xl font-display font-bold uppercase mb-2">Связь с тренером</h1>
      <p className="text-muted mb-8 text-sm">Задайте вопрос по плану тренировок.</p>

      <form onSubmit={handleSend} className="space-y-4">
        <textarea 
          placeholder="Напишите сообщение..." 
          rows={6}
          className="w-full bg-card border border-border rounded-2xl p-4 text-white focus:border-primary outline-none resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="w-full bg-card border border-primary text-primary font-bold uppercase py-4 rounded-xl hover:bg-primary hover:text-black transition-colors"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
