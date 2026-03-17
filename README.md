# Trevor David Site

Static personal site built with plain HTML, CSS, and JavaScript.

## Local Preview

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Main Files

- `index.html`: page structure
- `css/pcv.css`: site styling and the 3 color themes
- `js/main.js`: theme toggle, accordions, and general page behavior
- `js/press-data.js`: press entries
- `js/publications-data.js`: publications and research highlights

## Checks

```sh
npm install
npm test
```

## Notes

- The underscore at the bottom cycles through the 3 themes.
- Press and publication content is data-driven from the JS files above.
- The site can be hosted as a static site on GitHub Pages or any equivalent host.
