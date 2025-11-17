import dynamic from 'next/dynamic';

// Динамическая загрузка Quiz компонента
export const DynamicQuiz = dynamic(() => import('@/components/quiz/Quiz'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      Загрузка...
    </div>
  ),
});

// Динамическая загрузка Swiper
export const DynamicSwiper = dynamic(
  () => import('swiper/react').then((mod) => ({ default: mod.Swiper })),
  {
    ssr: false,
    loading: () => <div>Загрузка...</div>,
  }
);

export const DynamicSwiperSlide = dynamic(
  () => import('swiper/react').then((mod) => ({ default: mod.SwiperSlide })),
  {
    ssr: false,
  }
);

// Динамическая загрузка framer-motion
export const DynamicMotion = dynamic(
  () => import('framer-motion').then((mod) => ({ default: mod.motion })),
  {
    ssr: false,
  }
);

