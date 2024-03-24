import createLogger from 'hexo-log';
import { StoreFunctionData } from 'hexo/dist/extend/renderer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type Hexo from 'hexo';
import { convertPdfToHtml } from './convert';

const logger = createLogger();

interface Config {
  args: string[];
}

const config: Config = Object.assign(
  {
    args: [],
  },
  hexo.config.render_pdf
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
export function pdfRenderer(data: StoreFunctionData, options: object): any {
  if (!data.path) {
    logger.error('No path provided for rendering PDF');
    throw Error('No path provided for rendering PDF');
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger.info(`Rendering PDF: ${data.path}`);

  const outPath = 'temp.html';
  return convertPdfToHtml(data.path, outPath, config.args);
}

// Disable Nunjucks rendering
pdfRenderer.disableNunjucks = true;

// Register the renderer
hexo.extend.renderer.register('pdf', 'html', pdfRenderer, true);
