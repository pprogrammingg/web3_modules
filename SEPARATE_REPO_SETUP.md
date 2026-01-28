# Setting Up Courses in Separate Repo

## Moving to Separate Repo

1. **Copy the courses folder** to your new repo
2. **Update `hyperscale-config.json`** with the hyperscale-rs repo URL
3. **Deploy as static site** (GitHub Pages, Netlify, Vercel, etc.)

## Creating Hyperscale-rs Modules

When courses are in a separate repo, here's how to create hyperscale-rs-specific content:

### Method 1: GitHub URL (Recommended)

Just provide the GitHub URL when asking for a module:

```
Create a module on "BFT Implementation" for hyperscale-rs.
Repo: https://github.com/flightofthefox/hyperscale-rs
Focus: crates/bft/src/state.rs
```

I can:
- ✅ Read files directly from GitHub
- ✅ Understand the codebase structure
- ✅ Reference specific files and lines
- ✅ Create accurate content

### Method 2: Update Config

Update `hyperscale-config.json` with:
- Current repo URL
- Branch name (if not main)
- Specific file paths

Then reference it: "Use hyperscale-config.json to create module X"

### Method 3: Local Path

If you have both repos locally:
```
Courses repo: /path/to/courses-repo
Hyperscale repo: /path/to/hyperscale-rs

Create module using hyperscale-rs at /path/to/hyperscale-rs
```

## What Works Best

**GitHub URL is easiest** - I can read:
- Markdown files (guides)
- Rust source files
- Directory structure
- README files

Just say: "Create module X for hyperscale-rs at https://github.com/..."

## Example Workflow

1. You: "Create intermediate module on BFT consensus for hyperscale-rs"
2. You: "Repo: https://github.com/flightofthefox/hyperscale-rs"
3. Me: Reads the repo, creates module with real code examples
4. Done!

The config file is just a reference - the GitHub URL is what I actually use.