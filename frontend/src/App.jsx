import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

function StatusBadge({ value }) {
  const up = value === 'up' || value === 'ok'
  return <span className={`badge ${up ? 'ok' : 'down'}`}>{value}</span>
}

export default function App() {
  const [health, setHealth] = useState(null)
  const [todos, setTodos] = useState([])
  const [notes, setNotes] = useState([])
  const [todoInput, setTodoInput] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [error, setError] = useState('')

  const loadAll = async () => {
    try {
      setError('')
      const [h, t, n] = await Promise.all([
        api('/api/health'),
        api('/api/todos'),
        api('/api/notes')
      ])
      setHealth(h)
      setTodos(t)
      setNotes(n)
    } catch (e) {
      setError('Could not reach the API. Is the backend running? (' + e.message + ')')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!todoInput.trim()) return
    await api('/api/todos', { method: 'POST', body: JSON.stringify({ title: todoInput }) })
    setTodoInput('')
    loadAll()
  }

  const toggleTodo = async (id) => {
    await api(`/api/todos/${id}`, { method: 'PATCH' })
    loadAll()
  }

  const deleteTodo = async (id) => {
    await api(`/api/todos/${id}`, { method: 'DELETE' })
    loadAll()
  }

  const addNote = async (e) => {
    e.preventDefault()
    if (!noteInput.trim()) return
    await api('/api/notes', { method: 'POST', body: JSON.stringify({ text: noteInput }) })
    setNoteInput('')
    loadAll()
  }

  const deleteNote = async (id) => {
    await api(`/api/notes/${id}`, { method: 'DELETE' })
    loadAll()
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>🚀 FullStackDemo</h1>
        <p>React + FastAPI + PostgreSQL + MongoDB — one <code>docker compose up</code> to run it all.</p>
        <div className="links">
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">API docs</a>
          <a href="http://localhost:8000/api/health" target="_blank" rel="noreferrer">Health JSON</a>
          <button onClick={loadAll}>↻ Refresh</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="cards">
        <div className="card">
          <h3>Backend</h3>
          <StatusBadge value={health ? health.status : '...'} />
        </div>
        <div className="card">
          <h3>PostgreSQL (Todos)</h3>
          <StatusBadge value={health ? health.postgres : '...'} />
        </div>
        <div className="card">
          <h3>MongoDB (Notes)</h3>
          <StatusBadge value={health ? health.mongo : '...'} />
        </div>
      </section>

      <main className="grid">
        <section className="panel">
          <h2>✅ Todos <small>(PostgreSQL — relational)</small></h2>
          <form onSubmit={addTodo} className="row">
            <input
              placeholder="e.g. Learn docker compose up"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
          <ul>
            {todos.map((t) => (
              <li key={t.id} className={t.done ? 'done' : ''}>
                <span onClick={() => toggleTodo(t.id)} title="click to toggle">
                  {t.done ? '✅' : '⬜'} {t.title}
                </span>
                <button className="danger" onClick={() => deleteTodo(t.id)}>✕</button>
              </li>
            ))}
            {todos.length === 0 && <p className="muted">No todos yet — add one!</p>}
          </ul>
        </section>

        <section className="panel">
          <h2>📝 Notes <small>(MongoDB — document)</small></h2>
          <form onSubmit={addNote} className="row">
            <input
              placeholder="e.g. Mongo stores flexible JSON docs"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
          <ul>
            {notes.map((n) => (
              <li key={n.id}>
                <span>📄 {n.text}</span>
                <button className="danger" onClick={() => deleteNote(n.id)}>✕</button>
              </li>
            ))}
            {notes.length === 0 && <p className="muted">No notes yet — add one!</p>}
          </ul>
        </section>
      </main>

      <footer>
        <p>Freshers: read the <code>README.md</code> → run <code>docker compose up --build</code> → try the 3 tasks.</p>
      </footer>
    </div>
  )
}
