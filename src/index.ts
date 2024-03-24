import createLogger from 'hexo-log';
import { StoreFunctionData } from 'hexo/dist/extend/renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type Hexo from 'hexo';
import { convertPdfToHtml } from './convert';

const logger = createLogger();

interface Config {
  args: string[];
  wrapWithIframe: boolean;
  wrapHtml: string;
}

const config: Config = Object.assign(
  {
    args: ['--process-outline', '0'],
    wrapWithIframe: true,
    wrapHtml: `<html>
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
  </html>`,
  },
  hexo.config.render_pdf
);

export async function pdfRenderer(
  data: StoreFunctionData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  options: object
): Promise<string | void> {
  if (!data.path) {
    logger.error('No path provided for rendering PDF');
    throw Error('No path provided for rendering PDF');
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger.info(`Rendering PDF: ${data.path}`);

  // random outPath
  const outPath = `temp-${Math.random().toString(36).substring(7)}.html`;
  try {
    return await convertPdfToHtml(
      data.path,
      outPath,
      config.args,
      config.wrapWithIframe,
      config.wrapHtml
    );
  } catch (error) {
    logger.error(error);
  }
}

// Disable Nunjucks rendering
pdfRenderer.disableNunjucks = true;

// Register the renderer
// eslint-disable-next-line @typescript-eslint/no-misused-promises
hexo.extend.renderer.register('pdf', 'html', pdfRenderer);
