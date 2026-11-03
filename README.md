# Campus Book Exchange

# BOOK FOR SALE — COMPLETE FULL-STACK MARKETPLACE

Act as a senior full-stack software engineer, product designer, UI/UX expert and software architect.

Build a professional, production-ready student-to-student second-hand book marketplace called **"Book For Sale"**.

This is not a simple landing page or static UI project. It must be a fully functional web application with real authentication, database integration, user accounts, book listings, search, filters and marketplace functionality.

## 1. PROJECT VISION

Book For Sale connects students who have completed their academic or competitive exam preparation and want to sell their previously used books with students who want to purchase those books at affordable prices.

The platform should initially focus on:

- NCERT textbooks (Class 6–12)
- JEE preparation books
- NEET preparation books
- UPSC preparation books
- SSC preparation books
- Banking exam books
- Other competitive examination books
- College and university textbooks

The primary goal is to make educational books affordable, reusable and easily accessible.

Tagline: "Your Books. Someone's Next Beginning."

## 2. DESIGN AND VISUAL IDENTITY

Create a premium, modern, clean and trustworthy marketplace.

Design inspiration:
- Amazon's powerful e-commerce functionality.
- Modern bookstore aesthetics.
- Premium SaaS dashboard layouts.
- Clean product cards and professional typography.

Visual direction:
- Primary background: warm white / off-white.
- Primary text: deep navy.
- Accent: sophisticated blue or teal.
- Secondary backgrounds: light grey.
- Subtle shadows and borders.
- Consistent rounded corners.
- Smooth transitions and micro-interactions.
- High-quality book cover photography.
- Spacious layouts and excellent visual hierarchy.

Avoid:
- Excessive gradients.
- Too many colours.
- Overly rounded cartoon-style UI.
- Unnecessary animations.
- Cluttered layouts.

The design must look like a real funded startup product, not a generic AI-generated template.

Ensure perfect responsiveness on desktop, tablet and mobile.

## 3. GLOBAL NAVIGATION

Create a professional navigation bar containing:

- Book For Sale logo.
- Home.
- Buy Books.
- Sell Books.
- Categories.
- Search bar.
- Wishlist icon.
- Cart icon.
- Login / Sign Up.
- User profile dropdown after login.

The navigation should remain consistent across all pages.

## 4. HOMEPAGE

Create an attractive homepage with the following sections:

A. Hero Section
- Large headline: "Find Your Next Book at a Better Price."
- Supporting text explaining the student-to-student marketplace.
- Prominent search bar.
- Explore Books CTA.
- Sell Your Books CTA.
- Attractive academic/book-related visual.

B. Popular Categories
Display visual category cards:
- NCERT
- JEE
- NEET
- UPSC
- SSC
- Banking
- College Books

C. Recently Listed Books
Show recently added book listings from the database.

D. Best Deals
Display books with attractive discounts compared to original MRP.

E. Recommended Books
Show recommendations based on selected categories and user interests.

F. Popular Books
Display genuinely popular listings based on actual marketplace activity.

G. How It Works
Three steps:
1. Find a Book.
2. Connect with a Student Seller.
3. Purchase at an Affordable Price.

H. Sell Your Books CTA
Encourage students to list their previously used books.

I. Footer
Include About Us, Contact, FAQs, Privacy Policy, Terms and Conditions and social links.

## 5. AUTHENTICATION SYSTEM

Implement real Supabase Authentication.

Create separate pages for:

LOGIN:
- Email address.
- Password.
- Show/hide password.
- Remember session.
- Forgot Password.
- Login button.
- Link to Create Account.

CREATE ACCOUNT:
- Full name.
- Email.
- Password.
- Confirm password.
- Mobile number (optional).
- City.
- Terms and Conditions acceptance.
- Email verification.

FORGOT PASSWORD:
- Email input.
- Send reset link.
- Proper success and error states.
- Secure password reset page.

Also implement:
- Persistent login sessions.
- Logout.
- Protected routes.
- Authentication error handling.
- Optional Google login.

Do not create fake authentication or frontend-only login functionality.

## 6. BUY BOOKS — MARKETPLACE

Create a dedicated marketplace page with a powerful search and filtering experience.

SEARCH:
Allow searching by:
- Book title.
- Author.
- Publisher.
- ISBN.
- Exam name.
- Subject.

FILTERS:
- Book category.
- Exam category.
- Class or academic level.
- Subject.
- Price range.
- Book condition.
- Seller rating.
- City.
- Availability.

SORTING:
- Recommended.
- Recently Listed.
- Price: Low to High.
- Price: High to Low.
- Highest Rated.
- Most Popular.

PRODUCT CARDS:
Every book card should display:
- Book cover image.
- Book title.
- Author.
- Publisher.
- Original MRP.
- Seller's asking price.
- Discount percentage.
- Condition rating out of 5.
- Seller rating.
- Wishlist button.
- View Details button.

Display actual database records, not hardcoded demo products.

## 7. BOOK DETAILS PAGE

When a user clicks on a book, open a dedicated product details page.

Include:
- Multiple book images with image gallery.
- Book title.
- Author.
- Publisher.
- ISBN.
- Original MRP.
- Selling price.
- Savings and discount percentage.
- Condition out of 5.
- Detailed description.
- Subject and examination category.
- Purchase year.
- Seller profile.
- Seller's preparation background.
- Seller rating and verified reviews.
- Seller location.
- Similar books.
- Add to Wishlist.
- Add to Cart.
- Buy Now.
- Contact Seller.

Clearly distinguish between book condition and seller reputation.

## 8. SELL BOOKS — SELLER DASHBOARD

Create a separate Sell Books section.

Users should be able to sell their books using their existing account.

Create a detailed listing form containing:

BOOK INFORMATION:
- Book title.
- Author.
- Publisher.
- ISBN (optional).
- Category.
- Subject.
- Exam preparation category.
- Class or academic level.
- Original MRP.
- Selling price.
- Purchase year.

BOOK IMAGES:
- Upload multiple photographs.
- Image preview.
- Remove or replace images.
- Validate image formats and file sizes.
- Store images in Supabase Storage.

BOOK CONDITION:
Provide a five-level condition scale:

1 - Poor: Noticeable damage, stains or significant wear.
2 - Fair: Usable with visible wear and markings.
3 - Good: Normal used condition with minor wear.
4 - Almost New: Minimal usage and very little visible wear.
5 - Like New: Excellent condition with almost no signs of use.

SELLER INFORMATION:
- Seller's preparation background.
- Examination prepared for.
- Year of preparation.
- Short description.
- City and PIN code.

Allow sellers to:
- Publish listings.
- Edit listings.
- Delete listings.
- Mark books as sold.
- Pause listings.
- View listing status.
- View enquiries and orders.

Validate all inputs before publishing.

## 9. SELLER PROFILE

Every user should have a public seller profile.

Include:
- Profile photo.
- Full name.
- City.
- Member since.
- About section.
- Examination preparation background.
- Books listed.
- Books sold.
- Average seller rating.
- Customer reviews.
- Active listings.

Allow buyers to view a seller's profile before purchasing.

Do not expose private information such as email, phone number or residential address publicly without explicit user consent.

## 10. USER ACCOUNT DASHBOARD

Create a polished personal dashboard.

Sections:
- My Profile.
- My Orders.
- My Listings.
- My Wishlist.
- My Cart.
- Saved Addresses.
- Notifications.
- Account Settings.
- Logout.

Both buyers and sellers must use one unified account.

## 11. WISHLIST AND CART

Implement actual functionality.

WISHLIST:
- Add and remove books.
- Persist wishlist in the database.
- Display saved books in the user's account.

CART:
- Add books to cart.
- Remove books.
- Update quantity only where appropriate.
- Calculate subtotal.
- Display availability.
- Prevent purchasing already sold books.

For unique second-hand copies, a listing should normally have a maximum quantity of one.

## 12. DATABASE ARCHITECTURE

Use Supabase with PostgreSQL.

Design a normalized relational database with the following tables:

1. profiles
2. books
3. listings
4. listing_images
5. categories
6. orders
7. order_items
8. wishlist
9. cart_items
10. addresses
11. reviews
12. notifications
13. reports

Implement:
- UUID primary keys.
- Foreign key relationships.
- Timestamps.
- Database constraints.
- Appropriate indexes.
- Secure Row Level Security policies.
- Proper user ownership checks.

Supabase Auth must handle passwords securely.

Never store plain-text passwords.

Never expose the Supabase service-role key in frontend code.

Users must only be able to edit their own profiles, listings, wishlist, cart and private information.

## 13. ADMIN PANEL

Create a separate protected admin dashboard.

Features:
- Total registered users.
- Total active listings.
- Total sold books.
- Total orders.
- Manage users.
- Manage categories.
- Approve, reject or remove reported listings.
- Review reported users.
- Monitor marketplace activity.

Enforce admin permissions through secure backend authorization, not just frontend visibility.

## 14. RATINGS AND REVIEWS

Implement a genuine review system.

Buyers should be able to rate sellers after a completed purchase.

Features:
- Five-star seller rating.
- Written feedback.
- Verified purchase indicator.
- Average rating calculation.
- Review history.

Do not allow users to submit fake or repeated reviews.

Book condition ratings must remain separate from seller ratings.

## 15. SECURITY AND RELIABILITY

Implement:
- Server-side validation.
- Secure authentication.
- Row Level Security.
- Protected routes.
- Safe image uploads.
- Error handling.
- Loading indicators.
- Empty states.
- Duplicate submission prevention.
- Proper database access controls.

Never trust frontend-only validation for sensitive operations.

## 16. IMPORTANT DEVELOPMENT RULES

This is a real full-stack application.

Do not:
- Create non-functional buttons.
- Use fake login systems.
- Use static product cards instead of database records.
- Display fake ratings or fake sales.
- Use placeholder functionality for important features.
- Expose private user data.
- Ignore mobile responsiveness.

Every major feature should be connected to its actual backend functionality.

## 17. IMPLEMENTATION STRATEGY

Develop in a structured sequence:

Phase 1: Design system, navigation and homepage.
Phase 2: Authentication and user profiles.
Phase 3: Database architecture and seller listing system.
Phase 4: Buy Books marketplace, search and filters.
Phase 5: Book details, wishlist and cart.
Phase 6: Orders, reviews and notifications.
Phase 7: Admin dashboard.
Phase 8: Security testing, responsive testing and deployment.

Before moving to the next phase:
- Test all existing functionality.
- Verify database operations.
- Fix errors.
- Ensure no existing feature is broken.

Start by building the complete visual design and application structure, then implement the backend functionality phase by phase.

The final application must feel like a professional, trustworthy, scalable online marketplace for students.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6f9408d9-cb32-4817-b5e2-0d0d01cda9e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
