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

- Cloudflare Web Analytics is wired in via the beacon script tag in `index.html`.
- The tracked production domain is `trevorjdavid.com`.
- Cloudflare Web Analytics now assumes Cloudflare is also the public edge for the site so HTTPS redirects and security headers can be enforced outside GitHub Pages.
- This setup is page analytics only; it does not track the Plausible custom events that were previously added.
- Direct traffic to `trevordavid.github.io` is intentionally out of scope for this setup unless that hostname is separately tracked or redirected.

## Security Hardening

- The repo now adds a CSP meta tag, a referrer policy meta tag, explicit `rel="noopener noreferrer"` on external links, and DOM-safe press item rendering.
- CI now uses `npm ci` with a committed lockfile and job-scoped GitHub Actions permissions.
- The remaining high-severity protections must be configured in GitHub Pages and Cloudflare, not in this repo:
  - keep `trevorjdavid.com` configured as the GitHub Pages custom domain
  - enable GitHub Pages `Enforce HTTPS`
  - move DNS to Cloudflare and proxy the GitHub Pages origin
  - enable `Always Use HTTPS` in Cloudflare
  - redirect `http://trevorjdavid.com`, `http://www.trevorjdavid.com`, and `https://www.trevorjdavid.com` to `https://trevorjdavid.com/`
  - add edge headers in Cloudflare for HSTS, CSP, `X-Content-Type-Options`, `Permissions-Policy`, and frame protection

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
