# 🚀 Fleetly — Modern Fleet Telemetry & Admin Console

**Fleetly** is a premium, feature-rich, and highly responsive Next.js Web Admin Dashboard designed for modern vehicle rental agencies and real-time GPS telemetry operators. It features stunning 3D graphics, smooth scroll-triggered storytelling transitions, Leaflet live tracking interfaces, dynamic Recharts visualization, and custom document audit queues.

---

## 🎨 Premium Visual Elements

The landing page (`/`) integrates seven state-of-the-art visual modules to deliver a premium user experience:

1. **3D Wireframe Globe Hero** (`globe-hero.tsx`): A cyan wireframe globe spinning in perspective using Three.js, `@react-three/fiber`, and `@react-three/drei` representing live telemetry network distribution.
2. **WebGL Plasma Aurora Backdrop** (`shader-background.tsx`): A custom WebGL fragment shader canvas drawing beautiful morphing grid lines and plasma aurora waves as a lightweight background backdrop.
3. **GSAP Fold-Over Story Scroll** (`story-scroll.tsx`): Pinned sections that fold over during scrolling using GSAP `ScrollTrigger` and `@gsap/react` to tell a visual story.
4. **Spotlight Hover Card Deck** (`animated-feature-carousel.tsx`): Spotlight coordinates tracking radial gradient lights around cards as you move your mouse.
5. **Timeline NumberFlow Pricing Switch** (`pricing-section.tsx`): Toggle monthly/yearly pricing tiers using `@number-flow/react` for smooth, springy digit counting.
6. **Curtain Reveal Cinematic Footer** (`motion-footer.tsx`): Fixed-reveal curtain GSAP layout with magnetic app-store buttons and glowing headers.
7. **Responsive Dropdown Header** (`header-3.tsx`): Clean, glassmorphic dropdown list navigation with portal overlays.

---

## 🛠️ Dashboard Architecture & Pages

The admin panel routes are securely built with Next.js App Router:

* **Role Login Gateway (`/login`)**: Custom authentication rejecting non-`'ADMIN'` roles in the database.
* **Executive Hub (`/admin/dashboard`)**: Metric cards for active fleet ratios, split available vs. rented bars, unverified queue lists, and Recharts daily velocities.
* **Live GPS Map (`/admin/live-map`)**: Interactive full-screen Leaflet map displaying active coordinate markers colored by status (Green: Available, Blue: Rented, Grey: Offline) with overlay locks.
* **Manage Fleet Portal (`/admin/manage-fleet`)**: Highly searchable vehicle directory table showing plate numbers, devices, and modal insertions.
* **Driver Audit Queue (`/admin/approve-drivers`)**: Review pending licenses, PAN cards, and utility bills in full resolution side-by-side using zoom controls.
* **Returns Timeline (`/admin/rentals`)**: Inspect return checklist forms with driver-uploaded photos to close out active rentals.

---

## 💻 Tech Stack

* **Framework**: Next.js 14+ (App Router)
* **Styling**: Tailwind CSS
* **Animation & 3D**: GSAP, Framer Motion, Three.js, React Three Fiber
* **Data Flow**: `@number-flow/react`, Recharts
* **Maps**: Leaflet (`react-leaflet`)
* **Icons & Primitives**: Lucide Icons, Radix UI

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3001](http://localhost:3001)** to view the application.

### 3. Expose Live Tunnel
To generate a public URL to share the landing page instantly, run:
```bash
ngrok http 3001
```
Or use VS Code's **Ports** panel to forward port `3001` and change visibility to **Public**.
