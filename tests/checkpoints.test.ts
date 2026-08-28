import { describe, expect, it } from 'vitest';
import { SAMPLE_MANIFEST, validateManifest } from '../shared/checkpoints';

describe('checkpoint manifest validation', () => {
  it('accepts and sorts the allowlisted sample', () => {
    const result = validateManifest(SAMPLE_MANIFEST);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.manifest.checkpoints[0].id).toBe('double-prices');
  });

  it('@claim:template-allowlist rejects an unknown sandbox template', () => {
    const input = structuredClone(SAMPLE_MANIFEST) as unknown as { checkpoints: Array<{ template: string }> };
    input.checkpoints[0].template = 'remote-python';
    const result = validateManifest(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain('not allowed');
  });

  it('rejects duplicate ids', () => {
    const input = structuredClone(SAMPLE_MANIFEST);
    input.checkpoints.push(structuredClone(input.checkpoints[0]));
    const result = validateManifest(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain('appears twice');
  });
});
