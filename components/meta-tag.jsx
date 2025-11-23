import Head from "next/head";

export default function MetaTag({
  title = "Prismo Photo - Photobooth Online",
  description = "Prismo Photo - Dịch vụ photobooth online chuyên nghiệp. Tạo những bức ảnh đẹp và kỷ niệm đáng nhớ với công nghệ hiện đại.",
  image = "/thumb.jpg",
  keywords = "photobooth, online photobooth, prismo photo, ảnh kỷ niệm, chụp ảnh online",
  url,
}) {
  // Get base URL - can be passed as prop or will use relative path
  const baseUrl = url || (typeof window !== "undefined" ? window.location.origin : "");
  const imageUrl = image.startsWith("http") ? image : image.startsWith("/") ? `${baseUrl}${image}` : image;
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Prismo Photo" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta httpEquiv="Content-Language" content="vi" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Prismo Photo - Photobooth Online" />
      <meta property="og:site_name" content="Prismo Photo" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="Prismo Photo - Photobooth Online" />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />

      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link rel="apple-touch-icon" href="/apple-icon.png" />
      <link rel="apple-touch-icon" href="/apple-icon-precomposed.png" />

      {/* Android Icons */}
      <link rel="icon" type="image/png" sizes="36x36" href="/android-icon-36x36.png" />
      <link rel="icon" type="image/png" sizes="48x48" href="/android-icon-48x48.png" />
      <link rel="icon" type="image/png" sizes="72x72" href="/android-icon-72x72.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/android-icon-96x96.png" />
      <link rel="icon" type="image/png" sizes="144x144" href="/android-icon-144x144.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />

      {/* Microsoft Tiles */}
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <link rel="icon" type="image/png" sizes="70x70" href="/ms-icon-70x70.png" />
      <link rel="icon" type="image/png" sizes="150x150" href="/ms-icon-150x150.png" />
      <link rel="icon" type="image/png" sizes="310x310" href="/ms-icon-310x310.png" />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Theme Color */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-navbutton-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Head>
  );
}

