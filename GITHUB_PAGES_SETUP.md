# GitHub Pages Deployment Guide

After pushing your repository to GitHub, follow these steps to deploy it as a live website:

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/pprogrammingg/web3_modules`
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, you'll see two options:
   - **"Deploy from a branch"** - Try this first (simpler for static HTML sites)
   - **"GitHub Actions"** - Use this if branch deployment doesn't work (workflow file is already set up)
5. If using "Deploy from a branch", configure:
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Folder**: `/ (root)`
6. Click **Save**

**Note**: If you don't see a green checkmark after a few minutes, switch to "GitHub Actions" - a workflow file is already configured for you.

## Step 2: Wait for Deployment

- GitHub will build and deploy your site (usually takes 1-2 minutes)
- **Where to check status**: 
  - Go to **Settings > Pages** in your repository
  - You'll see a green checkmark ✓ next to "Your site is live at..." when deployment is complete
  - Or check the **Actions** tab at the top of your repository - look for a workflow run with a green checkmark
- Your site will be available at: `https://pprogrammingg.github.io/web3_modules/`

## Step 3: Verify Everything Works

1. Visit your site URL
2. Test navigation between modules
3. Check that all CSS and JavaScript loads correctly
4. Verify module links work

## Important Notes

✅ **Your paths are already correct!** All paths in your HTML files use relative paths (like `../../shared/styles.css`), which work perfectly on GitHub Pages.

✅ **No build step needed** - Your site is pure HTML/CSS/JS, so GitHub Pages will serve it directly.

✅ **Custom domain (optional)**: If you want to use a custom domain later, you need:
   - A **real purchased domain** (e.g., `web3uni.com`, `web3uni.io`)
   - DNS records configured to point to GitHub
   - A `CNAME` file with the full domain name (not just a subdomain)

## Troubleshooting

- **No green checkmark / Site not deploying**:
  1. **Check if you've committed and pushed** - GitHub Pages only deploys committed code
  2. **Try using GitHub Actions instead**:
     - Go to Settings > Pages
     - Change Source from "Deploy from a branch" to **"GitHub Actions"**
     - A workflow file (`.github/workflows/pages.yml`) has been created for you
     - After switching, push any pending changes and check the Actions tab
  3. **Check the Actions tab** - Look for any failed workflow runs and error messages
  4. **Wait a few minutes** - Sometimes deployment takes 3-5 minutes on first setup

- **Custom domain error**: If you see "custom domain is not properly formatted":
  - Remove any custom domain from Settings > Pages (leave it blank)
  - Use the default GitHub Pages URL: `https://pprogrammingg.github.io/web3_modules/`
  - Custom domains must be fully qualified (e.g., `web3uni.com`, not just `web3uni`)

- **Symbolic links warning**: If GitHub says you need GitHub Actions:
  - The repository now includes a `.nojekyll` file and a GitHub Actions workflow
  - Switch to "GitHub Actions" as the source in Settings > Pages
  - The workflow will deploy your site automatically

- If styles don't load: Check browser console for 404 errors
- If modules don't appear: Verify `course-data.js` paths are correct
- If site shows 404: Make sure you selected the correct branch and folder in Pages settings

## Updating the Site

Every time you push changes to the `main` branch, GitHub Pages will automatically rebuild and deploy your site within 1-2 minutes. No manual action needed!
