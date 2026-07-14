# Firebase CMS Setup

This project now uses a custom Firebase-backed admin panel on Vercel.

## Required Server Environment Variables

Add these in Vercel Project Settings.

- `FIREBASE_DATABASE_URL`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `CMS_ADMIN_EMAIL`
- `CMS_ADMIN_PASSWORD`
- `CMS_SESSION_SECRET`

## Firebase Database Structure

Top-level paths used by the CMS:

- `careers`
- `jobCategories`
- `careerPageSettings`
- `downloadableGuides`

## Accessing Admin

1. Open `/admin`
2. Login using `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD`
3. Load and save JSON for each section

## Notes

- The old Netlify/Decap CMS flow has been removed.
- Public pages read content via API routes backed by Firebase.
- If Firebase admin env vars are missing, read APIs fall back to existing local markdown content.