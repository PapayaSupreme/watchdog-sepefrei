import { describe, expect, it } from 'vitest';
import { evaluateOutageTransition } from '../src/services/outageService.js';

describe('outageService', () => {
  it('detects outage start', () => {
    expect(evaluateOutageTransition('up', 'down')).toBe('start');
    expect(evaluateOutageTransition('up', 'timeout')).toBe('start');
  });

  it('detects outage end', () => {
    expect(evaluateOutageTransition('down', 'up')).toBe('end');
    expect(evaluateOutageTransition('error', 'up')).toBe('end');
  });

  it('ignores same-state transitions', () => {
    expect(evaluateOutageTransition('up', 'up')).toBe('none');
    expect(evaluateOutageTransition('down', 'error')).toBe('none');
  });
});

