const BASE_URL = 'https://jsonplaceholder.typicode.com'

async function fetchJson(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}

export function fetchTodos() {
  return fetchJson('/todos')
}

export function fetchUsers() {
  return fetchJson('/users')
}
