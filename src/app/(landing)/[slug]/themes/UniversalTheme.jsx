'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './UniversalTheme.module.css';
import Image from 'next/image';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Quiz from '@/components/quiz/Quiz';
import Button from '@/app/(shop)/components/button/Button';
import CountdownTimer from '@/app/(shop)/components/CountdownTimer/CountdownTimer';
import { loadTikTokPixel } from '@/shared/utils';

const defaultQuestions = [
  {
    id: 1,
    question: 'Что вас интересует?',
    type: 'checkbox',
    options: [
      { value: 'Смартфон', label: 'Смартфон' },
      { value: 'Телевизор', label: 'Телевизор' },
      { value: 'Ноутбук', label: 'Ноутбук' },
      { value: 'ПК', label: 'ПК' },
      { value: 'Другое', label: 'Другое' },
    ],
  },
  {
    id: 2,
    question: 'Ваш бюджет (в месяц/или сумма)',
    type: 'radio',
    options: [
      { value: 'до 50 BYN', label: 'до 50 BYN' },
      { value: '50–100 BYN', label: '50–100 BYN' },
      { value: '100–200 BYN', label: '100–200 BYN' },
      { value: 'от 200 BYN', label: 'от 200 BYN' },
    ],
  },
  {
    id: 3,
    question: 'Введите ваш номер телефона',
    type: 'text',
  },
];

function normalizeStringList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)];
}

function normalizeObjectList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function normalizeTextList(value) {
  const list = normalizeStringList(value);
  return list.filter((x) => x.trim() !== '');
}

function normalizeAssetSrc(src) {
  if (!src || typeof src !== 'string') return null;
  const s = src.trim();
  if (!s) return null;
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/')) return s;
  // User often enters "payment-visa.png" without leading slash; normalize to public asset path.
  return `/${s}`;
}

function inferPaymentAlt(src, idx) {
  const s = (src || '').toLowerCase();
  if (s.includes('visa')) return 'Visa';
  if (s.includes('mastercard')) return 'Mastercard';
  if (s.includes('belcard') || s.includes('bel')) return 'Белкарт';
  return `Оплата ${idx + 1}`;
}

function clampInt(n, min, max) {
  const x = Number(n);
  if (Number.isNaN(x)) return min;
  return Math.max(min, Math.min(max, Math.floor(x)));
}

export default function UniversalTheme({ landingPage }) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  const content = landingPage?.content || {};
  const images = Array.isArray(landingPage?.images) ? landingPage.images : [];
  const pixels = Array.isArray(landingPage?.pixels) ? landingPage.pixels : [];

  const themeColors = content?.themeColors || content?.colors || {};
  const cssVars = useMemo(
    () => ({
      '--ut-primary': themeColors.primary || '#7c3aed',
      '--ut-primary-2': themeColors.primary2 || '#22c55e',
      '--ut-bg': themeColors.background || '#0b0b0f',
      '--ut-card': themeColors.card || '#111827',
      '--ut-text': themeColors.text || '#ffffff',
      '--ut-muted': themeColors.muted || 'rgba(255,255,255,0.78)',
      '--ut-border': themeColors.border || 'rgba(255,255,255,0.10)',
    }),
    [themeColors]
  );

  const h1 = content.h1 || content.heroTitle || content.title || landingPage?.title || '';
  const subtitle = content.subtitle || content.heroSubtitle || content.description || '';
  const rating = content.rating || '';
  const ctaText = content.ctaText || content.buttonText || 'Получить подбор';

  const heroImage =
    normalizeAssetSrc(content.heroImage) ||
    normalizeAssetSrc(content.mainImage) ||
    normalizeAssetSrc(images.length > 0 ? images[0] : null);
  const heroAlt =
    (Array.isArray(content.imageAlts) ? content.imageAlts[0] : null) ||
    content.heroAlt ||
    h1 ||
    'Изображение';

  const badges = normalizeStringList(content.badges || content.heroBadges || content.infoItems);
  const heroPoints = normalizeTextList(content.heroPoints || content.heroBullets);
  const benefits = normalizeStringList(content.benefits);
  const features = normalizeObjectList(content.features);
  const testimonials = normalizeObjectList(content.reviews || content.testimonials);
  const faq = normalizeObjectList(content.faq);

  const imageAlts = Array.isArray(content.imageAlts) ? content.imageAlts : [];
  const imageCaptions = Array.isArray(content.imageCaptions) ? content.imageCaptions : [];

  useEffect(() => {
    if (!pixels || pixels.length === 0) return;
    if (typeof window === 'undefined') return;

    // Respect cookie consent (same key as CookieConsent/ClientLayout)
    const consent = localStorage.getItem('cookie-consent');
    if (consent !== 'accepted') return;

    const validPixels = pixels.filter((p) => p && typeof p === 'string' && p.trim() !== '').map((p) => p.trim());
    if (validPixels.length === 0) return;

    // Ensure ttq is initialized (ClientLayout currently doesn't init TikTok because of placeholder)
    if (!window.ttq) {
      loadTikTokPixel(validPixels[0]);
    }

    if (window.ttq) {
      // Load all pixels (including first; safe if already loaded)
      validPixels.forEach((id) => window.ttq.load(id));
      window.ttq.page();
    }
  }, [pixels]);

  const questions = Array.isArray(content.questions) && content.questions.length > 0 ? content.questions : defaultQuestions;

  const offer = content.offer || {};
  const price = offer.price || content.price || '';
  const oldPrice = offer.oldPrice || content.oldPrice || '';
  const discountText = offer.discountText || content.discountText || '';
  const offerBullets = normalizeStringList(offer.bullets || content.offerBullets)
    .map((x) => String(x).trim())
    .filter(Boolean);
  const showTimer = Boolean(offer.showTimer ?? content.showTimer);
  const heroPointsFallback = heroPoints.length > 0 ? heroPoints : offerBullets.slice(0, 3);

  const topBarText =
    content.topBarText ||
    offer.topBarText ||
    'Бесплатная доставка • Рассрочка 3–18 месяцев • Гарантия';

  const trustItems = Array.isArray(content.trustItems) && content.trustItems.length > 0
    ? content.trustItems
    : [
        { icon: '/delivery.png', title: 'Доставка', text: 'Быстро по Минску и РБ' },
        { icon: '/warranty.png', title: 'Гарантия', text: 'Официально и прозрачно' },
        { icon: '/iconCheck.svg', title: 'Подбор', text: 'Поможем выбрать под бюджет' },
      ];

  const stickyCta = content.stickyCta || {};
  const stickyEnabled = stickyCta.enabled !== undefined ? !!stickyCta.enabled : true;
  const stickyPrice = stickyCta.price || price;
  const stickyNote = stickyCta.note || offer.note || '';
  const stickyButtonText = stickyCta.buttonText || offer.buttonText || ctaText;

  const steps = Array.isArray(content.steps) && content.steps.length > 0
    ? content.steps
    : [
        { icon: '/iconCheck.svg', title: 'Оставляете заявку', text: 'Заполните форму — это займёт меньше минуты.' },
        { icon: '/commentLogo-2.webp', title: 'Уточняем детали', text: 'Менеджер свяжется и поможет подобрать лучший вариант.' },
        { icon: '/delivery.png', title: 'Доставка / выдача', text: 'Доставим быстро или подготовим к самовывозу.' },
      ];

  const guarantees = Array.isArray(content.guarantees) && content.guarantees.length > 0
    ? content.guarantees
    : [
        { icon: '/warranty.png', title: 'Гарантия', text: 'Официальная гарантия и поддержка.' },
        { icon: '/zero.png', title: 'Без переплат', text: 'Прозрачные условия, без скрытых платежей.' },
        { icon: '/pass_img.png', title: 'Возврат', text: 'Поможем с обменом/возвратом по правилам.' },
      ];

  const paymentLogos = normalizeStringList(content.paymentLogos)
    .map((x) => String(x).trim())
    .filter(Boolean);
  const paymentLogosResolved = paymentLogos.length > 0
    ? paymentLogos
    : ['/payment-visa.png', '/payment-mastercard.png', '/payment-belcard.png'];
  const paymentLogosFinal = paymentLogosResolved.map(normalizeAssetSrc).filter(Boolean);

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios
        .post('https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json', {
          FIELDS: {
            ...data.FIELDS,
            UTM_SOURCE: utm_source || '',
            UTM_MEDIUM: utm_medium || '',
            UTM_CAMPAIGN: utm_campaign || '',
            UTM_CONTENT: utm_content || '',
            UTM_TERM: (ad || '') + (ttclid || ''),
          },
        })
        .then(() => {
          setIsQuizOpen(false);
          router.push(`/thank-you?source=${landingPage?.slug || 'landing'}`);
        });
    } catch (error) {
      toast.error('Ошибка при отправке заявки. Попробуйте еще раз.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page} style={cssVars}>
      {topBarText ? (
        <div className={styles.topBar}>
          <div className={styles.topBarInner}>{topBarText}</div>
        </div>
      ) : null}

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            {rating ? <div className={styles.rating}>{rating}</div> : null}
            {h1 ? <h1 className={styles.h1}>{h1}</h1> : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

            {heroPointsFallback.length > 0 ? (
              <ul className={styles.heroPoints}>
                {heroPointsFallback.map((t, i) => (
                  <li key={i} className={styles.heroPoint}>
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}

            {badges.length > 0 ? (
              <ul className={styles.badges}>
                {badges.map((b, i) => (
                  <li key={i} className={styles.badge}>
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className={styles.ctaRow}>
              <Button className={styles.ctaBtn} label={ctaText} onClick={() => setIsQuizOpen(true)} />
              {content.ctaNote ? <span className={styles.ctaNote}>{content.ctaNote}</span> : null}
            </div>
          </div>

          {heroImage ? (
            <div className={styles.heroMedia}>
              <div className={styles.heroMediaInner}>
                <Image
                  src={heroImage}
                  alt={heroAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ) : null}
        </section>

        {trustItems.length > 0 ? (
          <section className={styles.trustRow}>
            {trustItems.slice(0, 3).map((item, idx) => (
              <div key={idx} className={styles.trustItem}>
                {normalizeAssetSrc(item.icon) ? (
                  <div className={styles.trustIcon}>
                    <Image
                      src={normalizeAssetSrc(item.icon)}
                      alt={item.title || 'Иконка'}
                      width={28}
                      height={28}
                      style={{ width: 28, height: 28, objectFit: 'contain' }}
                    />
                  </div>
                ) : null}
                <div className={styles.trustText}>
                  <div className={styles.trustTitle}>{item.title || ''}</div>
                  <div className={styles.trustDesc}>{item.text || ''}</div>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {steps.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.stepsTitle || 'Как это работает'}</h2>
            {content.stepsSubtitle ? <p className={styles.subtitle}>{content.stepsSubtitle}</p> : null}
            <div className={styles.stepsGrid}>
              {steps.slice(0, 6).map((s, idx) => (
                <div key={idx} className={styles.stepCard}>
                  <div className={styles.stepTop}>
                    <div className={styles.stepNum}>{idx + 1}</div>
                    {normalizeAssetSrc(s.icon) ? (
                      <div className={styles.stepIcon}>
                        <Image
                          src={normalizeAssetSrc(s.icon)}
                          alt={s.title ? `Иконка: ${s.title}` : 'Иконка'}
                          width={28}
                          height={28}
                          style={{ width: 28, height: 28, objectFit: 'contain' }}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.cardTitle}>{s.title || `Шаг ${idx + 1}`}</div>
                  {s.text ? <div className={styles.cardText}>{s.text}</div> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {(price || oldPrice || discountText || offerBullets.length > 0 || showTimer) ? (
          <section className={styles.section}>
            <div className={styles.offer}>
              <div className={styles.offerLeft}>
                <h2 className={styles.h2}>{offer.title || content.offerTitle || 'Спецпредложение'}</h2>
                {offer.subtitle || content.offerSubtitle ? (
                  <p className={styles.subtitle}>{offer.subtitle || content.offerSubtitle}</p>
                ) : null}

                {showTimer ? (
                  <div className={styles.timerBlock}>
                    <div className={styles.timerLabel}>{offer.timerLabel || 'До конца акции осталось:'}</div>
                    <CountdownTimer />
                  </div>
                ) : null}

                {offerBullets.length > 0 ? (
                  <ul className={styles.offerBullets}>
                    {offerBullets.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className={styles.offerRight}>
                {discountText ? <div className={styles.discountBadge}>{discountText}</div> : null}
                {(price || oldPrice) ? (
                  <div className={styles.priceRow}>
                    {oldPrice ? <div className={styles.oldPrice}>{oldPrice}</div> : null}
                    {price ? <div className={styles.price}>{price}</div> : null}
                  </div>
                ) : null}
                {offer.note || content.offerNote ? (
                  <div className={styles.offerNote}>{offer.note || content.offerNote}</div>
                ) : null}
                <Button
                  className={styles.ctaBtn}
                  label={offer.buttonText || content.offerButtonText || ctaText}
                  onClick={() => setIsQuizOpen(true)}
                />
                {offer.fineprint || content.offerFineprint ? (
                  <div className={styles.fineprint}>{offer.fineprint || content.offerFineprint}</div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {benefits.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.benefitsTitle || 'Почему это удобно'}</h2>
            <div className={styles.grid3}>
              {benefits.map((text, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.cardTitle}>{content.benefitPrefix || 'Преимущество'}</div>
                  <div className={styles.cardText}>{text}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {guarantees.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.guaranteesTitle || 'Гарантии и условия'}</h2>
            {content.guaranteesSubtitle ? <p className={styles.subtitle}>{content.guaranteesSubtitle}</p> : null}
            <div className={styles.grid3}>
              {guarantees.slice(0, 6).map((g, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.guaranteeHeader}>
                    {normalizeAssetSrc(g.icon) ? (
                      <div className={styles.guaranteeIcon}>
                        <Image
                          src={normalizeAssetSrc(g.icon)}
                          alt={g.title ? `Иконка: ${g.title}` : 'Иконка'}
                          width={28}
                          height={28}
                          style={{ width: 28, height: 28, objectFit: 'contain' }}
                        />
                      </div>
                    ) : null}
                    <div className={styles.cardTitle} style={{ marginBottom: 0 }}>
                      {g.title || `Гарантия ${idx + 1}`}
                    </div>
                  </div>
                  {g.text ? <div className={styles.cardText}>{g.text}</div> : null}
                </div>
              ))}
            </div>

            {paymentLogosFinal.length > 0 ? (
              <div className={styles.paymentRow}>
                <div className={styles.paymentTitle}>{content.paymentTitle || 'Оплата'}</div>
                <div className={styles.paymentLogos}>
                  {paymentLogosFinal.map((src, idx) => (
                    <div key={idx} className={styles.paymentLogoItem}>
                      <Image
                        src={src}
                        alt={inferPaymentAlt(src, idx)}
                        width={110}
                        height={40}
                        style={{ width: '110px', height: '40px', objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {features.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.featuresTitle || 'Возможности'}</h2>
            <div className={styles.grid3}>
              {features.map((f, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.cardTitle}>{f.title || `Фича ${idx + 1}`}</div>
                  {f.text ? <div className={styles.cardText}>{f.text}</div> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {images.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.galleryTitle || 'Галерея'}</h2>
            <div className={styles.gallery}>
              {images.map((src, idx) => (
                <figure key={idx} className={styles.galleryItem}>
                  <div className={styles.galleryImg}>
                    <Image
                      src={src}
                      alt={imageAlts[idx] || `Изображение ${idx + 1}`}
                      width={1200}
                      height={900}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading={idx < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                  {imageCaptions[idx] ? <figcaption className={styles.caption}>{imageCaptions[idx]}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {testimonials.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.reviewsTitle || content.testimonialsTitle || 'Отзывы'}</h2>
            {content.reviewsSubtitle ? <p className={styles.subtitle}>{content.reviewsSubtitle}</p> : null}
            <div className={styles.grid3}>
              {testimonials.map((t, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.reviewHeader}>
                    {t.image ? (
                      <div className={styles.avatar}>
                        <Image
                          src={t.image}
                          alt={t.name ? `Фото: ${t.name}` : 'Фото'}
                          width={56}
                          height={56}
                          style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                        />
                      </div>
                    ) : null}
                    <div className={styles.reviewHeaderText}>
                      <div className={styles.cardTitle}>{t.name || t.title || `Отзыв ${idx + 1}`}</div>
                      {t.rating ? (
                        <div className={styles.stars}>{'★'.repeat(clampInt(t.rating, 1, 5))}</div>
                      ) : null}
                      {t.date ? <div className={styles.meta}>{t.date}</div> : null}
                    </div>
                  </div>
                  {t.text ? <div className={styles.cardText}>{t.text}</div> : null}
                  {t.meta ? <div className={styles.meta}>{t.meta}</div> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {faq.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.h2}>{content.faqTitle || 'Вопросы и ответы'}</h2>
            <div className={styles.faq}>
              {faq.map((item, idx) => (
                <details key={idx} className={styles.faqItem}>
                  <summary className={styles.faqQ}>{item.question || `Вопрос ${idx + 1}`}</summary>
                  {item.answer ? <div className={styles.faqA}>{item.answer}</div> : null}
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.section}>
          <div className={styles.finalCta}>
            <div className={styles.finalText}>
              <h2 className={styles.h2}>{content.finalTitle || 'Оставьте заявку — мы подберём вариант'}</h2>
              {content.finalSubtitle ? <p className={styles.subtitle}>{content.finalSubtitle}</p> : null}
            </div>
            <Button className={styles.ctaBtn} label={content.finalButtonText || ctaText} onClick={() => setIsQuizOpen(true)} />
          </div>
        </section>
      </main>

      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={questions}
        isLoading={isLoading}
        onSubmit={handleQuizSubmit}
        successMessage="Ваши данные успешно отправлены! Мы скоро свяжемся с вами"
        title={landingPage?.title || 'Universal4'}
      />

      {stickyEnabled ? (
        <div className={styles.stickyCta} aria-hidden={false}>
          <div className={styles.stickyInner}>
            <div className={styles.stickyLeft}>
              {stickyPrice ? <div className={styles.stickyPrice}>{stickyPrice}</div> : null}
              {stickyNote ? <div className={styles.stickyNote}>{stickyNote}</div> : null}
            </div>
            <Button className={styles.ctaBtn} label={stickyButtonText} onClick={() => setIsQuizOpen(true)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}


