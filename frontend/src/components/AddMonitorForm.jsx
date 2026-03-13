import { useState } from 'react';

export default function AddMonitorForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    url: 'https://',
    frequencySeconds: 60,
  });

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      frequencySeconds: Number(form.frequencySeconds),
    });
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>Add monitor</h3>
      <label>
        Name
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
      </label>
      <label>
        URL
        <input
          value={form.url}
          onChange={(event) => setForm({ ...form, url: event.target.value })}
          required
        />
      </label>
      <label>
        Frequency (seconds)
        <input
          type="number"
          min="15"
          max="3600"
          value={form.frequencySeconds}
          onChange={(event) =>
            setForm({ ...form, frequencySeconds: event.target.value })
          }
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Create monitor'}
      </button>
    </form>
  );
}

