import { useState } from 'react';
import { z } from 'zod';

const sanitizeText = (value) => value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();

const reportSchema = z.object({
  reporterName: z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().min(1, 'Reporter is required').max(80, 'Reporter is too long')),
  message: z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().max(500, 'Message is too long'))
    .optional()
    .default(''),
});

export default function ReportDownForm({ onSubmit }) {
  const [reporterName, setReporterName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const parsed = reportSchema.safeParse({ reporterName, message });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setError('');
    onSubmit(parsed.data);
    setMessage('');
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Signal site as down</h3>
      {error && <p className="error">{error}</p>}
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

