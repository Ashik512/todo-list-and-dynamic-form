# Todo List and Dynamic Form Builder

A Vite + React single-page app with three main features:

- `todos`: browse todos with filters, search, pagination, and persisted filter state
- `form-builder`: create, edit, and delete dynamic forms
- `form-preview`: render and submit saved forms, and edit them from preview

This project is built as a React assessment-style dashboard with reusable UI components (shared `Button` and `CommonModal`) and local persistence for form and filter state.

## Tech Stack

- React 19 + JSX
- Vite 8
- React Router (`react-router-dom`)
- TanStack Query (`@tanstack/react-query`)
- CSS Modules + global CSS
- ESLint 9 (flat config)

## Routes

- `/` -> redirects to `/todos`
- `/todos` -> todo list with:
  - search by title
  - user filter
  - status filter (all/completed/pending)
  - pagination (10 items per page)
  - filter state persisted to `localStorage`
- `/form-builder` -> dynamic form manager:
  - create new form in modal
  - add/edit/remove fields
  - support field types: `text`, `email`, `number`, `textarea`, `select`, `radio`, `date`
  - save and delete forms in `localStorage`
- `/form-preview` -> form renderer:
  - preview saved forms
  - optional query support: `?formId=<id>`
  - edit selected form in modal
  - submit logs values to browser console

## Project Structure

```text
src/
  constants/
    fieldTypes.js
  hooks/
    useFormDraftEditor.js
    useLocalStorageState.js
  layout/
    AppLayout.jsx
    AppLayout.module.css
  lib/
    api.js
    forms.js
    localStorage.js
  pages/
    todos/
      TodosPage.jsx
      TodosPage.module.css
    form-builder/
      FormBuilderPage.jsx
      FormBuilderPage.module.css
    form-preview/
      FormPreviewPage.jsx
      FormPreviewPage.module.css
  ui/
    Button.jsx
    Button.module.css
    CommonModal.jsx
    CommonModal.module.css
    FormEditor.jsx
    FormEditor.module.css
  main.jsx
  router.jsx
```

## Data and Persistence

- Remote data (`todos`, `users`) comes from JSONPlaceholder:
  - `https://jsonplaceholder.typicode.com/todos`
  - `https://jsonplaceholder.typicode.com/users`
- Todo filters are persisted with key: `todo-list-filters`
- Form definitions are persisted with key: `dynamic-form-forms`

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal.
