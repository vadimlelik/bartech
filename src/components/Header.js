'use client';

import { useState, useEffect } from 'react';
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
import { useCartStore } from '../store/cart';
import { useFavoritesStore } from '../store/favorites';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartItems } = useCartStore();
  const { favorites } = useFavoritesStore();

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
          {/* Бургер меню для мобильных */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Логотип */}
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

          {/* Навигация для десктопа */}
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
          </Box>

          {/* Контактная информация и иконки */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 3 },
            }}
          >
            {/* Контакты */}
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

            {/* Иконки корзины и закладок */}
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
            </Box>
          </Box>
        </Toolbar>
      </Container>

      {/* Мобильное меню */}
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
            <Divider />
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
    </AppBar>
  );
}
