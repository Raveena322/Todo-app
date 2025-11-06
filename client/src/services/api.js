import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchTodos() {
    const res = await axios.get(`${API_BASE}/api/todos`);
    return res.data;
}

export async function createTodo(payload) {
    const res = await axios.post(`${API_BASE}/api/todos`, payload);
    return res.data;
}

export async function updateTodo(id, payload) {
    const res = await axios.put(`${API_BASE}/api/todos/${id}`, payload);
    return res.data;
}

export async function deleteTodo(id) {
    const res = await axios.delete(`${API_BASE}/api/todos/${id}`);
    return res.data;
}



