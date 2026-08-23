# WEIRUN — лендинг

Статический сайт для GitHub Pages. После публикации люди открывают ссылку вида:

`https://ТВОЙ-ЛОГИН.github.io/weirun/`

## Как выложить (через сайт GitHub, без терминала)

1. На [github.com/new](https://github.com/new) создай **публичный** репозиторий. Имя: `weirun`.
2. Скачай и распакуй архив `WEIRUN-github-pages.zip`.
3. В репозитории: **Add file → Upload files**. Залей **содержимое** папки (чтобы `index.html` лежал в корне репо, не внутри ещё одной папки).
4. Commit.
5. **Settings → Pages → Build and deployment**: Source = **Deploy from a branch**, Branch = `main`, Folder = `/ (root)`. Save.
6. Через 1–2 минуты сайт будет здесь: `https://ТВОЙ-ЛОГИН.github.io/weirun/`

Если репозиторий назвать `ТВОЙ-ЛОГИН.github.io`, адрес будет короче: `https://ТВОЙ-ЛОГИН.github.io/`

## APK

Положи файл `weirun.apk` в корень репозитория рядом с `index.html`. Кнопка «Скачать» начнёт отдавать его сама.

Дата релиза в отсчёте: 15 сентября 2026, 12:00 МСК. Меняется в `app.js` (`LAUNCH_AT`).
