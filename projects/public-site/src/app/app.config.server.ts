import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import fetch from 'node-fetch';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    {
      provide: 'PAGE_DATA',
      useFactory:  () => {
        // console.log('[SERVER] PAGE_DATA provider factory called in app config');

        // // Get the current URL from the request
        // const req = (global as any).__REQUEST__;
        // if (!req) {
        //   console.warn('[SERVER] No request object found in global scope');
        //   return null;
        // }

        // const url = new URL(req.url, `http://${req.headers.host}`);
        // const slug = url.pathname.replace(/^\/+|\/+$/g, '') || 'home';

        // console.log('[SERVER] Retrieving page data for:', {
        //   url: req.url,
        //   slug
        // });

        // try {
        //   // Use the API endpoint instead of direct service call
        //   const apiUrl = new URL(`/api/page/${slug}`, `http://${req.headers.host}`);
        //   const response = await fetch(apiUrl.toString());

        //   if (!response.ok) {
        //     throw new Error(`API request failed with status ${response.status}`);
        //   }

        //   const pageData = await response.json();

        //   console.log('[SERVER] Retrieved page data from API:', {
        //     slug,
        //     hasContent: !!pageData?.content,
        //     contentLength: pageData?.content?.length
        //   });

        //   return pageData;
        // } catch (error) {
          // console.error('[SERVER] Error retrieving page data:', error);
          return {
            content: '<h1>Error Loading Page</h1>',
            slug: 'home',
            title: 'Error'
          };
        // }
      },
      deps: []
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
