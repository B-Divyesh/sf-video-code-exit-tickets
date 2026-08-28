export const ALLOWED_TEMPLATES = ['javascript-console-v1'] as const;
export type SandboxTemplate = (typeof ALLOWED_TEMPLATES)[number];

export interface Checkpoint {
  id: string;
  at: number;
  prompt: string;
  template: SandboxTemplate;
  starterCode: string;
  expectedOutput: string;
}

export interface LessonManifest {
  version: 1;
  title: string;
  checkpoints: Checkpoint[];
}

export type ManifestResult =
  | { ok: true; manifest: LessonManifest }
  | { ok: false; message: string };

export function validateManifest(value: unknown): ManifestResult {
  if (!value || typeof value !== 'object') return fail('The checkpoint manifest is not an object.');
  const record = value as Record<string, unknown>;
  if (record.version !== 1) return fail('The checkpoint manifest needs version 1.');
  if (typeof record.title !== 'string' || !record.title.trim()) return fail('The checkpoint manifest needs a lesson title.');
  if (!Array.isArray(record.checkpoints) || record.checkpoints.length === 0) return fail('The checkpoint manifest needs at least one checkpoint.');

  const ids = new Set<string>();
  for (const [index, raw] of record.checkpoints.entries()) {
    if (!raw || typeof raw !== 'object') return fail(`Checkpoint ${index + 1} is not valid.`);
    const item = raw as Record<string, unknown>;
    if (typeof item.id !== 'string' || !item.id.trim()) return fail(`Checkpoint ${index + 1} needs an id.`);
    if (ids.has(item.id)) return fail(`Checkpoint id “${item.id}” appears twice.`);
    ids.add(item.id);
    if (typeof item.at !== 'number' || !Number.isFinite(item.at) || item.at < 0) return fail(`Checkpoint “${item.id}” needs a valid time.`);
    if (typeof item.prompt !== 'string' || !item.prompt.trim()) return fail(`Checkpoint “${item.id}” needs a prompt.`);
    if (!ALLOWED_TEMPLATES.includes(item.template as SandboxTemplate)) return fail(`Checkpoint “${item.id}” uses a template that is not allowed.`);
    if (typeof item.starterCode !== 'string') return fail(`Checkpoint “${item.id}” needs starter code.`);
    if (typeof item.expectedOutput !== 'string') return fail(`Checkpoint “${item.id}” needs expected output.`);
  }
  const checkpoints = [...(record.checkpoints as Checkpoint[])].sort((a, b) => a.at - b.at);
  return { ok: true, manifest: { version: 1, title: record.title.trim(), checkpoints } };
}

function fail(message: string): ManifestResult {
  return { ok: false, message };
}

export const SAMPLE_MANIFEST: LessonManifest = {
  version: 1,
  title: 'JavaScript arrays: change before moving on',
  checkpoints: [
    {
      id: 'double-prices',
      at: 47,
      prompt: 'Change the multiplier so the output is 6, 10, 14.',
      template: 'javascript-console-v1',
      starterCode: "const prices = [3, 5, 7];\nconst doubled = prices.map(price => price * 1);\nconsole.log(doubled.join(', '));",
      expectedOutput: '6, 10, 14'
    }
  ]
};
