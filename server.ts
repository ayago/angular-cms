import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import { getPageContent } from './server/mongo.service';

const app = express();
const DIST_FOLDER = join(process.cwd(), 'dist/client/browser');

// Angular Universal engine
app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*', async (req, res) => {
    const slug = req.path === '/' ? 'home' : req.path.substring(1);
    const pageData = await getPageContent(slug);
    if (!pageData) return res.status(404).send('Page not found');

    return res.render('index', { req, res, providers: [{ provide: 'PAGE_DATA', useValue: pageData }] });
  });

app.listen(4200, () => {
  console.log('Node server listening on http://localhost:4200');
});
