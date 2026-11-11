// Compresses the raw demo videos in briefing/refs/videos into web-ready files in public/videos.
// - Vertical card videos  -> public/videos/cards/<name>.{mp4,jpg} (540px wide)
// - Workflow demo (16:9)  -> public/videos/workflows.{mp4,jpg}   (1920px wide, higher quality: UI text must stay legible)
// Audio is always stripped. Run with: npm run videos
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import ffmpeg from 'ffmpeg-static';

const SRC = 'briefing/refs/videos';
const OUT = 'public/videos';
const CARDS = join(OUT, 'cards');
const WORKFLOW_NAMES = ['workflows', 'workflow', 'automate'];

mkdirSync(CARDS, { recursive: true });

function run(args) {
  const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
}

function duration(input) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-i', input], { encoding: 'utf8' });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr ?? '');
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
}

/** fade = seconds of fade from/to black at both ends, so a loop's seam reads as a soft cut */
function encode(input, outBase, width, crf, fade = 0) {
  const scale = `scale=${width}:-2:flags=lanczos`;
  const d = fade ? duration(input) : 0;
  const vf = d > fade * 4 ? `${scale},fade=t=in:st=0:d=${fade},fade=t=out:st=${(d - fade).toFixed(2)}:d=${fade}` : scale;
  run(['-i', input, '-an', '-vf', vf, '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
       '-crf', String(crf), '-preset', 'slow', '-movflags', '+faststart', `${outBase}.mp4`]);
  run(['-ss', '1', '-i', input, '-frames:v', '1', '-vf', scale, '-q:v', '4', `${outBase}.jpg`]);
}

const files = readdirSync(SRC).filter((f) => ['.mp4', '.mov', '.webm', '.m4v'].includes(extname(f).toLowerCase()));
if (!files.length) {
  console.log(`No videos found in ${SRC}`);
  process.exit(0);
}

for (const f of files) {
  const name = basename(f, extname(f));
  const isWorkflow = WORKFLOW_NAMES.includes(name.toLowerCase());
  const outBase = isWorkflow ? join(OUT, 'workflows') : join(CARDS, name);
  if (existsSync(`${outBase}.mp4`) && !process.argv.includes('--force')) {
    console.log(`skip  ${f} (already encoded; use --force to redo)`);
    continue;
  }
  console.log(`encode ${f} -> ${outBase}.*`);
  if (isWorkflow) encode(join(SRC, f), outBase, 1920, 23, 0.5);
  else encode(join(SRC, f), outBase, 540, 27);
  const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2);
  console.log(`  mp4 ${mb(`${outBase}.mp4`)} MB`);
}
