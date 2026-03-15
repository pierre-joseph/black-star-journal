import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When run from repo root (npm postinstall), node_modules is at root
const pdfjsDistPath = path.resolve(__dirname, '..', 'node_modules', 'pdfjs-dist');
const publicPath = path.resolve(__dirname, 'public');

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true, force: true });
  console.log(`Copied ${path.basename(sourceDir)} -> ${targetDir}`);
}

async function copyWasmFiles(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  const wasmFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.wasm'))
    .map((entry) => entry.name);

  for (const fileName of wasmFiles) {
    const from = path.join(sourceDir, fileName);
    const to = path.join(targetDir, fileName);
    await cp(from, to, { force: true });
    console.log(`Copied ${fileName} -> ${targetDir}`);
  }
}

async function main() {
  if (!(await exists(pdfjsDistPath))) {
    console.warn('pdfjs-dist not found. Skipping PDF asset copy.');
    return;
  }

  await copyDirectory(
    path.join(pdfjsDistPath, 'cmaps'),
    path.join(publicPath, 'cmaps'),
  );

  await copyDirectory(
    path.join(pdfjsDistPath, 'standard_fonts'),
    path.join(publicPath, 'standard_fonts'),
  );

  await copyWasmFiles(
    path.join(pdfjsDistPath, 'wasm'),
    path.join(publicPath, 'pdfjs'),
  );

  console.log('PDF.js assets are ready.');
}

main().catch((error) => {
  console.error('Failed to copy PDF.js assets:', error);
  process.exitCode = 1;
});
