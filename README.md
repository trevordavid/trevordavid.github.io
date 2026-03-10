# Minimalist Portfolio

A clean, minimalist personal portfolio site inspired by [p.cv](https://p.cv).

## Features

- Simple, typography-focused design with monospace font
- Multiple theme options with theme toggle
- Mobile-responsive layout with device-specific elements
- Email copy to clipboard functionality
- Clean link styling with external indicators
- Collapsible "PRESS" section with modular data management

## Customization

To customize this site for your own use:

1. Edit the `main.js` file's `siteConfig` object:
   ```javascript
   const siteConfig = {
       name: "Your Name",
       emailUser: "your.email",
       emailDomain: "example.com"
   };
   ```

2. Update the link URLs in the click handler functions at the bottom of `main.js`.

3. Modify the experience and social links text in `index.html` if needed.

4. See `PRESS-README.md` for instructions on managing press links.

## Theme Options

The site includes 7 different theme options that users can toggle through:
- Light (white)
- Light gray
- Beige/Brown
- Mint/Green
- Lavender/Blue
- Dark (black)
- Dark gray

## Hosting

You can host this site on:
- GitHub Pages
- Netlify
- Vercel
- Any static web hosting service

## Analytics

- Plausible Cloud is wired in via the script tag in `index.html`.
- The tracked production domain is `trevorjdavid.com`.
- DNS stays managed in Squarespace; no DNS change is required for the default Plausible integration because events are sent from the browser.
- Before relying on the dashboard, create the `trevorjdavid.com` site in Plausible Cloud so incoming events are accepted.
- The site tracks pageviews automatically plus these custom events:
  - `Outbound Click` for external links
  - `Contact Copy` for the desktop email copy action
  - `Contact Email` for the mobile `mailto:` action
- Direct traffic to `trevordavid.github.io` is intentionally out of scope for this setup unless that hostname is separately tracked or redirected.

## Development

- Run `npm install` to install lint tooling.
- Run `npm run lint` for full local checks.
- Run `npm test` for full local validation.
- Enable pre-commit hooks for staged file checks:

  ```sh
  git config core.hooksPath .githooks
  ```

## License

MIT
