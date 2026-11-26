# Reflow Press

Animates any website between Desktop, Tablet and Phone widths with eased motion, so you can show how its text, images and hyphenation reflow. The site is the real site, laid out by the browser at every frame.

## Run it

**On Vercel:** import this folder as a new project (or run `vercel` inside it). No build step and no settings needed. `api/proxy.js` deploys as a serverless function.

**On your Mac:** `node dev-server.js`, then open http://localhost:3000.

## What's in it

- `index.html` is the whole app.
- `api/proxy.js` fetches the site you paste and serves it from the app's own address. That lets the app read the site's fonts and breakpoints, apply your font uploads and change hyphenation.
- `dev-server.js` runs the same thing locally.

## Using it

- **Site:** paste an address and press Load. The address shows in plain text at the top of the frame. You can switch it off.
- **Fonts:** lists every font the site uses and says whether it loaded. Upload a licensed .woff2/.woff/.ttf/.otf file to fill in a missing font or replace one. Uploads stay in your browser and are never sent anywhere.
- **States, Motion, Easing:** set the sizes, the order, the timings and the easing curve.
- **Typography:** keep the site's own hyphenation, or force it on or off. "Balance line lengths" evens out the lines.
- **Export .mp4:** in Chrome or Edge, choose "This tab" when asked. The panels hide, one pass of the animation is recorded and the .mp4 downloads. For a sharper video, make the browser window larger first. Browsers that can't record .mp4 save .webm instead.
- Keys: Space plays and pauses, 1 2 3 jump to a state, Esc leaves Present.

## Notes

- Sites that need a login, or that block automated requests, may not load through the proxy.
- The proxy refuses local and private network addresses. Set `ALLOW_PRIVATE=1` when you run the dev server to test against a local site.
