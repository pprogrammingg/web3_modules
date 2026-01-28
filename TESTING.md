# Testing

## Quick Test

```bash
node verify-paths.js
```

Checks:
- ✅ Shared files exist
- ✅ CSS/JS paths correct
- ✅ Module structure valid

## Browser Test

Open `test-modules.html` - runs interactive tests.

## Common Issues

**CSS not loading?** Check path in `<link>` tag:
- Basic: `../../shared/styles.css`
- Hyperscale-rs: `../shared/styles.css`

**JS not loading?** Check browser console for 404 errors.

**File protocol issues?** Use a local server:
```bash
python3 -m http.server 8000
# Then: http://localhost:8000/index.html
```