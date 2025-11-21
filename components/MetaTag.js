import Head from "next/head";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prism-photo.com";
const siteTitle = "Prism Photo - Photobooth Online | Chụp ảnh kỷ niệm đẹp";
const siteDescription =
  "Prism Photo - Ứng dụng photobooth online miễn phí. Chụp 8 ảnh, thêm frame và filter đẹp mắt, tải về hoặc gửi qua email. Tạo kỷ niệm đẹp ngay hôm nay!";
const siteImage = `${siteUrl}/thumb.jpg`;

export default function MetaTag() {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content="photobooth, chụp ảnh online, filter ảnh, frame ảnh, kỷ niệm" />
      <meta name="author" content="Prism Photo" />
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Prism Photo" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />

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

      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Microsoft */}
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

      {/* Theme Color */}
      <meta name="theme-color" content="#805AD5" />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}

