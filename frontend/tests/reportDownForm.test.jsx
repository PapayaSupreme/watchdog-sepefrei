import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReportDownForm from '../src/components/ReportDownForm.jsx';

describe('ReportDownForm', () => {
  it('submits incident report payload', () => {
    const onSubmit = vi.fn();

    render(<ReportDownForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Reporter'), {
      target: { value: 'Nina' },
    });
    fireEvent.change(screen.getByLabelText('Message (optional)'), {
      target: { value: 'HTTP 500 observed' },
    });
    fireEvent.click(screen.getByText('Send report'));

    expect(onSubmit).toHaveBeenCalledWith({
      reporterName: 'Nina',
      message: 'HTTP 500 observed',
    });
  });
});

