# Vercel Web Analytics Setup Guide

This guide documents the Vercel Web Analytics implementation for the **Code of Meridaeia** project.

## Overview

Vercel Web Analytics provides insights into your website's visitor behavior and performance metrics. For this vanilla HTML/JavaScript game project, we use the plain HTML implementation which requires no additional package installation.

## Implementation Details

### Prerequisites

- A Vercel account ([Sign up for free](https://vercel.com/signup))
- A Vercel project ([Create a new project](https://vercel.com/new))
- The Vercel CLI installed (optional, for local development):
  ```bash
  npm install -g vercel
  # or
  pnpm add -g vercel
  # or
  yarn global add vercel
  # or
  bun add -g vercel
  ```

### Enable Web Analytics in Vercel Dashboard

1. Navigate to the [Vercel Dashboard](/dashboard)
2. Select your **Code of Meridaeia** project
3. Click the **Analytics** tab
4. Click **Enable** in the dialog

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

### Implementation for Plain HTML

Since **Code of Meridaeia** uses vanilla HTML/JavaScript (no framework), we use the plain HTML implementation.

#### Added to `index.html`

The following scripts have been added to the `<head>` section of `index.html`:

```html
<!-- Vercel Web Analytics -->
<script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

This implementation:
- ✅ Requires no additional packages
- ✅ Works with vanilla JavaScript
- ✅ Tracks page views automatically
- ❌ Does not support route-level tracking (by design for plain HTML)

### Deployment

Deploy your app to Vercel using one of these methods:

**Using Vercel CLI:**
```bash
vercel deploy
```

**Using Git:**
We recommend [connecting your project's Git repository](/docs/git#deploying-a-git-repository), which enables automatic deployment of your latest commits to main.

### Verification

Once deployed, verify the analytics setup:

1. Visit your deployed site
2. Open your browser's **Network** tab (F12 → Network)
3. Look for a **Fetch/XHR** request to `/_vercel/insights/view`
4. This confirms analytics data is being collected

### Viewing Your Data

After deployment and once users have visited your site:

1. Go to your [Vercel Dashboard](/dashboard)
2. Select your **Code of Meridaeia** project
3. Click the **Analytics** tab
4. View visitor counts, page views, and device information

> **⏰ Note:** It may take a few minutes for data to appear in the dashboard after your first visit.

## Technical Notes

### What Gets Tracked

The Vercel Web Analytics automatically collects:
- Unique visitors
- Page views
- Referrers
- Device types and operating systems
- Geographic location (country-level)
- Browser information

### Privacy

Vercel Web Analytics is designed with privacy in mind:
- No personal data is collected
- No cookies are used for tracking
- Fully GDPR compliant
- No user consent required

For more details, see [Privacy and Compliance Standards](/docs/analytics/privacy-policy).

## Next Steps

Now that Vercel Web Analytics is set up:

1. **Deploy to Vercel** - Get your app live
2. **Monitor traffic** - Watch for your first visitors
3. **Analyze data** - Explore the Analytics dashboard after a few days
4. **Scale your insights** - Users on Pro/Enterprise plans can add [custom events](/docs/analytics/custom-events)

## Troubleshooting

### Analytics not showing data

**Problem:** No visitors are showing in the dashboard.

**Solution:**
- Ensure you've enabled Web Analytics in the Vercel dashboard
- Verify the app is deployed to Vercel (not localhost)
- Wait a few minutes for data to sync
- Check that the script tag is present in your deployed HTML

### Script errors in console

**Problem:** JavaScript errors in the browser console.

**Solution:**
- The Vercel analytics script is designed to fail silently
- Errors should not affect your application
- Check browser console for actual issues unrelated to `/_vercel/insights/`

### Mixed content warning

**Problem:** "Mixed Content: The page was loaded over HTTPS, but requested an insecure resource"

**Solution:**
- Ensure your Vercel deployment uses HTTPS
- The script should auto-upgrade to HTTPS
- Vercel provides free HTTPS for all deployments

## Additional Resources

- [Vercel Analytics Package Documentation](/docs/analytics/package)
- [Custom Events](/docs/analytics/custom-events)
- [Filtering Data](/docs/analytics/filtering)
- [Analytics Pricing & Limits](/docs/analytics/limits-and-pricing)
- [Full Troubleshooting Guide](/docs/analytics/troubleshooting)

## References

- **File Modified:** `index.html`
- **Implementation Type:** Plain HTML
- **Package Required:** None
- **Route Support:** No (limitation of plain HTML implementation)
- **Date Implemented:** December 2025

---

**For more information**, visit the official [Vercel Analytics Documentation](https://vercel.com/docs/analytics).
