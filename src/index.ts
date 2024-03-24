import { spawnSync } from 'child_process';
import createLogger from 'hexo-log';
import { StoreFunctionData } from 'hexo/dist/extend/renderer';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type Hexo from 'hexo';

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
function pdfRenderer(data: StoreFunctionData, options: object): any {
  if (!data.path) {
    logger.error('No path provided for rendering PDF');
    throw Error('No path provided for rendering PDF');
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  logger.info(`Rendering PDF: ${data.path}`);

  // Run pdf2htmlEX
  const res = spawnSync(
    'pdf2htmlEX',
    config.args.concat([
      data.path,
      fs.mkdtempSync('pdf2htmlEX') + '/converted.html',
    ]),
    { encoding: 'utf8' }
  );

  if (res.error) {
    // Log the error
    logger.error(res.stderr);
    throw Error(res.stderr);
  } else {
    // Log the stderr output
    if (res.stderr) {
      logger.warn(res.stderr);
    }

    // Read converted HTML file
    const convertedHtml = fs.readFileSync('path/to/converted.html', 'utf8');

    // Return the processed HTML
    return convertedHtml;
  }
}

hexo.extend.renderer.register('pdf', 'html', pdfRenderer, true);
