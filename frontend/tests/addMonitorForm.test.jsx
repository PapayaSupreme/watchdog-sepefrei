import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/api/client.js', () => ({
  api: {
    getMonitors: vi.fn().mockResolvedValue([]),
  },
}));

import DashboardPage from '../src/pages/DashboardPage.jsx';

describe('Dashboard without add monitor flow', () => {
  it('does not render create monitor controls', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Monitored sites')).toBeInTheDocument();
    });

    expect(screen.queryByText('Create monitor')).not.toBeInTheDocument();
  });
});

