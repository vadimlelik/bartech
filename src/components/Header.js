'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ContactsIcon from '@mui/icons-material/Contacts';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useCartStore } from '../store/cart';
import { useFavoritesStore } from '../store/favorites';
import { useAuthStore } from '@/store/auth';
import CreditCardsModal from './CreditCards/CreditCardsModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { cartItems } = useCartStore();
  const { favorites } = useFavoritesStore();
  const { user, profile, signOut, isAdmin, loading: authLoading } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { text: 'Каталог', href: '/', icon: <StorefrontIcon /> },
    {
      text: 'Оплата и доставка',
      href: '/payment_delivery',
      icon: <LocalShippingIcon />,
    },
    { text: 'Отзывы', href: '/reviews', icon: <RateReviewIcon /> },
    { text: 'Контакты', href: '/contacts', icon: <ContactsIcon /> },
  ];

  const handleCreditClick = (e) => {
    e.preventDefault();
    setCreditModalOpen(true);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            py: { xs: 1, md: 2 },
          }}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/logo_techno_bar.svg"
                alt="Techno Bar"
                width={200}
                height={50}
                priority
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxHeight: { xs: '30px', md: '40px' },
                }}
              />
            </Box>
          </Link>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 3,
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                passHref
                style={{ textDecoration: 'none' }}
              >
                <Button color="inherit" startIcon={item.icon}>
                  {item.text}
                </Button>
              </Link>
            ))}
            <Button
              color="inherit"
              startIcon={<CreditCardIcon />}
              onClick={handleCreditClick}
            >
              Рассрочка
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 3 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, fontSize: '1rem' }} />
                <Typography
                  variant="body2"
                  component="a"
                  href="tel:+375 44 741-84-23"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  +375 44 741-84-23
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 1, fontSize: '1rem' }} />
                <Typography variant="body2">пн.- пт.: 9:30 - 21:30</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link
                href="/favorites"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Tooltip title="Закладки">
                  <IconButton color="inherit">
                    {mounted ? (
                      <Badge badgeContent={favorites.length} color="primary">
                        <FavoriteIcon />
                      </Badge>
                    ) : (
                      <FavoriteIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Link>

              <Link
                href="/cart"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Tooltip title="Корзина">
                  <IconButton color="inherit">
                    {mounted ? (
                      <Badge badgeContent={cartItems.length} color="primary">
                        <ShoppingCartIcon />
                      </Badge>
                    ) : (
                      <ShoppingCartIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Link>

              {mounted && !authLoading && isAdmin() && (
                <Link
                  href="/admin"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Tooltip title="Админ-панель">
                    <IconButton color="inherit">
                      <AdminPanelSettingsIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              )}

              {mounted && !authLoading && (
                <Tooltip title={user ? 'Выйти' : 'Войти'}>
                  <IconButton
                    color="inherit"
                    onClick={async () => {
                      if (user) {
                        await signOut(router);
                      } else {
                        router.push('/auth/login');
                      }
                    }}
                  >
                    {user ? <LogoutIcon /> : <LoginIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="left" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileMenu}
          onKeyDown={toggleMobileMenu}
        >
          <List>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                passHref
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem button>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
            <ListItem button onClick={handleCreditClick}>
              <ListItemIcon>
                <CreditCardIcon />
              </ListItemIcon>
              <ListItemText primary="Рассрочка" />
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
                {isAdmin() && (
                  <Link
                    href="/admin"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <ListItem button>
                      <ListItemIcon>
                        <AdminPanelSettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Админ-панель" />
                    </ListItem>
                  </Link>
                )}
                <ListItem
                  button
                  onClick={async () => {
                    await signOut(router);
                    toggleMobileMenu();
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Выйти" />
                </ListItem>
                <Divider />
              </>
            )}
            {mounted && !authLoading && !user && (
              <>
                <Link
                  href="/auth/login"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="Войти" />
                  </ListItem>
                </Link>
                <Divider />
              </>
            )}
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="tel:+375 44 741-84-23"
                    sx={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    +375 44 741-84-23
                  </Typography>
                }
                secondary="пн.- пт.: 9:30 - 21:30"
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <CreditCardsModal
        isOpen={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
      />
    </AppBar>
  );
}
