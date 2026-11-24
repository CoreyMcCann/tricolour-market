# tricolour-market
CISC 497 position video: subscription cancellation, interactive demonstrations, and production resources.

Tricolour Market is a fictional campus marketplace for a student position video. The site runs on plain HTML, CSS and JavaScript. It uses simulated data and transactions.

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) and select a demo. Use the demo toolbar to restart, switch demos, jump to a named scene, toggle annotations, or enter Clean view. Press Escape or use **Show demo controls** to exit Clean view. Each demo has its own state within the tab. A direct link opens a named scene, such as `#obstructive/offer` or `#direct/confirm`. A completion link opened directly shows a simulated outcome for that scene.

Edit the `plan` object in `app.js` to update the fictional customer, price or billing dates. Keep the access end date before renewal, and the reminder date before the scheduled charge.

## GitHub Pages

When ready to publish, commit and push the reviewed files to `main`. In the GitHub repository, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, and save. All site links use relative paths or hash navigation. The project site will be under `/tricolour-market/` on the account’s GitHub Pages domain.

See [references.md](./references.md) for research and [ai-disclosure.md](./ai-disclosure.md) for the working disclosure log. Both are also available from the demo hub.
