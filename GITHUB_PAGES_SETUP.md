# GitHub Pages Deployment Guide

After pushing your repository to GitHub, follow these steps to deploy it as a live website:

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/pprogrammingg/web3_modules`
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `main` (or `master` if that's your default branch)
   - **Folder**: `/ (root)`
5. Click **Save**

## Step 2: Wait for Deployment

- GitHub will build and deploy your site (usually takes 1-2 minutes)
- You'll see a green checkmark when it's ready
- Your site will be available at: `https://pprogrammingg.github.io/web3_modules/`

## Step 3: Verify Everything Works

1. Visit your site URL
2. Test navigation between modules
3. Check that all CSS and JavaScript loads correctly
4. Verify module links work

## Important Notes

✅ **Your paths are already correct!** All paths in your HTML files use relative paths (like `../../shared/styles.css`), which work perfectly on GitHub Pages.

✅ **No build step needed** - Your site is pure HTML/CSS/JS, so GitHub Pages will serve it directly.

✅ **Custom domain (optional)**: If you want to use a custom domain later, you can add a `CNAME` file in the root directory with your domain name.

## Troubleshooting

- If styles don't load: Check browser console for 404 errors
- If modules don't appear: Verify `course-data.js` paths are correct
- If site shows 404: Make sure you selected the correct branch and folder in Pages settings

## Updating the Site

Every time you push changes to the `main` branch, GitHub Pages will automatically rebuild and deploy your site within 1-2 minutes. No manual action needed!
