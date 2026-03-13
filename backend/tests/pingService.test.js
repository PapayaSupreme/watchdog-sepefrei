import { afterEach, describe, expect, it, vi } from 'vitest';
import { pingUrl } from '../src/services/pingService.js';

describe('pingService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns up for successful requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200 });

    const result = await pingUrl('https://example.com', 1000);

    expect(result.status).toBe('up');
    expect(result.httpStatus).toBe(200);
  });

  it('returns error when request throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('DNS failed'));

    const result = await pingUrl('https://example.com', 1000);

    expect(result.status).toBe('error');
    expect(result.errorMessage).toContain('DNS failed');
  });
});

