# Izhar Electronics — Professional Website + Owner Gallery

This version uses the supplied Izhar Electronics logo and adds a private owner gallery manager for project photos and videos.

## What is included

- Supplied Izhar Electronics logo in the header and footer.
- Electronics / LCD / LED repair, solar system and CCTV project branding.
- Responsive website for phones, tablets and desktops.
- Public project gallery with photo/video filters.
- Owner-only Gallery Manager at `admin.html`.
- Firebase Authentication for owner login.
- Firebase Storage for project images/videos.
- Firestore for gallery records and real-time updates.
- Delete button with a centered warning confirmation modal.
- Public gallery updates automatically after an owner upload/delete.
- SEO title, description, keywords, LocalBusiness structured data, robots.txt and sitemap.xml.

## Important: free hosting vs free cloud storage

A completely static website can be hosted for free on GitHub Pages. GitHub Pages is available with GitHub Free for public repositories. The default address is a `github.io` address. A custom domain is optional and normally costs money because the domain itself must be purchased.

The owner upload feature cannot be provided by GitHub Pages alone because GitHub Pages is static hosting. This project therefore uses Firebase Authentication + Cloud Storage + Firestore for the dynamic gallery.

Firebase currently has a no-cost Spark plan with usage limits and no payment method required. It is **not a promise of unlimited or lifetime storage**. Quotas and platform policies can change, and a large number of videos can exceed the free allowance. Keep project videos reasonably sized and monitor usage.

## Firebase setup (one time)

1. Create a Firebase project at https://console.firebase.google.com/.
2. Add a Web App to the project.
3. Copy the Firebase web configuration into `firebase-config.js` and replace every `YOUR_...` value.
4. In Firebase Authentication, enable **Email/Password** sign-in.
5. Create the owner account with the email/password you want to use for `admin.html`.
6. In Firestore Database, create the database.
7. In Firestore, create a collection named `admins`.
8. Create one document whose **document ID is the owner's Firebase Auth UID**. Add this field:
   - `role` = `admin`
9. In Firebase Storage, create/enable the Storage bucket.
10. Replace the Firebase Firestore rules with the contents of `firestore.rules`.
11. Replace the Firebase Storage rules with the contents of `storage.rules`.
12. Test `admin.html`: sign in, choose a photo/video, upload it, then open the public website and check the Gallery.
13. Test Remove: the center warning should appear before deletion.

### Finding the owner's UID

Firebase Console → Authentication → Users → copy the UID of the owner account. Use that UID as the document ID under Firestore → `admins`.

## Uploading from a phone

On a phone, open `admin.html`, sign in, tap **Choose Files**, select photos/videos from the phone, and upload. The website gallery uses Firestore's real-time listener, so the new gallery item appears to visitors after the upload record is saved.

## Security

Do not put a normal Firebase service-account private key in this website. The browser only receives the normal Firebase Web App configuration. The actual upload/delete authorization is enforced by Firebase Authentication + Firestore/Storage Security Rules.

Only accounts that have an `admins/{UID}` document with `role = admin` can change gallery data.

## Publish free with GitHub Pages

1. Create a GitHub account if you do not have one.
2. Create a **public** repository, for example `izhar-electronics`.
3. Upload all files from this folder to the repository root.
4. Go to GitHub repository → Settings → Pages.
5. Choose **Deploy from a branch**, select `main`, folder `/root`, then Save.
6. GitHub will provide a free `github.io` website address.
7. Replace the placeholder URL in `sitemap.xml` and `robots.txt` with your real GitHub Pages address.
8. Open the website URL and test it on your phone.

## Google Search

GitHub Pages can be indexed by search engines, but no free host can guarantee that Google will show a site immediately or rank it highly. After publishing:

1. Open Google Search Console.
2. Add your GitHub Pages URL as a property.
3. Submit your `sitemap.xml` URL.
4. Use URL Inspection and request indexing for the homepage.
5. Keep the business name, services, phone number and location consistent across the website and your public business profiles.

Google indexing may take time. Search visibility is not guaranteed simply because the site is hosted on GitHub Pages.

## Automatic updates

- **Gallery photos/videos:** automatic after an owner upload because Firebase is the live data source.
- **Normal website text/design:** edit the HTML/CSS/JS and push the changes to GitHub; GitHub Pages republishes the new version automatically.
- **No hosting fee:** GitHub Pages can host the static site at no cost on its default domain, subject to GitHub's current terms/limits.


## Contact links
The public contact buttons use these working destinations:
- Phone: `tel:+923130959654`
- WhatsApp: `https://wa.me/923130959654`
- Email: `mailto:izhar8755@gmail.com`

The WhatsApp links open WhatsApp in a new tab/window and the email buttons open the visitor's default mail app. The phone button opens the phone dialer on supported mobile devices.

## Version 5 visual update
- Replaced the small header mark + text with the supplied full Izhar Electronics logo.
- Made the header logo larger and highly visible.
- Added a dark navy/blue header background so the supplied logo remains readable.
- Replaced the hero logo with the same full brand lockup for consistency.
- Updated the footer branding to the full logo.
- Reworked the copyright area into a full-width footer bar with a complete copyright statement.

## v7 visual updates
- Kept the full Izhar Electronics logo only in the main header.
- Removed duplicate logo from the hero and footer.
- Removed the visible logo/card border treatment.
- Increased header logo size and preserved responsive sizing.
- Added hover feedback across navigation, buttons, service cards, project cards, gallery cards, process cards and contact actions.
- Kept the original logo colors and used high-contrast white header background.
# Izhar-electronics-shop
