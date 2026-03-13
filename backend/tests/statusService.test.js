import { describe, expect, it } from 'vitest';
import { classifyHttpStatus, isDownState } from '../src/services/statusService.js';

describe('statusService', () => {
  it('classifies 2xx and 3xx as up', () => {
    expect(classifyHttpStatus(200)).toBe('up');
    expect(classifyHttpStatus(302)).toBe('up');
  });

  it('classifies 4xx and 5xx as down', () => {
    expect(classifyHttpStatus(404)).toBe('down');
    expect(classifyHttpStatus(503)).toBe('down');
  });

  it('detects down states', () => {
    expect(isDownState('down')).toBe(true);
    expect(isDownState('timeout')).toBe(true);
    expect(isDownState('error')).toBe(true);
    expect(isDownState('up')).toBe(false);
  });
});

