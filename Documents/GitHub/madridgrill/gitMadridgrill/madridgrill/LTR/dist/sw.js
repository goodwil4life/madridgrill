importScripts('sw-toolbox.js');

const config = {
	offlinePage: 'offline.html'
};

config.filesToCache = [
	'/tasty/LTR/dist/',
	'/tasty/LTR/dist/index.html',
	'/tasty/LTR/dist/about-us.html',
	'/tasty/LTR/dist/blog.html',
	'/tasty/LTR/dist/blog-detail-carousel-post.html',
	'/tasty/LTR/dist/blog-detail-video-post.html',
	'/tasty/LTR/dist/blog-detail-twitter-post.html',
	'/tasty/LTR/dist/blog-detail-sample-post.html',
	'/tasty/LTR/dist/contact.html',
	'/tasty/LTR/dist/services.html',
	'/tasty/LTR/dist/_comment_form.html',
	'/tasty/LTR/dist/_contact_form.html',
	'/tasty/LTR/dist/feature-accordion.html',
	'/tasty/LTR/dist/feature-ad.html',
	'/tasty/LTR/dist/feature-anim.html',
	'/tasty/LTR/dist/feature-audio.html',
	'/tasty/LTR/dist/feature-blog-post-carousel.html',
	'/tasty/LTR/dist/feature-brightcove.html',
	'/tasty/LTR/dist/feature-button.html',
	'/tasty/LTR/dist/feature-carousel.html',
	'/tasty/LTR/dist/feature-dailymotion.html',
	'/tasty/LTR/dist/feature-facebook.html',
	'/tasty/LTR/dist/feature-grid.html',
	'/tasty/LTR/dist/feature-icons.html',
	'/tasty/LTR/dist/feature-icon-info-box.html',
	'/tasty/LTR/dist/feature-iframe.html',
	'/tasty/LTR/dist/feature-image.html',
	'/tasty/LTR/dist/feature-image-lightbox.html',
	'/tasty/LTR/dist/feature-instagram.html',
	'/tasty/LTR/dist/feature-lightbox.html',
	'/tasty/LTR/dist/feature-pinterest.html',
	'/tasty/LTR/dist/feature-social-share.html',
	'/tasty/LTR/dist/feature-soundcloud.html',
	'/tasty/LTR/dist/feature-table-responsive.html',
	'/tasty/LTR/dist/feature-twitter.html',
	'/tasty/LTR/dist/feature-user-notification.html',
	'/tasty/LTR/dist/feature-video.html',
	'/tasty/LTR/dist/feature-vimeo.html',
	'/tasty/LTR/dist/feature-vine.html',
	'/tasty/LTR/dist/feature-youtube.html',

	'/tasty/LTR/dist/manifest.json',
	'/tasty/LTR/dist/assets/img/favicons/apple-touch-icon.png',
	'/tasty/LTR/dist/assets/img/favicons/favicon-32x32.png',
	'/tasty/LTR/dist/assets/img/favicons/favicon-16x16.png',
	'/tasty/LTR/dist/assets/img/favicons/safari-pinned-tab.svg',
	'/tasty/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-1536x2008.png',
	'/tasty/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-1242x2148.png',
	'/tasty/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-750x1294.png',
	'/tasty/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-640x1096.png',

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