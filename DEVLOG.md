# DevLog — Magic UI Extension

## Day 0: Project Inception, Setup & Collaboration

### 🎯 Objectives
- Initialize the development environment for the **Magic UI** Chrome extension.
- Configure Manifest V3 architecture with modern React and TypeScript tooling.
- Establish version control and set up multi-developer workflow.

---

### 🛠️ What We Did Today

1. **Environment Verification & Initialization**
   - Verified local runtime environments (**Node.js v24.x / npm**).
   - Resolved Windows PowerShell script execution policy restrictions (`RemoteSigned`).
   - Bootstrapped the extension scaffold using the **WXT** framework paired with **React** and **TypeScript**.

2. **Manifest V3 & Project Configuration**
   - Configured `wxt.config.ts` for Manifest V3 specifications.
   - Defined extension permissions: `activeTab`, `storage`, and `scripting`.
   - Set up broad host permissions (`<all_urls>`) to enable DOM transformation across arbitrary webpages.
   - Updated package metadata and branded the extension name as **Magic-UI**.

3. **Version Control & Repository Setup**
   - Initialized Git repository and verified `.gitignore` rules to exclude build artifacts (`.output/`, `.wxt/`, `node_modules/`).
   - Created the initial foundation commit: `feat: initialize Magic UI extension with WXT React and Manifest V3 config`.
   - Connected the local repository to remote GitHub.

4. **Team Onboarding & Developer Workflow**
   - Added collaborator with write permissions to the repository.
   - Verified clone, dependency resolution (`npm install`), and dev build pipelines across both developer environments.
   - Tested WXT hot module replacement (HMR) and established feature branch / Pull Request (PR) workflow conventions.

---

### 📌 Next Steps (Day 1)
- [ ] Implement Mozilla Readability / DOM parsing pipeline in `entrypoints/content.ts`.
- [ ] Build the interactive popup UI layout and trigger controls in `entrypoints/popup/`.
- [ ] Set up messaging bridges between the popup, background service worker, and content script.

# 📓 Magic UI — Sprint DevLog

## 📅 Day 1: Project Scaffolding, Content Script Pipeline & Backend Setup
**Date:** August 16, 2026  
**Status:** Milestone Complete  

---

### 🎯 Sprint Goals for Day 1
- Establish the monorepo architecture for the Chrome extension (WXT + React) and backend server (FastAPI).
- Implement DOM parsing and article extraction in the extension content script using Mozilla Readability.
- Scaffold the FastAPI server, configure CORS, and integrate the Google Gemini API for structured semantic redesign.
- Align Git branch workflows, peer review rules, and merge strategy across the team.

---

### 🛠️ Key Architectural & Technical Decisions

1. **Repository Layout (Monorepo):**
   - Maintained a clean dual-folder monorepo (`extension/` and `backend/`) within the same root repository to centralize issues, PRs, and documentation while keeping Node.js and Python dependency trees fully decoupled.

2. **Backend Runtime Selection (Python + FastAPI vs. Node.js):**
   - Evaluated Node.js vs. Python. Selected **Python with FastAPI** for native Pydantic schema validation, automatic OpenAPI/Swagger documentation (`/docs`), and seamless compatibility with AI/LLM SDKs and future parsing tooling.

3. **Structured JSON Output Architecture:**
   - Instead of asking the LLM to output arbitrary, fragile HTML/CSS, the backend enforces a typed Pydantic intermediate representation (`RedesignResponse` containing `tldr`, `key_points`, and sequenced `sections`). The React reader overlay renders this schema deterministically inside an isolated Shadow DOM.

---

### 🚀 Work Completed

#### 1. Extension & Content Parser (`feat/content-parser`)
- Set up WXT framework with React 19 and TypeScript.
- Integrated `@mozilla/readability` and `@types/jsdom` to extract page metadata, titles, and body content.
- Configured `chrome.runtime.onMessage` listeners to capture toggle events (`TOGGLE_MAGIC_MODE`) and return parsed article data.
- Resolved dependency merge conflicts in `package.json` / `package-lock.json`.
- Opened and merged the initial content parser PR into `main`.

#### 2. Backend & AI Service (`feat/backend-fastapi`)
- Initialized Python virtual environment (`venv`) and exported pinned `requirements.txt`.
- Built FastAPI application with CORS middleware enabled for Chrome extension requests.
- Integrated `google-genai` SDK with environment variable configuration for `GEMINI_API_KEY`.
- Implemented `/health` and `POST /api/redesign` endpoints with structured JSON schemas.
- Configured cloud hosting preparations for Render (`uvicorn main:app --host 0.0.0.0 --port $PORT`).

## Start the FastAPI Backend Server
- cd backend
- source venv/Scripts/activate       # On Windows PowerShell: .\venv\Scripts\Activate.ps1
- uvicorn main:app --reload --port 8000

# In the root repository directory (where package.json is located):
- npm run dev

---

### ⚠️ Challenges Encountered & Resolutions
- **Git Merge Conflicts:** Encountered conflict markers across `devDependencies` during branch sync. Resolved by manually consolidating `@types/chrome`, `@types/jsdom`, and build tools before finalizing lockfiles.
- **LLM Model Deprecation:** Encountered `404 NOT_FOUND` errors when targeting legacy model identifiers with the new `google-genai` SDK. Resolved by updating endpoints to the latest supported model schemas and structure definitions.

---

### 📌 Next Steps (Day 2 Focus)
- [ ] Implement isolated Shadow DOM mounting container in `entrypoints/content.ts`.
- [ ] Connect popup UI trigger to execute the `POST /api/redesign` backend API call.
- [ ] Render the redesigned JSON layout (`MagicReaderView`) dynamically on the active webpage.
- [ ] Implement user preference persistence (`chrome.storage.local`) for theme and typography controls.