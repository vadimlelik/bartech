'use client';
import React, { useState, useEffect } from 'react';
import styles from './header.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/logo_techno_bar.svg"
            alt="Techno Bar"
            width={200}
            height={50}
            priority
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
          <Link href="/" className={styles.navLink}>
            Каталог
          </Link>
          <Link href="payment_delivery" className={styles.navLink}>
            Оплата и доставка
          </Link>
          <Link href="contacts" className={styles.navLink}>
            Контакты
          </Link>
          <a href="#" className={styles.navLink}>
            пн.- пт.: 9:30 - 21:30
          </a>
          <a href="tel:+375257766462" className={styles.navLink}>
            +375257766462
          </a>
        </nav>
      )}

      {isMobile && isMenuOpen && (
        <nav className={styles.mobileMenu} onClick={toggleMenu}>
          <Link href="/" className={styles.mobileLink}>
            Каталог
          </Link>
          <Link href="payment_delivery" className={styles.mobileLink}>
            Оплата и доставка
          </Link>
          <Link href="contacts" className={styles.mobileLink}>
            Контакты
          </Link>
          <a href="#" className={styles.navLink}>
            пн.- пт.: 9:30 - 21:30
          </a>
          <a href="tel:+375257766462" className={styles.navLink}>
            +375257766462
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
