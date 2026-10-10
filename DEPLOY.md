# Putting the website online (free)

## How it works now: GitHub Pages

This site lives in the public repository `kelvsbookkeeping/kelvsbookkeeping.github.io` and is served at **https://kelvsbookkeeping.github.io**.

- `.github/workflows/deploy-pages.yml` builds the site (`npm run build`) and publishes the `dist` folder every time something is pushed to the `main` branch.
- One-time setting: in the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
- The site address is already set to `https://kelvsbookkeeping.github.io` in `src/content/site.ts` and `index.html`.
- The repository is public, so keep private files (PDFs, Word documents, recordings) out of it. `.gitignore` already leaves out `node_modules`, `dist` and `.env` files.

Vercel still works as an alternative: import the same repository at vercel.com and it picks up `vercel.json`. The older Vercel steps below are kept for reference.

---

You need three free things: your **GitHub** account (it keeps a private, safe copy of the site), **GitHub Desktop** (an app that uploads your changes) and **Vercel** (it shows the site to the world). Once this is set up, every change you upload goes live by itself in about a minute.

The folder is already prepared: `vercel.json` tells Vercel how to build the site, and `.gitignore` keeps the bulky and private build folders (`node_modules`, `dist`, `.env` files) out of the upload.

## 1. Put the folder on GitHub (one time)

1. Download and install **GitHub Desktop** from https://desktop.github.com, then sign in with your GitHub account.
2. Choose **File → Add local repository…** and pick this folder:
   `C:\Users\Keanu\OneDrive\Desktop\My Claude\Portfolio\Kelvin Version 2`
   (The folder is already set up for GitHub, so it is accepted straight away.)
3. On the left you will see a long list of changed files. That is all your work so far. At the bottom left, type a summary such as `My portfolio` and click **Commit to main**.
4. Click **Publish repository** at the top. Give it a name, for example `kelvin-portfolio`, keep **Keep this code private** ticked, and click **Publish repository**.

Your whole folder is now backed up privately on GitHub. Only you can see it. It includes your videos, PDFs and Word guides, but none of those appear on the website unless the site already uses them.

## 2. Put the site online with Vercel (one time)

1. Go to https://vercel.com and choose **Sign Up → Continue with GitHub**. Pick the free **Hobby** plan.
2. Click **Add New… → Project**.
3. Find `kelvin-portfolio` in the list and click **Import**. If it is not listed, click **Adjust GitHub App Permissions** and allow Vercel to see that repository.
4. Vercel fills in the settings from `vercel.json`. Check that they say:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. When it finishes, you get a free address such as `kelvin-portfolio.vercel.app`. That is your live website.

## 3. Tell the site its own address (one time)

The site's links for Google and for previews on LinkedIn and Facebook still say `https://example.com`. Once you have your Vercel address, replace it in two files:

- `src/content/site.ts`: the line `url: 'https://example.com',`
- `index.html`: three lines that contain `https://example.com/`

Or just send Claude the address and ask for it to be done. Then upload the change as in step 4.

## 4. Updating the site later

1. Change anything in the folder: edit it yourself, or ask Claude.
2. Open GitHub Desktop. The changed files are listed on the left.
3. Type a short summary, for example `New case study`, then click **Commit to main**.
4. Click **Push origin**.

Vercel notices the upload, rebuilds the site and puts the new version live, usually within a minute or two. If a build ever fails, the old version stays online. Nothing breaks, and Vercel emails you the reason.

## Never losing your work

- Every commit is a saved version on GitHub. In GitHub Desktop, the **History** tab shows each one, and you can undo any of them (right-click → **Revert changes in commit**).
- If your computer is lost, install GitHub Desktop on a new one and choose **File → Clone repository** to get everything back.
- In Vercel, the **Deployments** page lists every version that was ever live. On an older one, click **⋯ → Promote to Production** to bring it back instantly.

## To preview on your own computer first

Open a terminal in the folder and run `npm run dev`, then open http://localhost:5190.
