import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#5395FF" />
        <meta name="description" content="SmmNesia - Layanan Social Media terbaik dan terpercaya di Indonesia!" />
        <meta name="keywords" content="SMM, Smm Panel, Social Media, Followers, Likes, Shopee, TikTok, YouTube, Instagram" />
        <meta name="author" content="SmmNesia" />
        <meta name="csrf-token" content={process.env.CSRF_TOKEN || ''} />
        <link rel="icon" href="/favicon.avif" />
        <link rel="apple-touch-icon" href="/favicon.avif" />
      </Head>
      <body className="antialiased bg-[#DDEBFF] min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}