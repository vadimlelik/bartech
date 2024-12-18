'use client'
import { useEffect } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Box } from '@mui/material'
import { Roboto } from 'next/font/google'
import { metadata } from './metadata'
import Script from 'next/script'

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['300', '400', '700'],
	style: ['normal'],
	display: 'swap',
})

const inter = Inter({ subsets: ['latin'] })

const Analytics = () => {
	useEffect(() => {
		// TikTok Pixel
		if (typeof window !== 'undefined') {
			;(function (w, d, t) {
				w.TiktokAnalyticsObject = t
				var ttq = (w[t] = w[t] || [])
				ttq.methods = [
					'page',
					'track',
					'identify',
					'instances',
					'debug',
					'on',
					'off',
					'once',
					'ready',
					'alias',
					'group',
					'enableCookie',
					'disableCookie',
					'holdConsent',
					'revokeConsent',
					'grantConsent',
				]
				ttq.setAndDefer = function (t, e) {
					t[e] = function () {
						t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
					}
				}
				for (var i = 0; i < ttq.methods.length; i++)
					ttq.setAndDefer(ttq, ttq.methods[i])
				ttq.instance = function (t) {
					for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
						ttq.setAndDefer(e, ttq.methods[n])
					return e
				}
				ttq.load = function (e, n) {
					var r = 'https://analytics.tiktok.com/i18n/pixel/events.js'
					var o = n && n.partner
					ttq._i = ttq._i || {}
					ttq._i[e] = []
					ttq._i[e]._u = r
					ttq._t = ttq._t || {}
					ttq._t[e] = +new Date()
					ttq._o = ttq._o || {}
					ttq._o[e] = n || {}
					var script = d.createElement('script')
					script.type = 'text/javascript'
					script.async = true
					script.src = r + '?sdkid=' + e + '&lib=' + t
					var firstScript = d.getElementsByTagName('script')[0]
					firstScript.parentNode.insertBefore(script, firstScript)
				}

				ttq.load('CSVHR4JC77U84I7KUSI0')
				ttq.page()
			})(window, document, 'ttq')
		}
	}, [])

	useEffect(() => {
		// Yandex Metrica
		if (typeof window !== 'undefined') {
			;(function (m, e, t, r, i, k, a) {
				m[i] =
					m[i] ||
					function () {
						;(m[i].a = m[i].a || []).push(arguments)
					}
				m[i].l = 1 * new Date()
				k = e.createElement(t)
				a = e.getElementsByTagName(t)[0]
				k.async = 1
				k.src = r
				a.parentNode.insertBefore(k, a)
			})(
				window,
				document,
				'script',
				'https://mc.yandex.ru/metrika/tag.js',
				'ym'
			)

			window.ym(99038681, 'init', {
				clickmap: true,
				trackLinks: true,
				accurateTrackBounce: true,
				webvisor: true,
			})
		}
	}, [])

	return null
}

export default function RootLayout({ children }) {
	return (
		<html lang='ru'>
			<head>
				<title>{metadata.title}</title>
				<meta name='description' content={metadata.description} />
				<Script
					strategy='afterInteractive'
					src='https://mc.yandex.ru/metrika/tag.js'
				/>
			</head>
			<body
				className={`${inter.className}`}
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					minHeight: '100vh',
				}}
			>
				<Analytics />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '100vh',
					}}
				>
					<Box component='main' sx={{ flex: 1 }}>
						{children}
					</Box>
				</Box>
				<noscript>
					<div>
						<img
							src='https://mc.yandex.ru/watch/99038681'
							style={{ position: 'absolute', left: '-9999px' }}
							alt='mtr'
						/>
					</div>
				</noscript>
			</body>
		</html>
	)
}
