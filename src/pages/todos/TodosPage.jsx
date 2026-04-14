import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTodos, fetchUsers } from '../../lib/api.js'
import { Button } from '../../ui/Button.jsx'
import styles from './TodosPage.module.css'

const PAGE_SIZE = 10
const defaultFilters = {
  search: '',
  userId: 'all',
  status: 'all',
  page: 1,
}
const FILTERS_QUERY_KEY = ['todo-filters']

function getStatusLabel(completed) {
  return completed ? 'Completed' : 'Pending'
}

export function TodosPage() {
  const queryClient = useQueryClient()
  const { data: filters = defaultFilters } = useQuery({
    queryKey: FILTERS_QUERY_KEY,
    queryFn: () => defaultFilters,
    initialData: defaultFilters,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })

  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 5,
  })

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  })

  const usersById = useMemo(() => {
    return new Map((usersQuery.data ?? []).map((user) => [user.id, user.name]))
  }, [usersQuery.data])

  const filteredTodos = useMemo(() => {
    const todos = todosQuery.data ?? []
    const searchTerm = filters.search.trim().toLowerCase()

    return todos.filter((todo) => {
      const matchesSearch =
        searchTerm.length === 0 || todo.title.toLowerCase().includes(searchTerm)

      const matchesUser =
        filters.userId === 'all' || String(todo.userId) === filters.userId

      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'completed' && todo.completed) ||
        (filters.status === 'pending' && !todo.completed)

      return matchesSearch && matchesUser && matchesStatus
    })
  }, [filters.search, filters.status, filters.userId, todosQuery.data])

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE))
  const currentPage = Math.min(filters.page, totalPages)
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function updateFilters(patch) {
    queryClient.setQueryData(FILTERS_QUERY_KEY, (current = defaultFilters) => {
      const next = { ...current, ...patch }

      if (
        patch.search !== undefined ||
        patch.userId !== undefined ||
        patch.status !== undefined
      ) {
        next.page = 1
      }

      return next
    })
  }

  if (todosQuery.isLoading || usersQuery.isLoading) {
    return <section className={styles.stateCard}>Loading todos...</section>
  }

  if (todosQuery.isError || usersQuery.isError) {
    return (
      <section className={styles.stateCard}>
        <p>Something went wrong while loading the todo list.</p>
        <Button
          variant="brand"
          onClick={() => {
            todosQuery.refetch()
            usersQuery.refetch()
          }}
        >
          Retry
        </Button>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.heading}>Todo List</h2>
          <p className={styles.subheading}>
            Todos, users, filters, and pagination with persisted UI state.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => queryClient.setQueryData(FILTERS_QUERY_KEY, defaultFilters)}
        >
          Reset Filters
        </Button>
      </div>

      <div className={styles.filters}>
        <label className={styles.field}>
          <span>Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
            placeholder="Search by title"
          />
        </label>

        <label className={styles.field}>
          <span>User</span>
          <select
            value={filters.userId}
            onChange={(event) => updateFilters({ userId: event.target.value })}
          >
            <option value="all">All users</option>
            {(usersQuery.data ?? []).map((user) => (
              <option key={user.id} value={String(user.id)}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => updateFilters({ status: event.target.value })}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </label>
      </div>

      <div className={styles.meta}>
        <p>
          Showing {paginatedTodos.length} of {filteredTodos.length} matching todos
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className={styles.list}>
        {paginatedTodos.length === 0 ? (
          <div className={styles.emptyState}>No todos matched your filters.</div>
        ) : (
          paginatedTodos.map((todo) => (
            <article key={todo.id} className={styles.todoCard}>
              <div className={styles.todoTopRow}>
                <span className={styles.todoId}>#{todo.id}</span>
                <span
                  className={
                    todo.completed ? styles.statusDone : styles.statusPending
                  }
                >
                  {getStatusLabel(todo.completed)}
                </span>
              </div>

              <h3 className={styles.todoTitle}>{todo.title}</h3>
              <p className={styles.todoUser}>
                User: {usersById.get(todo.userId) ?? 'Unknown user'}
              </p>
            </article>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => updateFilters({ page: currentPage - 1 })}
        >
          Previous
        </Button>
        <Button
          variant="brand"
          disabled={currentPage === totalPages}
          onClick={() => updateFilters({ page: currentPage + 1 })}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
