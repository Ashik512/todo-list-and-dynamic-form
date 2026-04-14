import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout.jsx'
import { FormBuilderPage } from './pages/form-builder/FormBuilderPage.jsx'
import { FormPreviewPage } from './pages/form-preview/FormPreviewPage.jsx'
import { TodosPage } from './pages/todos/TodosPage.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/todos" replace />,
      },
      {
        path: 'todos',
        element: <TodosPage />,
      },
      {
        path: 'form-builder',
        element: <FormBuilderPage />,
      },
      {
        path: 'form-preview',
        element: <FormPreviewPage />,
      },
    ],
  },
])
