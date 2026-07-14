# Netlify CMS Authentication Setup Guide

## Deprecated For This Repo
This repository now supports production CMS on Vercel through GitHub OAuth.

Use [VERCEL_CMS_SETUP.md](/run/media/rahul/New%20Volume/atek-it-landing-master/VERCEL_CMS_SETUP.md#L1) for the current production setup.

## 🎯 Overview
This guide will help you set up user authentication for the Netlify CMS admin panel on your deployed Netlify site.

## Important
The current Astro project is configured to deploy on Vercel via [astro.config.mjs](/run/media/rahul/New Volume/atek-it-landing-master/astro.config.mjs#L1), but the CMS backend in [public/admin/config.yml](/run/media/rahul/New Volume/atek-it-landing-master/public/admin/config.yml#L1) uses `git-gateway`.

`git-gateway` only works when the `/admin` route is served by Netlify with both Identity and Git Gateway enabled. If `https://atektechnologies.in/admin/` is serving from Vercel, you will get the error: "Unable to access identity settings."

To get a working admin panel, use one of these paths:
1. Deploy the site or at least `/admin` on Netlify and keep the current `git-gateway` backend.
2. Keep hosting on Vercel and replace `git-gateway` with a different CMS backend such as GitHub OAuth.

**Site URL**: https://atektechnologies.in  
**Admin Panel**: https://atektechnologies.in/admin/  
**Admin Email**: atekit.inc@gmail.com  
**Admin Password**: Atekit@999

---

## 📋 Prerequisites
- Netlify account with access to the site
- GitHub repository connected to Netlify
- Site deployed on Netlify

---

## 🔐 Step-by-Step Setup Instructions

### Step 1: Enable Netlify Identity

Before doing this, confirm that the admin URL you are opening is actually being served by Netlify. If the response headers show `server: Vercel`, Netlify Identity settings on their own will not fix the admin login on that domain.

1. **Access Netlify Dashboard**:
   - Go to https://app.netlify.com/
   - Log in to your Netlify account
   - Select your site: **atek-it-landingpage**

2. **Enable Identity Service**:
   - Click on **"Identity"** in the top navigation menu
   - Click the **"Enable Identity"** button
   - Wait for the service to activate (takes a few seconds)

### Step 2: Configure Identity Settings

1. **Set Registration to Invite Only**:
   - In the Identity tab, click **"Settings and usage"**
   - Under **"Registration preferences"**, select **"Invite only"**
   - Click **"Save"**
   - This prevents unauthorized users from creating accounts

2. **Configure Email Templates (Optional)**:
   - Under **"Emails"** section, you can customize:
     - Invitation email template
     - Confirmation email template
     - Password recovery email template

### Step 3: Enable Git Gateway

1. **Activate Git Gateway**:
   - Scroll down to the **"Services"** section in Identity settings
   - Find **"Git Gateway"**
   - Click **"Enable Git Gateway"**
   - This allows Netlify CMS to commit changes directly to your GitHub repository

2. **Verify Git Gateway Settings**:
   - Ensure it shows as "Enabled"
   - It should automatically connect to your GitHub repository

### Step 4: Invite the Admin User

1. **Send Invitation**:
   - Go back to the **"Identity"** tab (main view)
   - Click the **"Invite users"** button
   - Enter email: **atekit.inc@gmail.com**
   - Click **"Send"** or **"Invite"**

2. **Check Email**:
   - An invitation email will be sent to **atekit.inc@gmail.com**
   - Check the inbox (and spam folder if needed)
   - The email will contain a confirmation link

3. **Complete User Setup**:
   - Click the confirmation link in the email
   - You'll be redirected to: https://atektechnologies.in
   - A modal/popup will appear asking you to set a password
   - Enter password: **Atekit@999**
   - Confirm the password
   - Click **"Sign up"** or **"Complete signup"**

### Step 5: Assign Admin Role (Optional but Recommended)

1. **Set User Role**:
   - In Netlify Dashboard → Identity tab
   - Find the user **atekit.inc@gmail.com**
   - Click on the user
   - Under **"Roles"**, add role: **admin**
   - Click **"Save"**

### Step 6: Deploy Updated Configuration

The configuration files have been updated with the correct settings:
- ✅ Backend branch changed from `main` to `master`
- ✅ Site URL updated to `https://atektechnologies.in`
- ✅ Local backend disabled for production

**You need to commit and push these changes:**

```bash
git add .
git commit -m "Configure Netlify CMS for production with correct branch and site URL"
git push origin master
```

Netlify will automatically deploy the changes.

### Step 7: Test the Admin Panel

1. **Access Admin Panel**:
   - If the domain is hosted on Netlify, go to https://atektechnologies.in/admin/
   - If the domain is still hosted on Vercel, use your Netlify site URL instead, for example `https://your-site-name.netlify.app/admin/`
   - You should see the Netlify CMS login screen

2. **Log In**:
   - Enter email: **atekit.inc@gmail.com**
   - Enter password: **Atekit@999**
   - Click **"Log in"**

3. **Verify Access**:
   - You should see the CMS dashboard
   - You can now edit:
     - Careers
     - Job Categories
     - Guides
     - Career Page Settings

---

## 🔄 Switching Between Local and Production

### For Local Development:
1. Open `public/admin/config.yml`
2. Uncomment line 34: `local_backend: true`
3. Run both servers:
   ```bash
   # Terminal 1: Astro dev server
   npm run dev
   
   # Terminal 2: Netlify CMS proxy server
   npx netlify-cms-proxy-server
   ```
4. Access: http://localhost:4321/admin/index.html
5. No authentication required locally

### For Production Deployment:
1. Open `public/admin/config.yml`
2. Comment out line 34: `# local_backend: true`
3. Commit and push changes
4. Access: https://atektechnologies.in/admin/
5. Log in with Netlify Identity credentials

---

## 🛠️ Troubleshooting

### Issue: "Failed to load config.yml"
- **Solution**: Clear browser cache and reload
- Check that the site is deployed with the latest config

### Issue: "Login button doesn't appear"
- **Solution**: Ensure Netlify Identity is enabled in Netlify Dashboard
- Verify Git Gateway is enabled

### Issue: "Unable to access identity settings"
- **Cause**: The site is being served by Vercel or another host that does not expose `/.netlify/identity/*`
- **Solution**: Open the admin panel on a Netlify-hosted domain, or migrate the CMS backend away from `git-gateway`

### Issue: "Cannot save changes"
- **Solution**: Check that Git Gateway is enabled
- Verify the user has the correct role (admin or editor)
- Check GitHub repository permissions

### Issue: CORS errors in production
- **Solution**: This shouldn't happen in production
- Verify the site URL in config.yml matches your Netlify site URL

### Issue: User invitation email not received
- **Solution**: Check spam folder
- Resend invitation from Netlify Dashboard
- Verify email address is correct

---

## 📝 Important Notes

1. **Security**:
   - Keep your password secure
   - Use "Invite only" registration to prevent unauthorized access
   - Regularly review user access in Netlify Identity

2. **Content Workflow**:
   - The CMS uses "Editorial Workflow" mode
   - Changes go through: Draft → In Review → Ready
   - Published changes are committed to GitHub

3. **Backup**:
   - All content is stored in your GitHub repository
   - Every CMS change creates a Git commit
   - You can always revert changes through Git

4. **Multiple Users**:
   - To add more users, repeat Step 4 with different email addresses
   - Assign appropriate roles (admin or editor)

---

## ✅ Configuration Summary

**Current Settings**:
- Backend: Git Gateway
- Branch: master
- Site URL: https://atektechnologies.in
- Authentication: Netlify Identity (email/password)
- Publish Mode: Editorial Workflow
- Local Backend: Disabled (for production)

**Admin User**:
- Email: atekit.inc@gmail.com
- Password: Atekit@999
- Role: admin

---

## 🚀 Next Steps

1. Follow Steps 1-7 above to complete the setup
2. Commit and push the configuration changes
3. Wait for Netlify to deploy
4. Test the admin panel login
5. Start managing your content!

---

## 📞 Support

If you encounter any issues:
- Check Netlify Dashboard → Identity for user status
- Review Netlify Deploy logs for errors
- Verify GitHub repository permissions
- Check browser console for error messages

