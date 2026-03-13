import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AddMonitorForm from '../src/components/AddMonitorForm.jsx';

describe('AddMonitorForm', () => {
  it('submits monitor payload', () => {
    const onSubmit = vi.fn();

    render(<AddMonitorForm onSubmit={onSubmit} loading={false} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Site A' },
    });
    fireEvent.change(screen.getByLabelText('URL'), {
      target: { value: 'https://example.com' },
    });
    fireEvent.change(screen.getByLabelText('Frequency (seconds)'), {
      target: { value: '30' },
    });
    fireEvent.click(screen.getByText('Create monitor'));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Site A',
      url: 'https://example.com',
      frequencySeconds: 30,
    });
  });
});

