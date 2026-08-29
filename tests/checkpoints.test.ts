import { describe, expect, it } from 'vitest';
import { SAMPLE_MANIFEST, validateManifest } from '../shared/checkpoints';

describe('checkpoint manifest validation', () => {
  it('@claim:checkpoint-sorting sorts valid checkpoints by time', () => {
    const input = structuredClone(SAMPLE_MANIFEST);
    input.checkpoints.push({ ...input.checkpoints[0], id: 'earlier-checkpoint', at: 12 });
    const result = validateManifest(input);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.manifest.checkpoints.map(item => item.id)).toEqual(['earlier-checkpoint', 'double-prices']);
  });

  it('@claim:template-allowlist rejects an unknown sandbox template', () => {
    const input = structuredClone(SAMPLE_MANIFEST) as unknown as { checkpoints: Array<{ template: string }> };
    input.checkpoints[0].template = 'remote-python';
    const result = validateManifest(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain('not allowed');
  });

  it('@claim:unique-checkpoint-ids rejects duplicate IDs', () => {
    const input = structuredClone(SAMPLE_MANIFEST);
    input.checkpoints.push(structuredClone(input.checkpoints[0]));
    const result = validateManifest(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain('appears twice');
  });
});
