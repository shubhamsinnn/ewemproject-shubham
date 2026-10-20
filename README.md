# Shubham Singh — Academic E-Portfolio (Information Technology)

A modern, responsive, and structured Academic E-Portfolio web application built for **Shubham Singh** (**Roll Number: 24101C0076**), pursuing **B.Tech in Information Technology**.

---

## 🎓 Student Profile & Academic Credentials
- **Student Name:** Shubham Singh
- **Roll Number:** `24101C0076`
- **Degree:** B.Tech Engineering
- **Branch:** Information Technology (IT)
- **Portfolio Type:** Academic E-Portfolio
- **Primary Function:** Structured presentation of coursework assignments, technical learning outcomes, practical tasks, and uploaded document submissions.

---

## 🎨 Design System & Palette
- **Deep Navy Blue:** `#071B33` (Foundations, header text, structural accents)
- **Primary Blue:** `#1769FF` (Interactive elements, buttons, active states)
- **Emerald Green:** `#16A878` (Academic success indicators, highlights)
- **Mint Green:** `#B8F3D5` (Soft badges, metrics, borders)
- **Light Background:** `#F4F8FC` (Clean, academic readability)
- **Typography:** Inter sans-serif & JetBrains Mono for technical attributes.

---

## 🚀 Key Features

1. **Sticky Navigation Bar:**
   - Branded heading with Information Technology badge.
   - Smooth navigation to `#home`, `#overview`, `#assignments`, and `#about`.
   - Distinctive roll number tag (`Roll No. 24101C0076`).
   - Responsive mobile navigation menu.

2. **Hero Section:**
   - Split layout featuring student metadata, programme branch, and quick action buttons.
   - Stylized geometric monogram badge (`SS`) reflecting an authentic academic technology aesthetic without placeholder stock photos.

3. **Dynamic Portfolio Overview:**
   - Real-time calculated counters: Total Assignments, Unique Subjects, Submitted Documents, and Pending Submissions.
   - Core academic learning objectives.

4. **Academic Assignments Showcase (Core Section):**
   - 10 structured assignments covering foundational IT domains (Database Management Systems, Operating Systems, Computer Networks, Software Engineering, Data Structures & Algorithms, Web Development, Machine Learning, AI, Data Warehousing, and Network Security).
   - Each assignment includes:
     - Assignment number and title.
     - Subject categorization with quick filter tags.
     - 2–4 sentence academic overview.
     - Key topics and concept tags.
     - Practical learning outcomes.
     - Dynamic status badge (`Not Uploaded` or `Uploaded`).
     - Interactive inline editor to customize assignment content directly.

5. **Client-Side File Submission & Persistence:**
   - Drag-and-drop & click-to-browse upload area.
   - Validates file formats: `PDF`, `DOC`, `DOCX`, `PPT`, `PPTX`, `XLS`, `XLSX`, `ZIP`, `PNG`, and `JPG`.
   - Client-side **IndexedDB storage**: uploaded files persist across browser reloads, cache clears, and restarts without mock data loss.
   - Features: **Preview Modal** (direct viewing of PDFs and images, formatted cards for documents), **Direct Download**, **Replace File**, and **Remove File with confirmation**.

---

## 🛠️ Local Development & Running Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` package manager

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` or the port displayed in your terminal.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 📝 Customizing Assignments

All assignment metadata is centralized in:
```
src/data/assignments.ts
```

To update or add an assignment, simply modify or append to the `initialAssignments` array:
```typescript
{
  id: 'assignment-01',
  number: '01',
  title: 'Your Custom Assignment Title',
  subject: 'Database Management Systems',
  overview: 'Explain the core questions, activities, and scope of this assignment.',
  keyTopics: ['Topic 1', 'Topic 2', 'Topic 3'],
  learningOutcome: 'Skills demonstrated upon completion.',
  isPlaceholder: false
}
```
Overview statistics (Total, Subjects, Pending, Submitted) will re-calculate dynamically based on this file.

---

## ☁️ Deployment to Vercel

### Deploying via Vercel CLI:
```bash
npx vercel
```
Or for production:
```bash
npx vercel --prod
```

### Deploying via GitHub:
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete academic e-portfolio for Shubham Singh"
   git push origin main
   ```
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Vite**.
4. Click **Deploy**.
