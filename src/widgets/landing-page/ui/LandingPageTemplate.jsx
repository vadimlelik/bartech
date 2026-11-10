'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadTikTokPixels, scheduleNonCriticalTask } from '@/shared/utils';
import { trackCityEvent } from '@/shared/ui/analytics/CityAnalytics';
import styles from './landing-page.module.css';
import { buildLandingView, readableButtonColor } from '../lib/content';
import {
  AdvantageStrip,
  BenefitGrid,
  CtaButton,
  FaqList,
  FinalCta,
  GuaranteeRow,
  InstallmentBand,
  LandingHero,
  ReviewSlider,
  StorySection,
} from './sections';

const Quiz = dynamic(() => import('@/features/quiz/ui/Quiz'), { ssr: false });

const quizQuestions = [
  {
    id: 1,
    question: 'Выберите срок рассрочки для расчета платежей',
    type: 'radio',
    options: [
      { value: '1 год', label: '1 год' },
      { value: '2 года', label: '2 года' },
      { value: '3 года', label: '3 года' },
      { value: '4 года', label: '4 года' },
      { value: '5 лет', label: '5 лет' },
      { value: 'Нужна консультация', label: 'Нужна консультация' },
    ],
  },
  {
    id: 2,
    question: 'Рассчитать платежи с первым взносом или без?',
    type: 'radio',
    options: [
      { value: 'с первым взносом', label: 'С первым взносом' },
      { value: 'без первого взноса', label: 'Без первого взноса' },
    ],
  },
  {
    id: 3,
    question: 'Куда вам выслать примерный расчет ежемесячных платежей?',
    type: 'radio',
    options: [
      { value: 'Viber', label: 'Viber' },
      { value: 'Telegram', label: 'Telegram' },
      { value: 'SMS', label: 'SMS' },
      { value: 'Нужна консультация по телефону', label: 'Нужна консультация по телефону' },
    ],
  },
  {
    id: 4,
    question: 'Укажите на какой номер прислать каталог с ценами и графиками платежей',
    type: 'text',
  },
];

export default function LandingPageTemplate({ landing }) {
  const view = useMemo(() => buildLandingView(landing), [landing]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [heroGone, setHeroGone] = useState(false);
  const [finalVisible, setFinalVisible] = useState(false);
  const heroRef = useRef(null);
  const finalRef = useRef(null);
  const router = useRouter();
  const params = useSearchParams();
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmContent = params.get('utm_content');
  const utmCampaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  const colors = view.colors;
  const showStory = Boolean(view.secondaryImage) || view.advantages.some((item) => item.description);
  const detailsHref = view.benefits.length
    ? '#benefits'
    : showStory
      ? '#story'
      : view.reviews.length
        ? '#reviews'
        : '#faq';

  useEffect(() => {
    const bodyBackground = colors.bodyBackground || '#f3f5f8';
    document.body.style.backgroundColor = bodyBackground;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [colors.bodyBackground]);

  useEffect(() => {
    if (!Array.isArray(view.pixels) || view.pixels.length === 0) return undefined;
    return scheduleNonCriticalTask(() => {
      loadTikTokPixels(view.pixels);
    });
  }, [view.pixels]);

  useEffect(() => {
    const seen = new Set();
    const nodes = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = entry.target.getAttribute('data-section');
        if (!section || seen.has(section)) return;
        seen.add(section);
        trackCityEvent('landing_section_view', { landing_slug: view.slug, section });
      });
    }, { threshold: 0.45 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [view.slug]);

  useEffect(() => {
    const hero = heroRef.current;
    const finalBlock = finalRef.current;
    if (!hero || !finalBlock) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) setHeroGone(!entry.isIntersecting);
        if (entry.target === finalBlock) setFinalVisible(entry.isIntersecting);
      });
    }, { threshold: 0 });
    observer.observe(hero);
    observer.observe(finalBlock);
    return () => observer.disconnect();
  }, []);

  const openQuiz = (place) => {
    trackCityEvent('landing_cta_click', { landing_slug: view.slug, cta: view.ctaLabel, place });
    setIsQuizOpen(true);
  };

  const handleQuizSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FIELDS: {
            ...data.FIELDS,
            UTM_SOURCE: utmSource || '',
            UTM_MEDIUM: utmMedium || '',
            UTM_CAMPAIGN: utmCampaign || '',
            UTM_CONTENT: utmContent || '',
            UTM_TERM: (ad || '') + (ttclid || ''),
          },
        }),
      });

      if (response.status === 429) {
        alert('Форма уже отправлена. Попробуйте через минуту.');
        return;
      }

      const result = await response.json();
      if (result?.success) {
        router.push(`https://technobar.by/thank-you?source=${view.slug}`);
      } else {
        alert('Форма отправлена слишком часто. Попробуйте через минуту.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={styles.page}
      style={{
        '--landing-header': colors.header || '#1a1a1a',
        '--landing-button': readableButtonColor(colors.button, '#1d6fe8'),
        '--landing-button-hover': readableButtonColor(colors.buttonHover, '#1859bd'),
        '--landing-bg': colors.background || '#ffffff',
        '--landing-text': colors.textColor || '#1f2933',
      }}
    >
      <div ref={heroRef}>
        <LandingHero view={view} detailsHref={detailsHref} onCta={() => openQuiz('hero')} />
      </div>
      <AdvantageStrip items={view.advantages} />
      <BenefitGrid items={view.benefits} />
      {showStory ? (
        <StorySection
          image={view.secondaryImage}
          items={view.advantages.filter((item) => item.description)}
          ctaLabel={view.ctaLabel}
          onCta={() => openQuiz('story')}
        />
      ) : null}
      <ReviewSlider
        reviews={view.reviews}
        rating={view.rating}
        onReview={(index) => trackCityEvent('landing_review_click', { landing_slug: view.slug, index })}
      />
      <InstallmentBand />
      <GuaranteeRow />
      <FaqList
        items={view.faq}
        onOpen={(question) => trackCityEvent('landing_faq_open', { landing_slug: view.slug, question })}
      />
      <div ref={finalRef}>
        <FinalCta
          label={view.ctaLabel}
          microcopy={view.microcopy}
          onClick={() => openQuiz('final')}
        />
      </div>
      <div className={`${styles.sticky} ${heroGone && !finalVisible ? styles.stickyVisible : ''}`}>
        <CtaButton label={view.ctaLabel} onClick={() => openQuiz('sticky')} />
      </div>
      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isLoading={isLoading}
        questions={quizQuestions}
        onSubmit={handleQuizSubmit}
        title={view.title}
      />
    </div>
  );
}
