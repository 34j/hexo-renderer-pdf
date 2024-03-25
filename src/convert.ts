import createLogger from 'hexo-log';
import { promises as fs } from 'fs';
import util from 'util';
import { PDFDocument } from 'pdf-lib';
import spawnAsync from '@expo/spawn-async';
import { spawnSync } from 'child_process';

const logger = createLogger();

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function convertPdfToHtml(
  inPath: string,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  outPath: string = 'temp.html',
  args: string[] = ['--process-outline', '0'],
  wrapWithIframe = true,
  wrapHtml = `<html>
  <head>
      <style>body{margin:0;overflow:hidden;}</style>
      <style>::-webkit-scrollbar{display:none;}</style>
      <title>%s</title>
      <meta charset='utf-8'>
      <meta name="description" content="%s">
      <meta name="keywords" content="%s">
      <meta name="author" content="%s">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
      <iframe scrolling="no" style='overflow:hidden; display:block; border:none; height:100vh; width:100%;' srcdoc='%s'></iframe>
  </body>
</html>`
): Promise<string> {
  // Run pdf2htmlEX
  const useWsl = process.platform === 'win32';

  logger.info(`Using ${useWsl ? 'WSL' : 'native'} pdf2htmlEX`);

  let passInPath = inPath;
  if (useWsl) {
    // wsl path
    passInPath = (
      await spawnAsync('wsl', ['-e', 'wslpath', inPath], {
        // @ts-ignore
        encoding: 'utf8',
      })
    ).stdout.trim();
  }

  // Prepare arguments
  args = ['pdf2htmlEX'].concat(args);
  args = args.concat([passInPath, outPath]);
  if (useWsl) {
    args = ['wsl', '-e'].concat(args);
  }

  logger.info(`Running: ${args.join(' ')}`);

  // Run pdf2htmlEX
  try {
    // @ts-ignore
    const res = await spawnAsync(args[0], args.slice(1), { encoding: 'utf8' });
    if (res.stderr) {
      logger.warn(res.stderr);
    }
  } catch (e) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`${e.stdout}${e.stderr}`);
    throw e;
  }

  // Read converted HTML file
  const convertedHtml = await fs.readFile(outPath, 'utf8');

  // Remove the temporary file
  await fs.unlink(outPath);

  // Read metadata
  let title = '';
  let description = '';
  let author = '';
  let keywords = '';
  try {
    const arrayBuffer = await fs.readFile(inPath);
    const pdf = await PDFDocument.load(arrayBuffer);
    title = pdf.getTitle() || '';
    description = pdf.getSubject() || '';
    author = pdf.getAuthor() || '';
    keywords = pdf.getKeywords() || '';
  } catch (e) {
    logger.warn('Failed to read PDF metadata.');
    logger.warn(e);
  }

  // Return the processed HTML
  if (!wrapWithIframe) {
    return convertedHtml;
  }
  return util.format(
    wrapHtml,
    title,
    description,
    keywords,
    author,
    escapeHtml(convertedHtml)
  );
}
