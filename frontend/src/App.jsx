import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TASKS = [
  {
    level: 'Task 1 · Easy',
    tone: 'success',
    title: 'Build the Todos panel',
    body: 'Fetch todos from PostgreSQL via the API and render the list, with a form to add new ones.',
    href: 'https://github.com/0xFreak/Full-Stack-Demo/issues/2'
  },
  {
    level: 'Task 2 · Medium',
    tone: 'warning',
    title: 'Add priority, end to end',
    body: 'Extend the Todo model, API validation, and UI with a low / medium / high priority.',
    href: 'https://github.com/0xFreak/Full-Stack-Demo/issues/1'
  },
  {
    level: 'Task 3 · Harder',
    tone: 'secondary',
    title: 'Live search + CI badge',
    body: 'Add ?q= search to both APIs, a search box in the UI, and a CI status badge in the README.',
    href: 'https://github.com/0xFreak/Full-Stack-Demo/issues/3'
  }
]

function ServiceCard({ name, detail, state }) {
  return (
    <div className="card">
      <span className={`dot dot-${state}`} aria-hidden="true" />
      <div>
        <h3>{name}</h3>
        <p className="mono">{detail}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  const checkHealth = async () => {
    try {
      setError('')
      const res = await fetch(`${API}/api/health`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setHealth(await res.json())
    } catch (e) {
      setHealth(null)
      setError(`API unreachable at ${API} — is the backend running? (${e.message})`)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const services = [
    {
      name: 'API',
      detail: health ? health.status : 'checking…',
      state: health ? (health.status === 'ok' ? 'up' : 'warn') : 'unknown'
    },
    {
      name: 'PostgreSQL',
      detail: health ? health.postgres : 'checking…',
      state: health ? (health.postgres === 'up' ? 'up' : 'down') : 'unknown'
    },
    {
      name: 'MongoDB',
      detail: health ? health.mongo : 'checking…',
      state: health ? (health.mongo === 'up' ? 'up' : 'down') : 'unknown'
    }
  ]

  return (
    <div className="page">
      <header className="masthead">
        <p className="eyebrow">FullStackDemo · Starter</p>
        <h1>Build your first full-stack feature.</h1>
        <p className="lede">
          React + FastAPI + PostgreSQL + MongoDB, running with one command:{' '}
          <code>docker compose up --build</code>
        </p>
        <div className="actions">
          <a className="btn btn-primary" href={`${API}/docs`} target="_blank" rel="noreferrer">
            API docs
          </a>
          <a className="btn" href={`${API}/api/health`} target="_blank" rel="noreferrer">
            Health JSON
          </a>
          <button className="btn" type="button" onClick={checkHealth}>
            Recheck
          </button>
        </div>
      </header>

      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}

      <section aria-label="Services">
        <h2 className="section-label">Services</h2>
        <div className="cards">
          {services.map((s) => (
            <ServiceCard key={s.name} {...s} />
          ))}
        </div>
      </section>

      <section aria-label="Build queue">
        <h2 className="section-label">Build queue</h2>
        <div className="tasks">
          {TASKS.map((t) => (
            <article className="task" key={t.title}>
              <p className={`pill pill-${t.tone}`}>{t.level}</p>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <a href={t.href} target="_blank" rel="noreferrer">
                Open issue →
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <p>
          Start with Task 1. Read <code>README.md</code>, keep changes small, open a PR per task.
        </p>
      </footer>
    </div>
  )
}
