import { useState } from 'react';

export default function ReportDownForm({ onSubmit }) {
  const [reporterName, setReporterName] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ reporterName, message });
    setMessage('');
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Signal site as down</h3>
      <label>
        Reporter
        <input
          value={reporterName}
          onChange={(event) => setReporterName(event.target.value)}
          required
        />
      </label>
      <label>
        Message (optional)
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      <button type="submit">Send report</button>
    </form>
  );
}

