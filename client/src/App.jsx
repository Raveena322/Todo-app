import React, { useEffect, useMemo, useState } from 'react';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './services/api.js';
import './style.css';

export default function App() {
    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all | active | completed
    const [theme, setTheme] = useState('light'); // light | dark

    const pendingCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
    const shownTodos = useMemo(() => {
        if (filter === 'active') return todos.filter(t => !t.completed);
        if (filter === 'completed') return todos.filter(t => t.completed);
        return todos;
    }, [todos, filter]);

    useEffect(() => {
        // initialize theme from localStorage or system preference
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved);
            document.documentElement.dataset.theme = saved;
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = prefersDark ? 'dark' : 'light';
            setTheme(initial);
            document.documentElement.dataset.theme = initial;
        }

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchTodos();
                setTodos(data);
            } catch (e) {
                setError('Failed to load todos. Is the server running?');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function toggleTheme() {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const created = await createTodo({ title: newTitle.trim() });
            setTodos(prev => [created, ...prev]);
            setNewTitle('');
        } catch (e) {
            setError('Failed to add todo');
        } finally {
            setLoading(false);
        }
    }

    async function toggleCompleted(todo) {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateTodo(todo._id, { completed: !todo.completed });
            setTodos(prev => prev.map(t => (t._id === updated._id ? updated : t)));
        } catch (e) {
            setError('Failed to update todo');
        } finally {
            setLoading(false);
        }
    }

    async function removeTodo(id) {
        setLoading(true);
        setError(null);
        try {
            await deleteTodo(id);
            setTodos(prev => prev.filter(t => t._id !== id));
        } catch (e) {
            setError('Failed to delete todo');
        } finally {
            setLoading(false);
        }
    }

    async function clearCompleted() {
        const completed = todos.filter(t => t.completed);
        if (completed.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            for (const t of completed) {
                // best-effort sequential deletes
                // ignoring errors per item to finish the sweep
                try { // eslint-disable-line no-empty
                    await deleteTodo(t._id);
                } catch {}
            }
            setTodos(prev => prev.filter(t => !t.completed));
        } catch (e) {
            setError('Failed to clear completed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="card">
                <header className="header">
                    <div className="brand">
                        <span className="logo" aria-hidden>✓</span>
                        <h1 className="title">Todo App</h1>
                    </div>
                    <div className="header-right">
                        <div className="stats">Pending: {pendingCount} · Total: {todos.length}</div>
                        <button type="button" className="button subtle theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                        </button>
                    </div>
                </header>

                <form onSubmit={handleAdd} className="form">
                    <input
                        className="input"
                        type="text"
                        placeholder="Add a new task"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button className="button primary" type="submit" disabled={loading || !newTitle.trim()}>
                        Add
                    </button>
                </form>

                <div className="toolbar">
                    <div className="filters">
                        <button type="button" className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button type="button" className={`chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
                        <button type="button" className={`chip ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
                    </div>
                    <button type="button" className="button subtle" onClick={clearCompleted} disabled={loading || todos.every(t => !t.completed)}>
                        Clear completed
                    </button>
                </div>

                {error && <div className="alert error">{error}</div>}
                {loading && <div className="alert">Loading…</div>}

                {shownTodos.length === 0 ? (
                    <div className="empty">
                        <div className="empty-icon">🗒️</div>
                        <div className="empty-text">No tasks here. Add something to get started!</div>
                    </div>
                ) : (
                    <ul className="list">
                        {shownTodos.map((todo) => (
                            <li key={todo._id} className="item">
                                <label className={`label ${todo.completed ? 'completed' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleCompleted(todo)}
                                    />
                                    <span className="text">{todo.title}</span>
                                </label>
                                <button className="icon-button danger" onClick={() => removeTodo(todo._id)} disabled={loading} aria-label="Delete">
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}


