'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loading from '@/app/loading';
import Phone2Theme from './themes/Phone2Theme';
import Phone3Theme from './themes/Phone3Theme';
import Phone4Theme from './themes/Phone4Theme';

export default function DynamicLandingPage() {
  const params = useParams();
  const slug = params?.slug;
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/landing/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Landing page not found');
          } else {
            setError('Failed to load landing page');
          }
          return;
        }

        const data = await response.json();
        setLandingPage(data.landingPage);
      } catch (err) {
        console.error('Error fetching landing page:', err);
        setError('Failed to load landing page');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (error || !landingPage) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Страница не найдена</h1>
        <p>{error || 'Landing page not found'}</p>
      </div>
    );
  }

  // Рендерим соответствующую тему
  switch (landingPage.theme) {
    case 'phone2':
      return <Phone2Theme landingPage={landingPage} />;
    case 'phone3':
      return <Phone3Theme landingPage={landingPage} />;
    case 'phone4':
      return <Phone4Theme landingPage={landingPage} />;
    default:
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Неизвестная тема</h1>
          <p>Тема "{landingPage.theme}" не поддерживается</p>
        </div>
      );
  }
}
