import { spawnSync } from 'child_process';
import createLogger from 'hexo-log';
import fs from 'fs';

const logger = createLogger();

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function convertPdfToHtml(
  inPath: string,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  outPath: string = 'temp.html',
  args: string[] = [],
  wrapWithIframe = true
): string | void {
  // Run pdf2htmlEX
  const useWsl = process.platform === 'win32';

  logger.info(`Using ${useWsl ? 'WSL' : 'native'} pdf2htmlEX`);

  if (useWsl) {
    // wsl path
    inPath = spawnSync('wsl', ['-e', 'wslpath', inPath], {
      encoding: 'utf8',
    }).stdout.trim();
  }

  // Prepare arguments
  args = ['pdf2htmlEX'].concat(args);
  args = args.concat([inPath, outPath]);
  if (useWsl) {
    args = ['wsl', '-e'].concat(args);
  }

  logger.info(`Running: ${args.join(' ')}`);

  // Run pdf2htmlEX
  const res = spawnSync(args[0], args.slice(1), { encoding: 'utf8' });
  if (res.error) {
    // Log the error
    logger.error(res.error);
    throw Error(res.error.message);
  } else {
    // Log the stderr output
    if (res.stderr) {
      logger.warn(res.stderr);
    }
  }

  // Read converted HTML file
  const convertedHtml = fs.readFileSync(outPath, 'utf8');

  // Return the processed HTML
  if (!wrapWithIframe) {
    return convertedHtml;
  }
  return (
    "<html><head><style>body{margin:0;overflow:hidden;}</style></head><body><iframe srcdoc='" +
    escapeHtml(convertedHtml + '') +
    "' style='display:block; border:none; height:100vh; width:100%;'></iframe></body></html>"
  );
}
