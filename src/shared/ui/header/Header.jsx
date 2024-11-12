'use client'
import React, { useState, useEffect } from 'react'
import styles from './Header.module.css'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
	const [isMenuOpen, setMenuOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}

		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add('no-scroll')
		} else {
			document.body.classList.remove('no-scroll')
		}

		return () => document.body.classList.remove('no-scroll')
	}, [isMenuOpen])

	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<Link href='/'>
					<Image
						src='/logo_techno_bar.svg'
						alt='Logo'
						width={90}
						height={100}
					/>
				</Link>
			</div>
			{isMobile ? (
				<div className={styles.burger} onClick={toggleMenu}>
					<span
						className={classNames(styles.burgerLine, {
							[styles.open]: isMenuOpen,
						})}
					></span>
					<span
						className={classNames(styles.burgerLine, {
							[styles.open]: isMenuOpen,
						})}
					></span>
					<span
						className={classNames(styles.burgerLine, {
							[styles.open]: isMenuOpen,
						})}
					></span>
				</div>
			) : (
				<nav className={styles.nav}>
					<Link href='payment_delivery' className={styles.navLink}>
						payment_delivery
					</Link>
					<Link href='about' className={styles.navLink}>
						Оплата и доставка
					</Link>
					<a href='#services' className={styles.navLink}>
						пн.- пт.: 9:30 - 21:30
					</a>
					<a href='tel:+375257766462' className={styles.navLink}>
						+375257766462
					</a>
				</nav>
			)}

			{isMobile && isMenuOpen && (
				<nav className={styles.mobileMenu} onClick={toggleMenu}>
					<Link href='payment_delivery' className={styles.mobileLink}>
						payment_delivery
					</Link>
					<Link href='#about' className={styles.mobileLink}>
						About
					</Link>
					<Link href='#services' className={styles.mobileLink}>
						Services
					</Link>
					<Link href='contact' className={styles.mobileLink}>
						Contact
					</Link>
				</nav>
			)}
		</header>
	)
}

export default Header
