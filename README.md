# Likang Li - Academic Homepage

This repository hosts my academic homepage, a lightweight static site for sharing work on statistical post-training methods for large language models and open-source statistical software in R.

## Highlights

- Typography-first design with light/dark themes suited for long-form reading
- Concise sections for biography, research focus, publications, teaching, and software
- Mobile-friendly layout with accessible navigation and quick links (Email / GitHub / Zhihu)
- Service worker for basic offline support and faster repeat visits

## Research Focus

1. **Statistical post-training for large language models** - algorithms that adapt LLMs while preserving statistical guarantees.
2. **R packages for classical statistical methods** - maintaining reproducible software that implements established statistical procedures.

## Quick Start

```bash
# clone the repository
git clone https://github.com/likangmax/likangmax.github.io
cd likangmax.github.io

# optional: serve locally (requires Node.js)
npx serve .
```

Open `index.html` in a browser (or use the local server) to preview changes.

## Customisation Guide

- **Content**: edit `index.html` for biography, research areas, publications, teaching, software, and contact information.
- **Styles**: adjust typography, colours, and spacing in `css/style.css`.
- **Scripts**: client-side behaviour (theme switching, smooth scrolling, service worker registration) lives in `js/main.js` and `sw.js`.
- **Assets**: update profile photos in `pic/`, blog posts in `blog/`, and supporting documents in `doc/` or `software/`.

## Deployment

The site is served via GitHub Pages from the `main` branch. Push changes to publish automatically:

```bash
git add .
git commit -m "Update homepage"
git push origin main
```

## Structure

```
likangmax.github.io/
|- index.html            # homepage
|- css/style.css         # global styles
|- js/main.js            # interactive behaviour
|- sw.js                 # service worker
|- blog/                 # blog posts
|- doc/                  # documents (e.g., CV)
|- pic/                  # imagery assets
|- software/             # software project pages
```

## Technology Stack

- HTML5 plus Bootstrap 4 utility classes
- CSS custom properties with flex and grid layout
- Vanilla JavaScript with Intersection Observer
- Font Awesome 5 for iconography
- Service Worker API for caching

## Contact

- Email: lilikang@uic.edu.cn
- GitHub: [@likangmax](https://github.com/likangmax)
- Zhihu: [likang_li](https://www.zhihu.com/people/likang_li)

## License

MIT License

---

如果你也想基于这个仓库搭建个人主页，可以参考上面的结构说明，修改内容后推送到 GitHub Pages 即可。
