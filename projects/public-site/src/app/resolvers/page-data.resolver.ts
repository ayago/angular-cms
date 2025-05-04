import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import fetch from 'node-fetch';

const PAGE_DATA_KEY = makeStateKey<any>('PAGE_DATA');

export const pageDataResolver: ResolveFn<any> = async (route) => {
  console.log('[RESOLVER] Page data resolver called');

  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);

  // Get slug from route params or default to 'home'
  const slug = route.params['slug'] || 'home';

  if (isPlatformBrowser(platformId)) {
    console.log('[RESOLVER] Running on client side');

    // Check TransferState first
    const cachedData = transferState.get(PAGE_DATA_KEY, null);
    if (cachedData) {
      console.log('[RESOLVER] Retrieved page data from TransferState:', {
        slug,
        hasContent: !!cachedData?.content,
        contentLength: cachedData?.content?.length
      });
      return cachedData;
    }

    console.log('[RESOLVER] No data found in TransferState, fetching from API');
  }

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

    // Store in TransferState if on server
    if (isPlatformServer(platformId)) {
      console.log('[RESOLVER] Storing page data in TransferState');
      transferState.set(PAGE_DATA_KEY, pageData);
    }

    return pageData;
  } catch (error) {
    console.error('[RESOLVER] Error retrieving page data:', error);
    const errorData = {
      content: '<h1>Error Loading Page</h1>',
      slug,
      title: 'Error'
    };

    // Store error state in TransferState if on server
    if (isPlatformServer(platformId)) {
      transferState.set(PAGE_DATA_KEY, errorData);
    }

    return errorData;
  }
};
