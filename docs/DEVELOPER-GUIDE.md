# Halo Dental — Developer Guide

Welcome to the Halo Dental codebase! This guide is written for you, the developer and clinic website owner. Even if you only know basic HTML, CSS, and JavaScript, this guide will help you understand how this website is built, how to modify it safely, and how to avoid common mistakes.

---

## 1. What Technologies Power This Website?

Imagine building a house:
- **Next.js** is the foundation and structure of the building. It organizes our pages, handles routing, and makes pages load almost instantly.
- **React** is the furniture and interactive elements (buttons, forms, popup modals).
- **TypeScript** is your safety inspector. It checks our code before it runs, warning us if we misspell a variable or pass the wrong type of information.
- **Tailwind CSS** is the interior paint and decoration. Instead of writing long CSS files, we attach style classes directly to our HTML tags (e.g., `text-brand-gold bg-brand-ivory`).
- **next-intl** is our translator. It allows visitors to seamlessly switch between English and Malayalam.
- **Supabase** is our digital filing cabinet. It securely stores appointments, patient details, services, and doctor profiles.

---

## 2. Server Components vs. Client Components (Made Simple)

Next.js uses two kinds of components:

### 1. Server Components (The Default)
- **What they are**: Code that runs only on the server before sending plain HTML to the visitor's browser.
- **Why we use them**: They make the website extremely fast because the visitor doesn't have to download heavy JavaScript libraries.
- **Rule**: If a page or component only displays data, text, or images, keep it as a Server Component.

### 2. Client Components (`"use client"`)
- **What they are**: Code that runs in the visitor's browser.
- **When to use them**: Whenever a component has interactive features that react to clicks, keystrokes, or timers (like an accordion that opens/closes, a photo carousel, or a form with state).
- **Rule**: Put `"use client";` at the very top line of the file (see `components/marketing/TestimonialCarousel.tsx`).

---

## 3. How to Run the Website on Your Computer

Always run commands inside the `halo-dental` folder:

```powershell
# Step 1: Navigate to the project directory
cd halo-dental

# Step 2: Start the development server
npm run dev
```

Open your browser and visit: [http://localhost:3000](http://localhost:3000)

### 3 Useful Commands to Check Your Work
Before publishing changes, run these three commands in your terminal:
1. `npm run typecheck` — Checks for spelling or type errors in TypeScript.
2. `npm run lint` — Checks for code styling mistakes.
3. `npm run build` — Tests if the website can be packaged for production without errors.

---

## 4. How to Make Common Changes Safely

### A. I Want to Edit Text (English or Malayalam)
Do **not** edit text directly in the page files. All text is stored in:
- `messages/en.json` (English)
- `messages/ml.json` (Malayalam)

**Example**: To change the clinic headline:
1. Open `messages/en.json`.
2. Find the key `"hero.title"`.
3. Change the English text.
4. Open `messages/ml.json` and update the matching Malayalam translation.

### B. I Want to Change the Phone Number or WhatsApp Link
- **Phone & Email**: Open `messages/en.json` and look under the `"contact"` section.
- **WhatsApp Floating Button**: Open `components/marketing/FloatingWhatsAppButton.tsx` and change the phone number in the component.

### C. I Want to Change Website Colors
All brand colors are defined in `tailwind.config.ts`:
- `brand.gold`: `#D4AF37` (Accent gold)
- `brand.charcoal`: `#1F2421` (Dark luxury text)
- `brand.ivory`: `#FAFAF7` (Light background)
- `brand.linen`: `#F3EFE6` (Subtle off-white card background)

Changing a color code here instantly updates that color across the entire website!

### D. I Want to Change Testimonials
Open `components/marketing/TestimonialCarousel.tsx`. Look near the top for the `DEFAULT_TESTIMONIALS` list. You can edit the quotes, patient names, ratings, or treatment tags.

---

## 5. Golden Rules to Avoid Breaking Things

1. **Always run commands inside `halo-dental`**:
   The outer folder is just a scaffold wrapper. Your Next.js project and `package.json` are inside `halo-dental`.
2. **Every public page must call `setRequestLocale(locale)`**:
   Next-intl requires `setRequestLocale(locale)` at the top of every page and layout inside `app/[locale]/`. If you create a new page, don't forget this line!
3. **Never write secret keys with `NEXT_PUBLIC_`**:
   Only variables that are safe for anyone in the world to see should start with `NEXT_PUBLIC_`. Keep passwords and service keys strictly server-side.
4. **Use synchronous `params` in Next.js 14**:
   In Next.js 14, page parameters are normal objects:
   ```tsx
   export default function Page({ params }: { params: { locale: string; slug: string } }) { ... }
   ```
   Do not use `await params` (that is only for Next.js 15).

---

## 6. Where to Look If Something Goes Wrong

- **Terminal Output**: When an error happens, the terminal shows the exact filename and line number.
- **Red squiggly lines in your code editor**: Hover over the red line in VS Code / Antigravity to see what TypeScript is warning you about.
- **Browser Console (F12)**: If a button or click is not doing anything, press `F12` in Chrome, click the **Console** tab, and check for yellow or red messages.
