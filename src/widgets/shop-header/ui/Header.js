'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { startRouteProgress } from '@/shared/lib/route-progress';
import dynamic from 'next/dynamic';
import {
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  InputBase,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContactsIcon from '@mui/icons-material/Contacts';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import { useCity } from '@/entities/city';
import { categoryPublicPath } from '@/shared/lib/category-path';
import CitySuggest from '@/entities/city/ui/CitySuggest';
import { useServiceCity } from '@/entities/locality/ui/useServiceCity';
import CityPickDialog from '@/entities/city/ui/CityPickDialog';
import {
  CITY_COOKIE_NAME,
  citySwitchHref,
  isCityContentPath,
  stripCityPrefix,
} from '@/shared/config/city-routes';
import { cityCall } from '@/entities/city/lib/city-content';
import { useFavoritesStore } from '@/entities/favorites';
import { useCompareStore } from '@/entities/compare';
import { useAuthStore } from '@/features/auth';
import CatalogBrowser from '@/widgets/catalog-menu/ui/CatalogBrowser';

const CreditCardsModal = dynamic(
  () => import('@/features/credit-cards/ui/CreditCardsModal'),
  { ssr: false }
);

const TOP_LINKS = [
  { text: 'Оплата и доставка', href: '/payment_delivery' },
  { text: 'Рассрочка', href: '/installment' },
  { text: 'Возврат и гарантия', href: '/guarantee' },
  { text: 'Контакты', href: '/contacts' },
  { text: 'Отзывы', href: '/reviews' },
  { text: 'Акции', href: '/sales' },
];

const CITY_PROMPT_KEY = 'city-prompt-seen';
const BOT_UA = /googlebot|adsbot-google|mediapartners-google|yandex|bingbot|duckduckbot|baiduspider|slurp|facebot|applebot|petalbot|semrushbot|ahrefsbot/i;

function hasCityCookie() {
  return document.cookie.split(';').some((part) => part.trim().startsWith(`${CITY_COOKIE_NAME}=`));
}

function rememberCityPrompt() {
  try {
    window.localStorage.setItem(CITY_PROMPT_KEY, '1');
  } catch {
    // Приватный режим может запретить localStorage.
  }
}

const DRAWER_ITEMS = [
  { text: 'Каталог', href: '/catalog', icon: MenuIcon },
  { text: 'Сравнение', href: '/compare', icon: CompareArrowsIcon },
  { text: 'Оплата и доставка', href: '/payment_delivery', icon: LocalShippingIcon },
  { text: 'Отзывы', href: '/reviews', icon: RateReviewIcon },
  { text: 'Акции', href: '/sales', icon: LocalOfferIcon },
  { text: 'Контакты', href: '/contacts', icon: ContactsIcon },
];

function ActionLink({ href, label, icon, count, mounted, compact = false }) {
  return (
    <Box
      component={Link}
      href={href}
      aria-label={label}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'inherit',
        textDecoration: 'none',
        minWidth: compact ? 44 : { xs: 44, md: 72 },
        minHeight: 44,
        gap: 0.25,
        '&:hover': { color: '#1D6FE8' },
      }}
    >
      <Badge
        badgeContent={mounted ? count : 0}
        color="error"
        invisible={!mounted || !count}
        sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}
      >
        {icon}
      </Badge>
      {!compact && (
        <Typography
          sx={{ display: { xs: 'none', md: 'block' }, fontSize: 12, lineHeight: 1.1, color: '#6B7683' }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}

export default function Header({ catalogGroups = [] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [cityDialogOpen, setCityDialogOpen] = useState(false);
  const [cityPrompt, setCityPrompt] = useState(false);
  const headerRef = useRef(null);
  const catalogButtonRef = useRef(null);
  const mobileCatalogButtonRef = useRef(null);
  const panelRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { commerceCity, pageCity, cities, href, setCommerceSlug } = useCity();
  const serviceCity = useServiceCity();
  const city = commerceCity || pageCity;
  const cityLabel = `г. ${city?.name || 'Минск'}`;
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);
  const compareCount = useCompareStore((state) => state.compareItems.length);
  const {
    user,
    profile,
    signOut,
    isAdmin,
    loading: authLoading,
    init,
  } = useAuthStore();

  const popularCategories = catalogGroups.flatMap((group) => group.categories || []).slice(0, 10);
  const phone = cityCall(serviceCity);

  useEffect(() => {
    setMounted(true);
    const currentQuery = new URLSearchParams(window.location.search).get('q');
    if (currentQuery) setQuery(currentQuery);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 899.95px)');
    const apply = () => {
      document.documentElement.style.setProperty(
        '--shop-dock',
        media.matches ? 'calc(56px + env(safe-area-inset-bottom))' : '0px'
      );
      document.documentElement.style.setProperty('--header-offset', media.matches ? '64px' : '128px');
    };
    apply();
    media.addEventListener('change', apply);
    return () => {
      media.removeEventListener('change', apply);
      document.documentElement.style.removeProperty('--shop-dock');
    };
  }, []);

  const closeCatalog = useCallback((returnFocus = true) => {
    setCatalogOpen(false);
    if (returnFocus) catalogButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    setCatalogOpen(false);
    setMobileCatalogOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!catalogOpen) return undefined;
    const closeOnOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) closeCatalog(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeCatalog(true);
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    const first = panelRef.current?.querySelector('button, a');
    first?.focus();
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [catalogOpen, closeCatalog]);

  const handleCreditClick = useCallback((event) => {
    event.preventDefault();
    setCreditModalOpen(true);
    setMobileMenuOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const fromField = new FormData(event.currentTarget).get('q');
    const value = String(fromField || query).trim();
    if (!value) return;
    setSearchOpen(false);
    router.push(href(`/search?q=${encodeURIComponent(value)}`));
  };

  useEffect(() => {
    if (pathname.startsWith('/admin')) return undefined;
    if (BOT_UA.test(navigator.userAgent || '')) return undefined;
    if (hasCityCookie()) return undefined;
    try {
      if (window.localStorage.getItem(CITY_PROMPT_KEY)) return undefined;
    } catch {
      return undefined;
    }
    setCityPrompt(true);
    setCityDialogOpen(true);
    return undefined;
  }, [pathname]);

  const closeCityDialog = () => {
    rememberCityPrompt();
    setCityDialogOpen(false);
  };

  const switchCity = (slug) => {
    rememberCityPrompt();
    setCityDialogOpen(false);
    if (!slug) return;
    fetch('/api/cities/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
    if (slug === city?.slug) return;
    setCommerceSlug(slug);
    const knownSlugs = cities.map((item) => item.slug);
    const barePath = stripCityPrefix(pathname, knownSlugs);
    // На витрине город живёт в адресе. На остальных страницах остаёмся здесь:
    // шапка и тексты берут выбранный город и обновляются без ухода со страницы.
    if (!isCityContentPath(barePath)) return;
    const next = citySwitchHref(
      slug,
      `${pathname}${window.location.search || ''}`,
      knownSlugs,
    );
    startRouteProgress(next);
    window.location.assign(next);
  };

  const accountLabel =
    mounted && user ? profile?.full_name || user.email?.split('@')[0] || 'Кабинет' : 'Войти';

  const searchForm = (
    <Box
      component="form"
      action="/search"
      method="get"
      onSubmit={submitSearch}
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fff',
        border: '1px solid #CBD2DC',
        borderRadius: '8px',
        height: 44,
        px: 1.5,
        minWidth: 0,
        '&:focus-within': { borderColor: '#1D6FE8' },
      }}
    >
      <InputBase
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Поиск по каталогу"
        inputProps={{ 'aria-label': 'Поиск по каталогу' }}
        sx={{ flex: 1, fontSize: 15, color: '#1F2933' }}
      />
      <IconButton type="submit" aria-label="Найти" sx={{ color: '#6B7683' }}>
        <SearchIcon />
      </IconButton>
    </Box>
  );

  return (
    <Box
      component="header"
      ref={headerRef}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: '#fff',
        color: '#1F2933',
        borderBottom: '1px solid #E1E5EB',
        width: '100%',
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'block' }, bgcolor: '#F3F5F8', borderBottom: '1px solid #E1E5EB' }}>
        <Box
          sx={{
            maxWidth: 1240,
            mx: 'auto',
            px: '20px',
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => setCityDialogOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={cityDialogOpen}
            aria-controls="city-dialog"
            aria-label="Выбрать город"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#1F2933',
              background: 'none',
              border: 0,
              cursor: 'pointer',
              font: 'inherit',
              p: 0,
              minHeight: 32,
            }}
          >
            <PlaceIcon sx={{ fontSize: 16, color: '#1D6FE8' }} />
            <Typography component="span" sx={{ fontSize: 13 }}>{cityLabel}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, overflow: 'auto' }}>
            {TOP_LINKS.map((item) => (
              <Typography
                key={item.href}
                component={Link}
                href={href(item.href)}
                sx={{ fontSize: 13, color: '#6B7683', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { color: '#1D6FE8' } }}
              >
                {item.text}
              </Typography>
            ))}
            <Typography
              component="button"
              onClick={handleCreditClick}
              sx={{
                fontSize: 13,
                color: '#6B7683',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                p: 0,
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                '&:hover': { color: '#1D6FE8' },
              }}
            >
              Карты рассрочки
            </Typography>
          </Box>
          {phone ? (
            <Box
              component="a"
              href={`tel:${phone.tel}`}
              aria-label={`Позвонить ${phone.display}`}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1F2933', textDecoration: 'none', fontSize: 13, fontWeight: 700, minHeight: 32 }}
            >
              <PhoneIcon sx={{ fontSize: 16, color: '#1D6FE8' }} />
              {phone.display}
            </Box>
          ) : (
            <Box sx={{ minHeight: 32, minWidth: 120 }} />
          )}
          {mounted && user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlineIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 13, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {accountLabel}
              </Typography>
              <Box
                component="button"
                type="button"
                onClick={() => signOut(router)}
                sx={{ color: '#6B7683', background: 'none', border: 0, cursor: 'pointer', font: 'inherit', fontSize: 13, p: 0 }}
              >
                Выйти
              </Box>
            </Box>
          ) : (
            <Box
              component={Link}
              href="/auth/login"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1F2933', textDecoration: 'none', fontSize: 13 }}
            >
              <PersonOutlineIcon sx={{ fontSize: 18 }} />
              Войти
            </Box>
          )}
        </Box>
      </Box>

      <CityPickDialog
        open={cityDialogOpen}
        cities={cities}
        currentSlug={city?.slug}
        hint={cityPrompt ? 'Каталог и товары откроются с адресом выбранного города.' : ''}
        onClose={closeCityDialog}
        onSelect={switchCity}
      />
      <CitySuggest
        currentSlug={city?.slug}
        cities={cities}
        onConfirm={switchCity}
        onChooseOther={() => setCityDialogOpen(true)}
      />

      <Box
        sx={{
          maxWidth: 1240,
          mx: 'auto',
          px: '20px',
          minHeight: { xs: 56, md: 72 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
        }}
      >
        <IconButton
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Открыть меню"
          sx={{ display: { md: 'none' }, color: '#1F2933' }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          component={Link}
          href={href('/')}
          aria-label="Techno Bar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            width: { xs: 112, sm: 168 },
            '& img': { width: '100%', height: 'auto' },
          }}
        >
          <Image src="/logo_techno_bar.svg" alt="Techno Bar" width={168} height={42} priority />
        </Box>

        <Button
          ref={catalogButtonRef}
          startIcon={<MenuIcon />}
          aria-expanded={catalogOpen}
          aria-controls="shop-catalog-browser"
          onClick={() => setCatalogOpen((open) => !open)}
          variant="contained"
          sx={{ display: { xs: 'none', md: 'inline-flex' }, flexShrink: 0, px: 2, height: 44 }}
        >
          Каталог
        </Button>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, minWidth: 0 }}>{searchForm}</Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ActionLink
              href={href('/compare')}
              label="Сравнение"
              icon={<CompareArrowsIcon />}
              count={compareCount}
              mounted={mounted}
            />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ActionLink
              href={href('/favorites')}
              label="Избранное"
              icon={<FavoriteBorderIcon />}
              count={favoritesCount}
              mounted={mounted}
            />
          </Box>
          <IconButton
            aria-label="Поиск"
            onClick={() => setSearchOpen(true)}
            sx={{ display: { md: 'none' }, color: '#1F2933' }}
          >
            <SearchIcon />
          </IconButton>
          {mounted && !authLoading && isAdmin() && (
            <IconButton
              aria-label="Админ-панель"
              onClick={async () => {
                await init();
                router.push('/admin');
              }}
              sx={{ color: '#1F2933' }}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {popularCategories.length > 0 && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, borderTop: '1px solid #E1E5EB' }}>
          <Box
            component="nav"
            aria-label="Популярные категории"
            sx={{
              maxWidth: 1240,
              mx: 'auto',
              px: '20px',
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              py: 1,
            }}
          >
            {popularCategories.map((category) => (
              <Box
                key={category.id}
                component={Link}
                href={href(categoryPublicPath(category.id))}
                sx={{
                  flex: '0 0 auto',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '18px',
                  bgcolor: '#F3F5F8',
                  color: '#1F2933',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  '&:hover': { bgcolor: '#E8F0FE', color: '#1D6FE8' },
                }}
              >
                {category.name}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {catalogOpen && (
        <Box
          id="shop-catalog-browser"
          ref={panelRef}
          role="dialog"
          aria-label="Каталог"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            zIndex: 20,
            px: { md: 2.5 },
            pb: 2,
            pt: 1.5,
            bgcolor: '#fff',
            borderTop: '1px solid #E1E5EB',
            boxShadow: '0 8px 24px rgba(31, 41, 51, 0.08)',
          }}
        >
          <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
            <CatalogBrowser
              groups={catalogGroups}
              compact
              onNavigate={() => closeCatalog(true)}
            />
          </Box>
        </Box>
      )}

      <Box
        component="nav"
        aria-label="Быстрые действия"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          bgcolor: '#fff',
          borderTop: '1px solid #E1E5EB',
          minHeight: 56,
          pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <Button
          ref={mobileCatalogButtonRef}
          onClick={() => setMobileCatalogOpen(true)}
          aria-label="Каталог"
          sx={{ flex: 1, flexDirection: 'column', color: '#1F2933', minHeight: 56, fontSize: 11, gap: 0.25 }}
        >
          <MenuIcon fontSize="small" />
          Каталог
        </Button>
        <Button
          onClick={() => setSearchOpen(true)}
          aria-label="Поиск"
          sx={{ flex: 1, flexDirection: 'column', color: '#1F2933', minHeight: 56, fontSize: 11, gap: 0.25 }}
        >
          <SearchIcon fontSize="small" />
          Поиск
        </Button>
        <Button
          component={phone ? 'a' : 'button'}
          href={phone ? `tel:${phone.tel}` : undefined}
          aria-label={phone ? `Позвонить ${phone.display}` : 'Телефон не указан'}
          sx={{ flex: 1, flexDirection: 'column', color: '#1F2933', minHeight: 56, fontSize: 11, gap: 0.25 }}
        >
          <PhoneIcon fontSize="small" />
          Позвонить
        </Button>
      </Box>

      <Drawer
        anchor="left"
        open={mobileCatalogOpen}
        onClose={() => {
          setMobileCatalogOpen(false);
          mobileCatalogButtonRef.current?.focus();
        }}
        PaperProps={{ sx: { width: 'min(100%, 420px)' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>Каталог</Typography>
          <IconButton aria-label="Закрыть каталог" onClick={() => setMobileCatalogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <CatalogBrowser groups={catalogGroups} onNavigate={() => setMobileCatalogOpen(false)} />
      </Drawer>

      <Drawer anchor="bottom" open={searchOpen} onClose={() => setSearchOpen(false)}>
        <Box sx={{ p: 2, pb: 'calc(16px + env(safe-area-inset-bottom))' }}>
          <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Поиск</Typography>
          {searchForm}
        </Box>
      </Drawer>

      <Drawer anchor="left" open={mobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 300 }} role="presentation">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 1 }}>
            <Button
              startIcon={<PlaceIcon />}
              onClick={() => setCityDialogOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={cityDialogOpen}
              aria-controls="city-dialog"
              sx={{ color: '#1F2933' }}
            >
              {cityLabel}
            </Button>
            <IconButton aria-label="Закрыть меню" onClick={closeMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {DRAWER_ITEMS.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={href(item.href)} onClick={closeMobileMenu}>
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleCreditClick}>
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText primary="Карты рассрочки" />
              </ListItemButton>
            </ListItem>
            <Divider />
            {mounted && !authLoading && user && (
              <>
                <ListItem>
                  <ListItemText
                    primary={profile?.full_name || user.email}
                    secondary={isAdmin() ? 'Администратор' : 'Пользователь'}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={async () => {
                      await signOut(router);
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Выйти" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {mounted && !authLoading && !user && (
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/auth/login" onClick={closeMobileMenu}>
                  <ListItemIcon>
                    <PersonOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Войти" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      <CreditCardsModal isOpen={creditModalOpen} onClose={() => setCreditModalOpen(false)} />
    </Box>
  );
}
