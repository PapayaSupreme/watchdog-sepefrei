import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/api/client.js', () => ({
  api: {
    getMonitors: vi.fn().mockResolvedValue([
      { id: 1, name: 'SEPEFREI', url: 'https://sepefrei.fr', current_status: 'up' },
    ]),
    createMonitor: vi.fn(),
  },
}));

import DashboardPage from '../src/pages/DashboardPage.jsx';

describe('DashboardPage', () => {
  it('renders monitor list', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('SEPEFREI')).toBeInTheDocument();
    });
  });
});

