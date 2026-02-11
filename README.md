# schedule_management

## 🎓 [Project Name]: UIUC Unified Course Dashboard
Stop hopping between 6 different tabs. Master your semester from a single command center.
[Project Name] is an integrated assignment management dashboard designed specifically for Computer Science students at UIUC.
It consolidates deadlines and course materials scattered across Canvas, PrairieLearn, and various professor-hosted sites
into a single, intuitive interface to reduce cognitive load and maximize academic efficiency.

## 🚀 The Problem: Information Fragmentation
In the UIUC CS ecosystem, course platforms are highly fragmented, making it difficult to track everything at once:

Canvas (2 Courses): Centralized but only shows a fraction of the total workload.
PrairieLearn (1 Course): High friction for external integration due to authentication barriers (NetID).
Custom Course Sites (3 Courses): Static HTML sites (e.g., slazebni.cs.illinois.edu) that offer zero notification or tracking features.

Students are forced to cycle through 5–6 tabs every morning just to check deadlines. This project automates that manual overhead.

## ✨ Key Features
1. Unified Calendar View (Landscape Optimized)
Displays all tasks (MPs, Quizzes, Projects) from multiple platforms on a single timeline.
Uses course-specific color coding to provide an instant visual roadmap of the week.

3. Multi-Source Aggregator (Scrapers)
Canvas LMS API: Syncs real-time assignment data and grade weightings.
Custom Scrapers: Built with BeautifulSoup or Playwright to parse deadlines from static professor-hosted sites.
Session-based Scraping: Implements secure session handling to fetch data from authenticated platforms like PrairieLearn.

3. Course Explorer
Quick-access panel for essential tools: Piazza, Gradescope, and Zoom links.
Summarized course information including Office Hours and Syllabus shortcuts—no more digging through emails.

## 🛠 Tech Stack
Frontend: Next.js 14, Tailwind CSS, Lucide React

Backend: Python (BeautifulSoup, Playwright) / Node.js

Database: SQLite / PostgreSQL (Supabase)

Deployment: Vercel / Local Environment

## 🏗 System Architecture
Extraction: Python scripts collect raw data from 6 disparate sources.

Normalization: Different data formats are transformed into a standardized JSON schema.

Visualization: The Next.js frontend renders the normalized data into a responsive, interactive dashboard.

## 🗺 Roadmap
[x] UI/UX Mockup (Landscape View)

[ ] Canvas API Integration Adapter

[ ] UIUC Custom Site Scraper (e.g., CS 441/541)

[ ] PrairieLearn Authentication Session Handler

[ ] Intelligent Priority Algorithm (Weighting x Deadline proximity)

## 👨‍💻 Author
Donggyu Park

Senior in Computer Science @ University of Illinois Urbana-Champaign

Interests: Computational Biology, Machine Learning, Bio-Imaging
