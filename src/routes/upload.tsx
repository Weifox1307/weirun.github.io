import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { parseGPX } from "@/lib/gpx";
import { UploadCloud } from "lucide-react";

export const Route = createFileRoute("/upload")({ component: Upload });

function Upload() {
  const [fileData, setFileData] = useState<{ distanceKm: number, durationMs: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.endsWith('.gpx')) {
        const parsed = parseGPX(text);
        setFileData(parsed);
      } else {
        alert("Пока поддерживаются только .GPX файлы");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!fileData) return;
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // 1. Сохраняем забег
      await supabase.from('runs').insert({
        user_id: user.id,
        distance_km: fileData.distanceKm,
        duration_ms: fileData.durationMs,
        source: 'gpx_upload'
      });
      // 2. Обновляем статистику профиля (Supabase RPC или простой Update)
      // В реальном проекте лучше использовать базу данных (Trigger или RPC)
      
      alert("Тренировка успешно загружена!");
      setFileData(null);
    }
    setLoading(false);
  };

  return (
    <div className="pt-safe px-6 py-8 pb-24">
      <h1 className="text-3xl font-display font-bold uppercase mb-2">Импорт</h1>
      <p className="text-muted mb-8 text-sm">Загрузите GPX файл с часов Garmin, Coros или Apple Watch.</p>

      <label className="border-2 border-dashed border-border rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-card mb-6">
        <UploadCloud className="text-primary mb-4" size={48} />
        <span className="font-bold text-lg mb-1">Выберите .GPX файл</span>
        <span className="text-sm text-muted">или перетащите сюда</span>
        <input type="file" accept=".gpx" className="hidden" onChange={handleFileUpload} />
      </label>

      {fileData && (
        <div className="glass rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
          <h3 className="text-xl font-bold mb-2">Найдена тренировка</h3>
          <p className="font-display text-4xl text-primary font-bold mb-6">{fileData.distanceKm.toFixed(2)} <span className="text-xl">км</span></p>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary text-black font-bold uppercase py-4 rounded-xl hover:brightness-110 active:scale-95"
          >
            {loading ? "Сохранение..." : "Сохранить в профиль"}
          </button>
        </div>
      )}
    </div>
  );
}
