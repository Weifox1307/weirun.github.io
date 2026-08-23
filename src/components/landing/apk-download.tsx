import { toast } from "sonner";
import { SITE } from "@/lib/site";

export async function downloadApk() {
  try {
    const res = await fetch(SITE.apkUrl, { method: "HEAD" });
    if (!res.ok) {
      toast.message("APK появится в день релиза", {
        description: "А пока следи за обратным отсчётом — файл подключится сюда же.",
      });
      return;
    }
    const link = document.createElement("a");
    link.href = SITE.apkUrl;
    link.download = SITE.apkFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch {
    toast.message("APK появится в день релиза", {
      description: "Не удалось скачать файл. Попробуй ещё раз позже.",
    });
  }
}
