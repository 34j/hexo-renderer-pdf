# hexo-renderer-pdf

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> My awesome module

## Install

```bash
wget -N https://github.com/pdf2htmlEX/pdf2htmlEX/releases/download/v0.18.8.rc1/pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb -O pdf2htmlEX.deb
sudo apt install ./pdf2htmlEX.deb
npm install hexo-renderer-pdf
```

## Usage

```yaml
render_pdf:
  args: ['--process-outline', '0'] # pdf2htmlEX additional arguments
  wrapWithIframe: true # Whether to wrap the pdf with an iframe
  wrapHtml: |
    <html>
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
    </html>
```

[build-img]:https://github.com/34j/hexo-renderer-pdf/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/34j/hexo-renderer-pdf/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/hexo-renderer-pdf
[downloads-url]:https://www.npmtrends.com/hexo-renderer-pdf
[npm-img]:https://img.shields.io/npm/v/hexo-renderer-pdf
[npm-url]:https://www.npmjs.com/package/hexo-renderer-pdf
[issues-img]:https://img.shields.io/github/issues/34j/hexo-renderer-pdf
[issues-url]:https://github.com/34j/hexo-renderer-pdf/issues
[codecov-img]:https://codecov.io/gh/34j/hexo-renderer-pdf/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/34j/hexo-renderer-pdf
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
