#  AdultinLK

### *Life happens. We've got the paperwork.*

**AdultinLK** is a full-stack web application built to help young Sri Lankans navigate administrative, government, and public-service processes associated with major life events.

Instead of searching through complicated government directories, AdultinLK starts with a simple life situation:

> **"What's happening in your life?"**

Users select a life event (e.g., going abroad, getting a vehicle, starting a business, or starting university), and AdultinLK guides them through required administrative tasks, documents, steps, reference fees, and official guidelines in a structured, checklist-based personal journey.

---

## Problem Statement

Young adults in Sri Lanka frequently handle administrative procedures independently for the first time. Critical information regarding services, documents, requirements, fees, and office locations is often:

* Scattered across different department websites and physical counters
* Difficult to understand or written in complex jargon
* Hard to discover without knowing exact department or service names
* Overwhelming for first-time applicants

AdultinLK solves this problem by organizing fragmented administrative procedures into **clear, event-driven user journeys**.

---

## Solution & User Flow

```text
Select Life Event ➔ Discover Required Services ➔ Review Checklist & Guidelines ➔ Add to Personal Journey ➔ Complete Tasks & Track Progress
```
## Tech Stack


Frontend:
* React.js 19 – Functional components and React Hooks (useState, useEffect)
* Vite 8 – Fast frontend build tool and dev server
* JavaScript (ES6+) – Asynchronous async/await and Fetch API for backend integration

Styling & UI:
* Custom Vanilla CSS3 – Responsive design system using CSS Variables, Flexbox, and CSS Grid
* Custom Micro-Interactions – Card hover effects, glowing accent borders, and dynamic progress bar styling

Routing & State Management:
* React Router (v7 / v6) – Multi-page client-side navigation (BrowserRouter, Routes, Route, NavLink, Link)
* Browser localStorage API – Client-side data persistence for user profiles, selected services, and journey checklist state

Backend:
* Node.js (v20+) – JavaScript runtime environment
* Express.js 5 – RESTful API server framework
* CORS Middleware – Cross-Origin Resource Sharing handling between client and server
* Dotenv – Environment variable management

Data Modeling & Validation:
* Mongoose Schema – Object Data Modeling (ODM) schema structure for government public services
* Regular Expressions (RegExp) – Validation for Sri Lankan National Identity Card (NIC) formats (9-digit with V/X and 12-digit formats)
* Form Constraint Validation – Age verification rules (18–60 years) and required input checks


Deployment & Cloud Infrastructure:
* Render (Web Service) – Production cloud hosting for the Node.js Express backend
* Vercel – Production cloud hosting for the compiled Vite React frontend
* Git & GitHub – Version control and CI/CD automated deployment triggers 

