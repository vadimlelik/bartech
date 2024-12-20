'use client'

import { useEffect } from 'react'
import { Inter, Roboto } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/theme'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Box } from '@mui/material'
import CompareBar from '@/components/CompareBar'
import { metadata } from './metadata'
import Script from 'next/script'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
})

export default function RootLayout({ children }) {
    useEffect(() => {
        // Yandex.Metrika counter
        const script = document.createElement('script')
        script.innerHTML = `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(95649164, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true
            });
        `
        document.head.appendChild(script)

        return () => {
            document.head.removeChild(script)
        }
    }, [])

    return (
        <html lang="ru" className={roboto.className}>
            <head>
                <meta
                    name="description"
                    content="Купить технику в Минске с доставкой"
                />
                <meta
                    name="keywords"
                    content="техника, электроника, купить технику в минске, купить электронику в минске"
                />
                <meta name="author" content="Bartech" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="theme-color" content="#000000" />
                <meta name="robots" content="index, follow" />
                <meta
                    property="og:title"
                    content="Bartech - Интернет-магазин техники"
                />
                <meta
                    property="og:description"
                    content="Купить технику в Минске с доставкой"
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://bartech.by" />
                <meta
                    property="og:image"
                    content="https://bartech.by/logo.png"
                />
                <meta property="og:site_name" content="Bartech" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Bartech - Интернет-магазин техники"
                />
                <meta
                    name="twitter:description"
                    content="Купить технику в Минске с доставкой"
                />
                <meta
                    name="twitter:image"
                    content="https://bartech.by/logo.png"
                />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                            page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
            </head>
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100vh',
                        }}
                    >
                        <Header />
                        <Box component="main" sx={{ flex: 1 }}>
                            {children}
                        </Box>
                        <CompareBar />
                        <Footer />
                    </Box>
                </ThemeProvider>
                <noscript>
                    <div>
                        <img
                            src="https://mc.yandex.ru/watch/95649164"
                            style={{
                                position: 'absolute',
                                left: '-9999px',
                            }}
                            alt=""
                        />
                    </div>
                </noscript>
            </body>
        </html>
    )
}
