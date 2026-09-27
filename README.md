# 🚀 Daily Spark

**Jordan's first program.** A tiny web app that shows you a fresh *spark* — an
inspiring idea paired with a matching image — every single time you load the page.
Reload, get a new one. That's the magic.

Built with **Flask** (Python) and packaged with **Docker**. It also ships a bonus
standalone page: a scrollytelling product page for the **KuKirin G2** electric
scooter with a rotating photo gallery.

## What's inside

| File / folder | What it is |
|---|---|
| `app.py` | The Flask app. Each visit to `/` picks a random spark (never repeating the last one) and renders it. |
| `sparks.py` | The list of sparks — each is an `idea`, a `tag`, and an `image`. |
| `templates/index.html` | The page template. |
| `static/style.css` | The styling. |
| `static/images/` | The spark pictures (`spark-01.png` … `spark-06.png`). |
| `Dockerfile` | Packages the app into a small Python container. |
| `docker-compose.yml` | Runs both apps with one command. |
| `scooter/` | The standalone KuKirin G2 page (own `index.html`, `style.css`, `script.js`, `images/`). |

## How to run

### With Docker (one command)

```bash
docker compose up --build
```

Then open:

- **Daily Spark** → http://localhost:8000
- **KuKirin G2 page** → http://localhost:8001

Stop everything: `docker compose down`

### Without Docker (Daily Spark only)

```bash
pip install -r requirements.txt
python app.py
```

Then open **Daily Spark** → http://localhost:5000

> The `scooter/` page is plain HTML/CSS/JS — just open `scooter/index.html` in a
> browser, or let Docker serve it on port 8001.

## Add your own spark

1. Drop a matching image into `static/images/` (e.g. `spark-07.png`).
2. Add an entry to the `SPARKS` list in `sparks.py` pointing at that image.
3. Reload — it shows up.

## The KuKirin G2 page

A self-contained scrollytelling page: seven full-screen slides that reveal the
image first, then the text. The cover holds a **rotating gallery of six photos**
(`scooter/images/scooter-1.jpg` … `scooter-6.jpg`) — swap in your own shots any
time. See `scooter/images/README.txt`.

---
Built by Jordan.