'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const CookieBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  color: #fff;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CookieText = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.5;

  a {
    color: #4a9eff;
    text-decoration: underline;

    &:hover {
      color: #6bb0ff;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.$primary
      ? `
    background: #4a9eff;
    color: #fff;
    
    &:hover {
      background: #3a8eef;
    }
  `
      : `
    background: transparent;
    color: #fff;
    border: 1px solid #666;
    
    &:hover {
      background: #333;
      border-color: #888;
    }
  `}
`;

const COOKIE_CONSENT_KEY = 'cookie-consent';

export default function CookieConsent({ onAccept }) {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Проверяем, находимся ли мы на поддомене
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Если это поддомен *.cvirko-vadim.ru (но не основной домен), не показываем баннер
      const mainDomains = ['cvirko-vadim.ru', 'bartech.by', 'www.cvirko-vadim.ru', 'www.bartech.by'];
      const isMainDomain = mainDomains.includes(hostname);
      const isSubdomain = !isMainDomain && hostname.includes('.cvirko-vadim.ru');
      
      if (isSubdomain) {
        // Отладочная информация (можно удалить после проверки)
        if (process.env.NODE_ENV === 'development') {
          console.log('CookieConsent - поддомен обнаружен, баннер не показывается:', hostname);
        }
        return; // Не показываем на поддоменах
      }
    }
    
    // Проверяем, было ли уже дано согласие
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
    if (onAccept) {
      onAccept();
    }
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  // Не показываем до монтирования или если это поддомен
  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <CookieBanner>
      <CookieText>
        Мы используем файлы cookie для улучшения работы сайта и аналитики.
        Продолжая использовать сайт, вы соглашаетесь с{' '}
        <Link href="/privacy">политикой конфиденциальности</Link>.
      </CookieText>
      <ButtonGroup>
        <Button onClick={handleDecline}>Отклонить</Button>
        <Button $primary onClick={handleAccept}>
          Принять
        </Button>
      </ButtonGroup>
    </CookieBanner>
  );
}

