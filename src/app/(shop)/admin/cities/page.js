'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { resolveHomeCards } from '@/entities/city/lib/city-content';

const EMPTY_METHOD = { code: 'courier', title: '', description: '', price: 0, eta: '', enabled: true };
const EMPTY_PICKUP = { title: '', address: '', hours: '', enabled: true };
const EMPTY_PAYMENT = { code: 'cash', title: '', enabled: true };
const EMPTY_DRAFT = { slug: '', name: '', nameIn: '', nameGenitive: '', nameDative: '', regionName: '' };

export default function AdminCitiesPage() {
  const [cities, setCities] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [banner, setBanner] = useState({ title: '', subtitle: '', href: '', citySlugs: '' });
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);

  const load = async (preferSlug) => {
    const [citiesResponse, bannersResponse] = await Promise.all([
      fetch('/api/admin/cities'),
      fetch('/api/admin/banners'),
    ]);
    const citiesData = await citiesResponse.json();
    const bannersData = await bannersResponse.json();
    if (!citiesResponse.ok) {
      setError(citiesData.error || 'Не удалось загрузить города');
      return;
    }
    const nextCities = citiesData.cities || [];
    setCities(nextCities);
    setBanners(bannersData.banners || []);
    const current = preferSlug || selected;
    const city = nextCities.find((item) => item.slug === current) || nextCities[0];
    if (city) {
      setSelected(city.slug);
      setForm(toForm(city));
    }
  };

  useEffect(() => {
    load().catch(() => setError('Не удалось загрузить города'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createCity = async () => {
    setMessage('');
    setError('');
    const response = await fetch('/api/admin/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Не удалось добавить город');
      return;
    }
    setDraft(EMPTY_DRAFT);
    setMessage('Город добавлен и пока выключен. Включите его и нажмите «Сохранить город» — адрес /' + data.slug + '/ откроется в течение минуты.');
    await load(data.slug);
  };

  const choose = (slug) => {
    const city = cities.find((item) => item.slug === slug);
    setSelected(slug);
    setForm(city ? toForm(city) : null);
  };

  const save = async () => {
    setMessage('');
    setError('');
    setSaving(true);
    try {
    const response = await fetch(`/api/admin/cities/${selected}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        aboutParagraphs: undefined,
        faq: undefined,
        aboutText: form.aboutText,
        faqText: form.faqText,
        installmentBullets: form.installmentBullets,
        deliveryLocalities: form.deliveryLocalities,
        messengers: form.messengersText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [type, url] = line.split('|');
            return { type: (type || 'link').trim(), url: (url || type || '').trim() };
          }),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Ошибка сохранения');
      return;
    }
    setMessage('Город сохранён. Тексты на главной обновлены.');
    await load(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Не удалось сохранить город');
    } finally {
      setSaving(false);
    }
  };

  const createBanner = async () => {
    setError('');
    const response = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: banner.title,
        subtitle: banner.subtitle,
        href: banner.href,
        citySlugs: banner.citySlugs.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Не удалось создать баннер');
      return;
    }
    setBanner({ title: '', subtitle: '', href: '', citySlugs: '' });
    await load();
  };

  const set = (patch) => setForm({ ...form, ...patch });

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Города</Typography>
        <Button component={Link} href="/admin">К админке</Button>
      </Stack>
      <Alert severity="info" sx={{ mb: 2 }}>
        Город появляется на сайте, когда включён переключатель «Город включён» и нажато «Сохранить город». Адрес, пункты выдачи, координаты, текст и FAQ можно не заполнять. Телефон и сроки с Минска не подставляются.
      </Alert>
      <Section title="Новый город" hint="Сначала только название. Тексты и доставку заполните после добавления.">
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Адрес на сайте" placeholder="baranovichi" helperText="Латиницей, без пробелов" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} />
          <TextField label="Название" placeholder="Барановичи" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <TextField label="Где? без «в»" placeholder="Барановичах" value={draft.nameIn} onChange={(event) => setDraft({ ...draft, nameIn: event.target.value })} />
          <TextField label="Область" placeholder="Брестская область" value={draft.regionName} onChange={(event) => setDraft({ ...draft, regionName: event.target.value })} />
        </Box>
        <Button variant="outlined" onClick={createCity}>Добавить город</Button>
      </Section>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <TextField
        select
        fullWidth
        label="Город"
        value={selected}
        onChange={(event) => choose(event.target.value)}
        sx={{ mb: 2 }}
      >
        {cities.map((city) => (
          <MenuItem key={city.slug} value={city.slug}>
            {city.name} {city.enabled ? '' : '(выключен)'}
          </MenuItem>
        ))}
      </TextField>
      {form && (
        <Stack spacing={2}>
          <Section
            title="Город"
            hint="Название попадает в шапку и в заголовок главной. Падежи нужны для фраз «в Гродно», «по Гродно»."
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Switch
                checked={form.enabled}
                disabled={form.isDefault}
                onChange={(event) => set({ enabled: event.target.checked })}
              />
              <Typography>{form.enabled ? 'Город открыт на сайте' : 'Город выключен и на сайте не открывается'}</Typography>
            </Stack>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField label="Название" placeholder="Гродно" value={form.name} onChange={(event) => set({ name: event.target.value })} />
              <TextField label="Область" placeholder="Гродненская область" value={form.regionName} onChange={(event) => set({ regionName: event.target.value })} />
              <TextField label="Где? без «в»" placeholder="Гродно" helperText="Для заголовка: в Гродно" value={form.nameIn} onChange={(event) => set({ nameIn: event.target.value })} />
              <TextField label="Кого? чего?" placeholder="Гродно" helperText="Для фразы: доставка Гродно" value={form.nameGenitive || ''} onChange={(event) => set({ nameGenitive: event.target.value })} />
              <TextField label="Кому? чему?" placeholder="Гродно" helperText="Для фразы: по Гродно" value={form.nameDative || ''} onChange={(event) => set({ nameDative: event.target.value })} />
            </Box>
          </Section>

          <Section
            title="Главная: заголовок, рассрочка, акции, доставка"
            hint="В полях уже текст, который видит покупатель. Поменяйте нужные строки и нажмите «Сохранить город» — на главной этого города появится именно он."
          >
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' } }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #E1E5EB' }}>
                <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Слева на главной</Typography>
                <Stack spacing={1.5}>
                  <TextField label="Большой заголовок" value={form.homeHeroTitle || ''} onChange={(event) => set({ homeHeroTitle: event.target.value })} />
                  <TextField label="Абзац под заголовком" value={form.homeHeroText || ''} onChange={(event) => set({ homeHeroText: event.target.value })} multiline minRows={3} />
                </Stack>
              </Paper>
              <Stack spacing={1.5}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#E8F0FE', border: '1px solid #E1E5EB' }}>
                  <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Карточка «Рассрочка»</Typography>
                  <Stack spacing={1.5}>
                    <TextField label="Заголовок" value={form.homeInstallmentTitle || ''} onChange={(event) => set({ homeInstallmentTitle: event.target.value })} />
                    <TextField label="Пункты" helperText="Каждый пункт с новой строки" value={form.homeInstallmentPoints || ''} onChange={(event) => set({ homeInstallmentPoints: event.target.value })} multiline minRows={3} />
                  </Stack>
                </Paper>
                <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: '1fr 1fr' }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #E1E5EB' }}>
                    <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Карточка «Акции»</Typography>
                    <Stack spacing={1.5}>
                      <TextField label="Заголовок" value={form.homeSalesTitle || ''} onChange={(event) => set({ homeSalesTitle: event.target.value })} />
                      <TextField label="Текст" value={form.homeSalesText || ''} onChange={(event) => set({ homeSalesText: event.target.value })} multiline minRows={2} />
                    </Stack>
                  </Paper>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #E1E5EB' }}>
                    <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Карточка «Доставка»</Typography>
                    <Stack spacing={1.5}>
                      <TextField label="Заголовок" value={form.homeDeliveryTitle || ''} onChange={(event) => set({ homeDeliveryTitle: event.target.value })} />
                      <TextField label="Текст" value={form.homeDeliveryText || ''} onChange={(event) => set({ homeDeliveryText: event.target.value })} multiline minRows={2} />
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </Box>
            <Button variant="contained" onClick={save} disabled={saving || !selected}>
              {saving ? 'Сохраняю…' : 'Сохранить город'}
            </Button>
          </Section>

          <Section title="Контакты" hint="Если телефон пустой, на сайте города кнопка звонка не показывается.">
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField label="Телефон на сайте" placeholder="+375 29 000-00-00" value={form.phoneDisplay} onChange={(event) => set({ phoneDisplay: event.target.value })} />
              <TextField label="Телефон для звонка" placeholder="+375290000000" helperText="Только цифры, без пробелов" value={form.phoneTel} onChange={(event) => set({ phoneTel: event.target.value })} />
              <TextField label="Email" placeholder="shop@example.com" value={form.email} onChange={(event) => set({ email: event.target.value })} />
              <TextField label="График" placeholder="Пн–Пт 9:00–21:00" value={form.workHours} onChange={(event) => set({ workHours: event.target.value })} />
            </Box>
          </Section>
          <Section title="Адрес" hint="Выключите «На сайте», если поле не нужно покупателям. Значение при этом остаётся здесь.">
            <SiteField label="Адрес одной строкой" placeholder="г. Гродно, ул. Советская, 10" value={form.addressLine} shown={form.publicFields?.address !== false} onChange={(event) => set({ addressLine: event.target.value })} onShown={(shown) => setShown(setForm, form, 'address', shown)} />
            <SiteField label="Улица" value={form.streetAddress} shown={form.publicFields?.street !== false} onChange={(event) => set({ streetAddress: event.target.value })} onShown={(shown) => setShown(setForm, form, 'street', shown)} />
            <SiteField label="Индекс" value={form.postalCode} shown={form.publicFields?.postal !== false} onChange={(event) => set({ postalCode: event.target.value })} onShown={(shown) => setShown(setForm, form, 'postal', shown)} />
            <TextField label="Широта" value={form.latitude ?? ''} onChange={(event) => set({ latitude: event.target.value })} />
            <SiteField label="Долгота" value={form.longitude ?? ''} shown={form.publicFields?.coordinates !== false} switchLabel="Координаты на сайте" onChange={(event) => set({ longitude: event.target.value })} onShown={(shown) => setShown(setForm, form, 'coordinates', shown)} />
          </Section>

          <Section title="Условия заказа" hint="Выключенный переключатель прячет сумму на сайте и не применяет её в заказе.">
            <SiteField label="Минимальная сумма, BYN" value={form.minOrderAmount ?? ''} shown={form.publicFields?.minOrder !== false} onChange={(event) => set({ minOrderAmount: event.target.value })} onShown={(shown) => setShown(setForm, form, 'minOrder', shown)} />
            <SiteField label="Бесплатно от, BYN" value={form.freeDeliveryFrom ?? ''} shown={form.publicFields?.freeDelivery !== false} onChange={(event) => set({ freeDeliveryFrom: event.target.value })} onShown={(shown) => setShown(setForm, form, 'freeDelivery', shown)} />
            <SiteField label="Куда возим" placeholder="Гродно, Лида, Скидель" helperText="Города через запятую" value={form.deliveryLocalities} shown={form.publicFields?.localities !== false} onChange={(event) => set({ deliveryLocalities: event.target.value })} onShown={(shown) => setShown(setForm, form, 'localities', shown)} />
          </Section>

          <Section title="Способы доставки" hint="Эти строки видны в карточке товара. Цена 0 — бесплатно.">
          {(form.deliveryMethods || []).map((method, index) => (
            <Box key={method.id || `delivery-${index}`} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700 }}>Способ {index + 1}</Typography>
                <Button color="error" size="small" onClick={() => removeRow(setForm, form, 'deliveryMethods', index)}>Удалить</Button>
              </Stack>
              <Stack spacing={1.5}>
                <TextField label="Название" placeholder="Курьер по городу" value={method.title} onChange={(event) => updateRow(setForm, form, 'deliveryMethods', index, { title: event.target.value })} />
                <TextField label="Срок" placeholder="1–2 дня" value={method.eta || ''} onChange={(event) => updateRow(setForm, form, 'deliveryMethods', index, { eta: event.target.value })} />
                <TextField label="Цена, BYN" type="number" value={method.price} onChange={(event) => updateRow(setForm, form, 'deliveryMethods', index, { price: event.target.value })} />
              </Stack>
            </Box>
          ))}
          {(form.deliveryMethods || []).length === 0 && (
            <Typography variant="body2" color="text.secondary">Пока нет способов доставки.</Typography>
          )}
          <Button variant="outlined" onClick={() => setForm({ ...form, deliveryMethods: [...(form.deliveryMethods || []), { ...EMPTY_METHOD }] })}>Добавить способ</Button>
          </Section>

          <Section title="Пункты выдачи" hint="Необязательно. Пустой список на сайте не показывается.">
          {(form.pickupPoints || []).map((point, index) => (
            <Box key={point.id || `pickup-${index}`} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700 }}>Пункт {index + 1}</Typography>
                <Button color="error" size="small" onClick={() => removeRow(setForm, form, 'pickupPoints', index)}>Удалить</Button>
              </Stack>
              <Stack spacing={1.5}>
                <TextField label="Название" placeholder="Магазин на Советской" value={point.title} onChange={(event) => updateRow(setForm, form, 'pickupPoints', index, { title: event.target.value })} />
                <TextField label="Адрес" placeholder="ул. Советская, 10" value={point.address} onChange={(event) => updateRow(setForm, form, 'pickupPoints', index, { address: event.target.value })} />
                <TextField label="Часы работы" placeholder="Пн–Пт 9:00–21:00" value={point.hours || ''} onChange={(event) => updateRow(setForm, form, 'pickupPoints', index, { hours: event.target.value })} />
              </Stack>
            </Box>
          ))}
          {(form.pickupPoints || []).length === 0 && (
            <Typography variant="body2" color="text.secondary">Пунктов выдачи нет.</Typography>
          )}
          <Button variant="outlined" onClick={() => setForm({ ...form, pickupPoints: [...(form.pickupPoints || []), { ...EMPTY_PICKUP }] })}>Добавить пункт</Button>
          </Section>

          <Section title="Оплата">
          {(form.paymentMethods || []).map((method, index) => (
            <Box key={method.id || `pay-${index}`} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField fullWidth label={`Способ оплаты ${index + 1}`} placeholder="Картой при получении" value={method.title} onChange={(event) => updateRow(setForm, form, 'paymentMethods', index, { title: event.target.value })} />
                <Button color="error" onClick={() => removeRow(setForm, form, 'paymentMethods', index)}>Удалить</Button>
              </Stack>
            </Box>
          ))}
          {(form.paymentMethods || []).length === 0 && (
            <Typography variant="body2" color="text.secondary">Способов оплаты нет.</Typography>
          )}
          <Button variant="outlined" onClick={() => setForm({ ...form, paymentMethods: [...(form.paymentMethods || []), { ...EMPTY_PAYMENT }] })}>Добавить оплату</Button>
          </Section>

          <Section title="Страница «Рассрочка»" hint="Это отдельная страница, не карточка на главной. Пункты — каждый с новой строки.">
            <SiteField label="Первый платёж, %" value={form.downPaymentPercent} shown={form.publicFields?.downPayment !== false} onChange={(event) => set({ downPaymentPercent: event.target.value })} onShown={(shown) => setShown(setForm, form, 'downPayment', shown)} />
            <TextField label="Пункты условий" value={form.installmentBullets} onChange={(event) => set({ installmentBullets: event.target.value })} multiline minRows={4} />
            <TextField label="Мессенджеры" placeholder="viber|https://..." helperText="Каждая строка: название|ссылка" value={form.messengersText} onChange={(event) => set({ messengersText: event.target.value })} multiline minRows={2} />
          </Section>

          <Section title="Текст внизу главной" hint="Абзацы разделяйте пустой строкой. Вопросы: одна строка — вопрос|ответ.">
            <TextField label="Текст о городе" value={form.aboutText || ''} onChange={(event) => set({ aboutText: event.target.value })} multiline minRows={4} />
            <TextField label="Вопросы и ответы" placeholder="Как получить заказ?|Курьер привезёт на следующий день" value={form.faqText || ''} onChange={(event) => set({ faqText: event.target.value })} multiline minRows={4} />
          </Section>

          <Button variant="contained" size="large" onClick={save} disabled={saving || !selected}>
            {saving ? 'Сохраняю…' : 'Сохранить город'}
          </Button>
        </Stack>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Баннеры</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Пустой список городов означает «все города». Иначе укажите слаги через запятую: grodno, brest.
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {banners.map((item) => (
            <Stack key={item.id} direction="row" justifyContent="space-between">
              <Typography>{item.title} — {item.citySlugs?.length ? item.citySlugs.join(', ') : 'все города'}</Typography>
              <Button color="error" onClick={async () => {
                await fetch(`/api/admin/banners/${item.id}`, { method: 'DELETE' });
                await load();
              }}>Удалить</Button>
            </Stack>
          ))}
        </Stack>
        <Stack spacing={1}>
          <TextField label="Заголовок" value={banner.title} onChange={(event) => setBanner({ ...banner, title: event.target.value })} />
          <TextField label="Текст" value={banner.subtitle} onChange={(event) => setBanner({ ...banner, subtitle: event.target.value })} />
          <TextField label="Ссылка" value={banner.href} onChange={(event) => setBanner({ ...banner, href: event.target.value })} />
          <TextField label="Города" value={banner.citySlugs} onChange={(event) => setBanner({ ...banner, citySlugs: event.target.value })} />
          <Button variant="outlined" onClick={createBanner}>Добавить баннер</Button>
        </Stack>
      </Box>
    </Container>
  );
}

function toForm(city) {
  const cards = resolveHomeCards(city);
  return {
    ...city,
    isDefault: city.isDefault,
    downPaymentPercent: city.installmentTerms?.downPaymentPercent ?? 10,
    installmentBullets: (city.installmentTerms?.bullets || []).join('\n'),
    aboutText: (city.aboutParagraphs || []).join('\n\n'),
    homeHeroTitle: cards.heroTitle,
    homeHeroText: cards.heroText,
    homeInstallmentTitle: cards.installmentTitle,
    homeInstallmentPoints: cards.installmentPoints.join('\n'),
    homeSalesTitle: cards.salesTitle,
    homeSalesText: cards.salesText,
    homeDeliveryTitle: cards.deliveryTitle,
    homeDeliveryText: cards.deliveryText,
    faqText: (city.faq || []).map((item) => `${item.q || item.question || ''}|${item.a || item.answer || ''}`).join('\n'),
    deliveryLocalities: (city.deliveryLocalities || []).join(', '),
    publicFields: city.publicFields && typeof city.publicFields === 'object' ? city.publicFields : {},
    messengersText: (city.messengers || []).map((item) => `${item.type || 'link'}|${item.url || ''}`).join('\n'),
  };
}

function updateRow(setForm, form, key, index, patch) {
  const next = form[key].map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row));
  setForm({ ...form, [key]: next });
}

function removeRow(setForm, form, key, index) {
  setForm({ ...form, [key]: form[key].filter((_, rowIndex) => rowIndex !== index) });
}

function setShown(setForm, form, key, shown) {
  setForm({ ...form, publicFields: { ...(form.publicFields || {}), [key]: shown } });
}

function Section({ title, hint, children }) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: hint ? 0.5 : 2 }}>{title}</Typography>
      {hint ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{hint}</Typography>
      ) : null}
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
}

function SiteField({ label, value, onChange, shown, onShown, switchLabel = 'На сайте', placeholder, helperText }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
      <TextField fullWidth label={label} placeholder={placeholder} helperText={helperText} value={value ?? ''} onChange={onChange} />
      <FormControlLabel
        sx={{ m: 0, minWidth: 210, flexShrink: 0 }}
        control={<Switch checked={shown} onChange={(event) => onShown(event.target.checked)} />}
        label={switchLabel}
      />
    </Stack>
  );
}
