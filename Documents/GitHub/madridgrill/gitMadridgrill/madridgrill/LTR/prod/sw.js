importScripts('sw-toolbox.js');

const config = {
	offlinePage: 'offline.html'
};

config.filesToCache = [
	'/themes/tasty/LTR/',
	'/themes/tasty/LTR/index.html',
	'/themes/tasty/LTR/about-us.html',
	'/themes/tasty/LTR/blog.html',
	'/themes/tasty/LTR/blog-detail-carousel-post.html',
	'/themes/tasty/LTR/blog-detail-video-post.html',
	'/themes/tasty/LTR/blog-detail-twitter-post.html',
	'/themes/tasty/LTR/blog-detail-sample-post.html',
	'/themes/tasty/LTR/contact.html',
	'/themes/tasty/LTR/services.html',
	'/themes/tasty/LTR/_comment_form.html',
	'/themes/tasty/LTR/_contact_form.html',
	'/themes/tasty/LTR/feature-accordion.html',
	'/themes/tasty/LTR/feature-ad.html',
	'/themes/tasty/LTR/feature-anim.html',
	'/themes/tasty/LTR/feature-audio.html',
	'/themes/tasty/LTR/feature-blog-post-carousel.html',
	'/themes/tasty/LTR/feature-brightcove.html',
	'/themes/tasty/LTR/feature-button.html',
	'/themes/tasty/LTR/feature-carousel.html',
	'/themes/tasty/LTR/feature-dailymotion.html',
	'/themes/tasty/LTR/feature-facebook.html',
	'/themes/tasty/LTR/feature-grid.html',
	'/themes/tasty/LTR/feature-icons.html',
	'/themes/tasty/LTR/feature-icon-info-box.html',
	'/themes/tasty/LTR/feature-iframe.html',
	'/themes/tasty/LTR/feature-image.html',
	'/themes/tasty/LTR/feature-image-lightbox.html',
	'/themes/tasty/LTR/feature-instagram.html',
	'/themes/tasty/LTR/feature-lightbox.html',
	'/themes/tasty/LTR/feature-pinterest.html',
	'/themes/tasty/LTR/feature-social-share.html',
	'/themes/tasty/LTR/feature-soundcloud.html',
	'/themes/tasty/LTR/feature-table-responsive.html',
	'/themes/tasty/LTR/feature-twitter.html',
	'/themes/tasty/LTR/feature-user-notification.html',
	'/themes/tasty/LTR/feature-video.html',
	'/themes/tasty/LTR/feature-vimeo.html',
	'/themes/tasty/LTR/feature-vine.html',
	'/themes/tasty/LTR/feature-youtube.html',

	'/themes/tasty/LTR/manifest.json',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/favicons/apple-touch-icon.png',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/favicons/favicon-32x32.png',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/favicons/favicon-16x16.png',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/favicons/safari-pinned-tab.svg',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/splashScreens/apple-touch-startup-image-1536x2008.png',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/splashScreens/apple-touch-startup-image-1242x2148.png',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/splashScreens/apple-touch-startup-image-750x1294.png',
	'/themes/tasty/LTR/https://img.mobius.studio/themes/tasty/LTR/assets/img/splashScreens/apple-touch-startup-image-640x1096.png',

	'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
];

/**
 * Generates a placeholder SVG image of the given size.
 */
function offlineImage(name, width, height) {
	return `<?xml version="1.0"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <g fill="none" fill-rule="evenodd"><path fill="#F8BBD0" d="M0 0h${width}v${height}H0z"/></g>
  <text text-anchor="middle" x="${Math.floor(width / 2)}" y="${Math.floor(height / 2)}">image offline (${name})</text>
<style><![CDATA[
text{
  font: 48px Roboto,Verdana, Helvetica, Arial, sans-serif;
}
]]></style>
</svg>`;
}

/**
 * Returns true if the Accept header contains the given content type string.
 */
function requestAccepts(request, contentType) {
	return request.headers.get('Accept').indexOf(contentType) != -1;
}

/**
 * ampbyexample.com fetch handler:
 *
 * - one-behind caching
 * - shows offline page
 * - generates placeholder image for unavailable images
 */
function ampByExampleHandler(request, values) {
	/* for samples show offline page if offline and samples are not cached */
	if (requestAccepts(request, 'text/html')) {
		return toolbox.fastest(request, values).catch(function () {
			return toolbox.cacheOnly(new Request(config.offlinePage), values);
		});
	}
	/* always try to load images from the cache first */
	/* fallback to placeholder SVG image if offline and image not available */
	if (requestAccepts(request, 'image/')) {
		return toolbox.cacheFirst(request, values).catch(function () {
			const url = request.url;
			const fileName = url.substring(url.lastIndexOf('/') + 1);
			/* TODO use correct image dimensions */
			return new Response(offlineImage(fileName, 1080, 610),
				{headers: {'Content-Type': 'image/svg+xml'}}
			);
		});
	} else {
		/* cache all other requests */
		return toolbox.fastest(request, values);
	}
}

toolbox.options.debug = false;
toolbox.router.default = toolbox.networkOnly;
toolbox.router.get('/(.*)', ampByExampleHandler, {origin: self.location.origin});
toolbox.router.get('/(.*)', toolbox.fastest, {origin: 'https://cdn.ampproject.org'});

toolbox.precache(config.filesToCache);