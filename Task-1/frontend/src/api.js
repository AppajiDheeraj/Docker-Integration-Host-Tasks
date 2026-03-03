const API_URL = import.meta.env.VITE_API_URL;

export const todoAPI = {
  async getAll() {
    const res = await fetch(`${API_URL}/todos/`);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  },

  async create(content, status = 'pending') {
    const res = await fetch(`${API_URL}/todos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, status })
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${API_URL}/todos/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_URL}/todos/${id}/`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete todo');
  }
};
