import 'zone.js/node';
import * as express from 'express';
import { join } from 'path';
import { getPageContent } from './src/server/template.service';
import { existsSync, readFileSync } from 'fs';
import { renderApplication } from '@angular/platform-server';
import { AppComponent } from './src/app/app.component';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

const distFolder = join(process.cwd(), 'dist/public-site/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html'))
  ? 'index.original.html'
  : 'index.html';

const documentHtml = readFileSync(join(distFolder, indexHtml), 'utf-8');

const port = process.env['PORT'] || 4200;
const app = express();

app.get(
  '*.*',
  express.static(distFolder, {
    maxAge: '1y',
  })
);

app.get('*', async (req, res) => {
  try {
    const slug = req.path === '/' ? 'home' : req.path.substring(1);
    const pageData = await getPageContent(slug);
    if (!pageData) {
      return res.status(404).send('Page not found');
    }

    const html = await renderApplication(
      () => bootstrapApplication(AppComponent, {
          providers: [
            provideServerRendering(),
            provideRouter([]),
            { provide: APP_BASE_HREF, useValue: req.baseUrl },
            { provide: 'PAGE_DATA', useValue: pageData },
          ],
      }),
      { document: documentHtml, url: req.url }
    );

    return res.status(200).send(html);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`✅ SSR server running on http://localhost:${port}`);
});
