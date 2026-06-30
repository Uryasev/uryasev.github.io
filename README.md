# stanuryasev.github.io — Stan Uryasev's website

The personal/academic website of **Prof. Stan Uryasev** (Applied Mathematics and
Statistics, Stony Brook University), being migrated from WordPress to GitHub Pages.

It is **plain HTML + CSS** (no build step). Because the repository is named
`stanuryasev.github.io`, GitHub Pages serves it at the **root** of the account:

```
https://stanuryasev.github.io/
```

## Structure

```
stanuryasev.github.io/
├── index.html                  → Home (Research)
├── publications/index.html     → Publications        (placeholder)
├── qf-summary/index.html       → QF Summary          (placeholder)
├── courses/index.html          → Courses             (placeholder)
├── conferences/
│   ├── index.html              → Conferences & Seminars (listing)
│   └── uryasev70/              → Uryasev70 conference (full site)
│       ├── index.html          → Conference home
│       ├── program/            → Schedule & speakers (TBA)
│       ├── registration/       → Registration (embed a Google Form)
│       ├── directions/         → Venue, map, hotel, contacts
│       ├── flyer/              → Downloadable promo materials
│       └── assets/            → Conference banner / favicon / sponsor logo
├── assets/
│   ├── main.css                → Site-wide stylesheet (theme colors at top)
│   ├── banner.jpg              → Shared banner (placeholder — replace)
│   ├── favicon.png             → Browser tab icon
│   └── sponsor-ams.png         → Sponsor logo (placeholder — replace)
└── .nojekyll                   → Serve files as-is (no Jekyll processing)
```

### Two levels of navigation
- **Site header** (`.site-header` in every page): Research / Publications / QF Summary /
  Courses / Conferences & Seminars — links use absolute paths (`/`, `/publications/`, …).
- **Conference nav** (inside `conferences/uryasev70/`): Home / Registration / Program /
  Directions / Flyer.

All pages share `/assets/main.css`, so editing it re-themes the whole site at once.

## Publishing to GitHub Pages

1. Create a GitHub account (or organization) named **`uryasev`**.
2. Create a repository named **exactly** `stanuryasev.github.io`.
3. Push the contents of this folder to the default branch (e.g. `main`), keeping
   `index.html` at the repo root.
4. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
5. The site goes live at `https://stanuryasev.github.io/` within a minute or two.

To use a custom domain later (e.g. a stonybrook.edu subdomain), add a `CNAME` file with the
domain and configure DNS, then set it under Settings → Pages.

## Customizing

- **Theme:** edit the color/font variables documented at the top of `assets/main.css`.
- **Banner & logos:** replace the placeholders in `assets/` (and
  `conferences/uryasev70/assets/`), keeping the same filenames.
- **Sections:** fill in `publications/`, `qf-summary/`, `courses/` as migration proceeds.
- **Conference:** see comments in the `conferences/uryasev70/` pages for where to add the
  Google Form (registration), the program, and the flyer PDF.

## Local preview

```bash
cd stanuryasev.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

## Note on the full migration

The current WordPress site has ~20 GB of uploads. GitHub repositories are not meant to hold
that much binary data (soft limits around 1–5 GB). Large files (PDFs, datasets, media)
should be hosted externally (university storage, S3/CDN, or Git LFS for moderate sizes) and
linked from these pages, rather than committed directly to this repo.
