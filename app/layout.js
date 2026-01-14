import './globals.css'

export const metadata = {
  title: 'Hollywood Trivia - Test Your Movie Knowledge',
  description: 'The ultimate pop culture trivia game. Test your knowledge of movies, celebrities, and Hollywood!',
  keywords: ['trivia', 'movies', 'hollywood', 'quiz', 'game', 'pop culture'],
  authors: [{ name: 'Hollywood Trivia' }],
  openGraph: {
    title: 'Hollywood Trivia',
    description: 'Can you beat my score? Test your movie knowledge!',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hollywood Trivia',
    description: 'Can you beat my score? Test your movie knowledge!',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>{children}</body>
    </html>
  )
}
