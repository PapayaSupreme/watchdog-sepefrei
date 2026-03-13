import { spawn } from 'node:child_process';
const npmCliPath = process.env.npm_execpath;

if (!npmCliPath) {
  throw new Error('npm_execpath is not available; run this script via npm run.');
}

function runStep(label, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [npmCliPath, ...args], {
      stdio: 'inherit',
      cwd,
    });

    child.on('error', (error) => {
      reject(new Error(`${label} failed to start: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} failed with exit code ${code}`));
    });
  });
}

async function main() {
  const mode = process.argv[2] ?? 'all';

  if (mode === 'backend') {
    await runStep('backend tests', ['test'], 'backend');
    console.log('\nBackend tests passed.');
    return;
  }

  if (mode === 'frontend') {
    await runStep('frontend tests', ['test'], 'frontend');
    console.log('\nFrontend tests passed.');
    return;
  }

  await runStep('backend tests', ['test'], 'backend');
  await runStep('frontend tests', ['test'], 'frontend');
  console.log('\nAll frontend and backend tests passed.');
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});




