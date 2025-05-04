import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import fetch from 'node-fetch';

export const pageDataResolver: ResolveFn<any> = async (route) => {
  console.log('[RESOLVER] Page data resolver called');

  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    console.log('[RESOLVER] Running on server side');

    // Get slug from route params or default to 'home'
    const slug = route.params['slug'] || 'home';

    console.log('[RESOLVER] Retrieving page data for:', {
      slug
    });

    try {
      // Use the API endpoint with absolute URL
      const baseUrl = process.env['BASE_URL'] || 'http://localhost:4200';
      const response = await fetch(`${baseUrl}/api/page/${slug}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const pageData = await response.json();

      console.log('[RESOLVER] Retrieved page data from API:', {
        slug,
        hasContent: !!pageData?.content,
        contentLength: pageData?.content?.length
      });

      return pageData;
    } catch (error) {
      console.error('[RESOLVER] Error retrieving page data:', error);
      return {
        content: '<h1>Error Loading Page</h1>',
        slug,
        title: 'Error'
      };
    }
  }

  console.log('[RESOLVER] Running on client side');
  return null;
};
