const APP_SHELL = '/index.html';

function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
}

export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response('Static asset binding is unavailable.', { status: 500 });
    }

    const pathname = new URL(request.url).pathname;
    const candidates = pathname === '/'
      ? [APP_SHELL]
      : [
          pathname,
          pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}/index.html`,
          pathname.endsWith('.html') ? pathname : `${pathname}.html`,
        ];

    for (const candidate of candidates) {
      const response = await env.ASSETS.fetch(assetRequest(request, candidate));
      if (response.status !== 404) return response;
    }

    return env.ASSETS.fetch(assetRequest(request, APP_SHELL));
  },
};
