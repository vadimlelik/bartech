'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './landing-page.module.css';
import LandingIcon, { StarRow } from './icons';
import { GUARANTEE_LINKS, pluralRu } from '../lib/content';

/**
 * @param {{ src: string, alt: string, priority?: boolean, sizes: string, className?: string }} props
 */
export function LandingImage({ src, alt, priority = false, sizes, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${styles.frame} ${styles.placeholder} ${className || ''}`} role="img" aria-label={alt || 'Изображение не задано'}>
        <LandingIcon name="image" className={styles.placeholderIcon} />
      </div>
    );
  }

  return (
    <div className={`${styles.frame} ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={styles.photo}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/**
 * @param {{ label: string, microcopy?: string, onClick: () => void, variant?: 'primary' | 'secondary' | 'inverse' }} props
 */
export function CtaButton({ label, microcopy, onClick, variant = 'primary' }) {
  const className = variant === 'primary'
    ? styles.cta
    : variant === 'inverse'
      ? styles.ctaInverse
      : styles.ctaSecondary;
  return (
    <span className={styles.ctaWrap}>
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
      {microcopy ? <span className={styles.micro}>{microcopy}</span> : null}
    </span>
  );
}

/**
 * @param {{ headline: string }} props
 */
export function LandingCrumbs({ headline }) {
  return (
    <nav className={styles.crumbs} aria-label="Хлебные крошки">
      <Link href="/">Главная</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{headline}</span>
    </nav>
  );
}

/**
 * @param {{
 *   view: import('../lib/content').buildLandingView extends (...args: never) => infer R ? R : never,
 *   onCta: () => void,
 *   detailsHref: string,
 * }} props
 */
export function LandingHero({ view, onCta, detailsHref }) {
  const { rating } = view;
  const showTrust = rating.reviewCount > 0;
  return (
    <header className={styles.hero}>
      <div className={styles.wrap}>
        <LandingCrumbs headline={view.headline} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Texnobar</p>
            <h1>{view.headline}</h1>
            {view.description ? <p className={styles.lead}>{view.description}</p> : null}
            <div className={styles.heroActions}>
              <CtaButton label={view.ctaLabel} onClick={onCta} />
              <a className={styles.ctaGhost} href={detailsHref}>
                Узнать больше
              </a>
            </div>
            {view.microcopy ? <p className={styles.micro}>{view.microcopy}</p> : null}
            {showTrust ? (
              <ul className={styles.trust}>
                {rating.average !== null ? (
                  <li>
                    <StarRow
                      value={rating.average}
                      className={styles.stars}
                      iconClassName={styles.star}
                      dimClassName={styles.starDim}
                    />
                    <span>{rating.average} из 5</span>
                  </li>
                ) : null}
                <li>
                  {rating.reviewCount}
                  {' '}
                  {pluralRu(rating.reviewCount, 'отзыв', 'отзыва', 'отзывов')}
                </li>
              </ul>
            ) : null}
          </div>
          <LandingImage
            src={view.mainImage}
            alt={view.headline}
            priority
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      </div>
    </header>
  );
}

/**
 * @param {{ items: { title: string, icon: string }[] }} props
 */
export function AdvantageStrip({ items }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.strip} aria-label="Преимущества магазина" data-section="advantages">
      <ul className={styles.stripList}>
        {items.slice(0, 4).map((item, index) => (
          <li key={`${item.title}-${index}`}>
            <LandingIcon name={item.icon} className={styles.stripIcon} />
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * @param {{ items: { title: string, text: string, icon: string }[] }} props
 */
export function BenefitGrid({ items }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.section} id="benefits" data-section="benefits">
      <div className={styles.wrap}>
        <h2>Почему выбирают нас</h2>
        <div className={styles.cards}>
          {items.map((item, index) => (
            <article key={`${item.title}-${index}`} className={styles.card}>
              <span className={styles.cardIcon}>
                <LandingIcon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              {item.text ? <p>{item.text}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   image: string,
 *   items: { title: string, description: string }[],
 *   ctaLabel: string,
 *   onCta: () => void,
 * }} props
 */
export function StorySection({ image, items, ctaLabel, onCta }) {
  if (!image && items.length === 0) return null;
  return (
    <section className={`${styles.section} ${styles.tint}`} id="story" data-section="story">
        <div className={`${styles.wrap} ${styles.story} ${image ? '' : styles.storyText}`}>
        {image ? (
          <LandingImage
            src={image}
            alt="Второстепенное изображение"
            sizes="(max-width: 768px) 100vw, 540px"
          />
        ) : null}
        <div>
          <h2>Преимущества нашего магазина</h2>
          {items.length > 0 ? (
            <ol className={styles.storyList}>
              {items.map((item) => (
                <li key={`${item.title}-${item.description}`}>
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                </li>
              ))}
            </ol>
          ) : null}
          <CtaButton label={ctaLabel} onClick={onCta} />
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{
 *   reviews: { text: string, image: string, author: string, avatar: string, rating: number }[],
 *   rating: { average: number | null, ratedCount: number, reviewCount: number },
 *   onReview: (index: number) => void,
 * }} props
 */
export function ReviewSlider({ reviews, rating, onReview }) {
  if (reviews.length === 0) return null;
  const label = `${rating.reviewCount} ${pluralRu(rating.reviewCount, 'отзыв', 'отзыва', 'отзывов')}`;

  const scrollByCard = (direction) => {
    const track = document.getElementById('landing-reviews-track');
    if (!track) return;
    const card = track.querySelector('article');
    const width = card ? card.getBoundingClientRect().width + 16 : 320;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * width, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section className={styles.section} id="reviews" data-section="reviews" aria-roledescription="карусель" aria-label="Отзывы покупателей">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <div>
            <h2>Отзывы покупателей</h2>
            <p className={styles.sectionNote}>
              {rating.average !== null ? `${rating.average} из 5 · ` : ''}
              {label}
            </p>
          </div>
          {reviews.length > 1 ? (
            <div className={styles.sliderNav}>
              <button type="button" aria-label="Предыдущий отзыв" onClick={() => scrollByCard(-1)}>
                <LandingIcon name="chevronLeft" />
              </button>
              <button type="button" aria-label="Следующий отзыв" onClick={() => scrollByCard(1)}>
                <LandingIcon name="chevronRight" />
              </button>
            </div>
          ) : null}
        </div>
        <div className={styles.track} id="landing-reviews-track">
          {reviews.map((review, index) => (
            <article
              key={`${review.author}-${review.text}-${index}`}
              className={`${styles.review} ${reviews.length === 1 ? styles.reviewSolo : ''}`}
              tabIndex={0}
              onClick={() => onReview(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onReview(index);
                }
              }}
            >
              <div className={styles.reviewHead}>
                {review.avatar ? (
                  <Image src={review.avatar} alt="" width={44} height={44} className={styles.avatar} />
                ) : (
                  <span className={styles.avatarFallback} aria-hidden="true">
                    {(review.author || 'П').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div>
                  {review.author ? <strong>{review.author}</strong> : <strong>Покупатель</strong>}
                  {review.rating > 0 ? (
                    <StarRow
                      value={review.rating}
                      className={styles.stars}
                      iconClassName={styles.star}
                      dimClassName={styles.starDim}
                    />
                  ) : null}
                </div>
              </div>
              {review.text ? <p>{review.text}</p> : null}
              {review.image ? (
                <LandingImage src={review.image} alt="Фото отзыва" sizes="(max-width: 768px) 86vw, 320px" className={styles.reviewPhoto} />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstallmentBand() {
  return (
    <section className={`${styles.section} ${styles.tint}`} data-section="installment">
      <div className={`${styles.wrap} ${styles.band}`}>
        <div>
          <h2>Рассрочка</h2>
          <p>
            В магазине есть рассрочка через банки-партнёры. В акциях она бывает без первого взноса
            и без переплат. Платёж по этому предложению посчитаем в заявке.
          </p>
        </div>
        <Link className={styles.textLink} href="/installment">
          Условия рассрочки
        </Link>
      </div>
    </section>
  );
}

export function GuaranteeRow() {
  return (
    <section className={styles.section} data-section="guarantees">
      <div className={styles.wrap}>
        <h2>Покупка без лишнего риска</h2>
        <div className={styles.cards}>
          {GUARANTEE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={styles.card}>
              <span className={styles.cardIcon}>
                <LandingIcon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{ items: { q: string, a: string }[], onOpen: (question: string) => void }} props
 */
export function FaqList({ items, onOpen }) {
  return (
    <section className={`${styles.section} ${styles.tint}`} id="faq" data-section="faq">
      <div className={`${styles.wrap} ${styles.faqWrap}`}>
        <h2>Частые вопросы</h2>
        <div className={styles.faq}>
          {items.map((item) => (
            <details
              key={item.q}
              className={styles.faqItem}
              onToggle={(event) => {
                if (event.currentTarget.open) onOpen(item.q);
              }}
            >
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{ label: string, microcopy?: string, onClick: () => void }} props
 */
export function FinalCta({ label, microcopy, onClick }) {
  return (
    <section className={styles.final} id="final" data-section="final">
      <div className={styles.wrap}>
        <h2>Оставьте заявку — посчитаем платёж</h2>
        <p>Менеджер свяжется и подскажет условия именно по этому предложению.</p>
        <CtaButton label={label} microcopy={microcopy} onClick={onClick} variant="inverse" />
      </div>
    </section>
  );
}
