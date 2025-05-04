import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPageContent } from './server/template.service';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Add request logging middleware
app.use((req, res, next) => {
  console.log('\n[HOST] ===========================================');
  console.log(`[HOST] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('[HOST] ===========================================\n');
  next();
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Template retrieval endpoint
 */
app.get('/api/page/:slug', async (req, res) => {
  try {
    console.log('[HOST] Template request received:', {
      slug: req.params.slug,
      url: req.url
    });

    const pageData = await getPageContent(req.params.slug);

    console.log('[HOST] Retrieved page data:', {
      slug: req.params.slug,
      hasContent: !!pageData?.content,
      contentLength: pageData?.content?.length
    });

    if (!pageData) {
      res.status(404).json({ error: 'Page not found' });
    } else {
      res.json(pageData);
    }
  } catch (err) {
    console.error('[HOST] Error fetching page:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', async (req, res, next) => {
  const response = await angularApp.handle(req, {
    bootstrap: true
  });

  if (response) {
    writeResponseToNodeResponse(response, res);
  } else {
    next();
  }
});

/**
 * Start the server if this module is the main entry point.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4200;
  app.listen(port, () => {
    console.log('\n[HOST] ===========================================');
    console.log(`[HOST] Server started at ${new Date().toISOString()}`);
    console.log(`[HOST] Listening on http://localhost:${port}`);
    console.log('[HOST] ===========================================\n');
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
