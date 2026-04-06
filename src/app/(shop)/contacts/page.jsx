import { Container, Typography, Box, Paper, Grid, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import { getLocalBusinessSchema } from '@/shared/lib/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';

export const metadata = {
  title: 'Контакты — Texnobar | Интернет-магазин техники в Минске',
  description:
    'Контакты интернет-магазина Texnobar в Минске. Адрес: ул. Сурганова, 43. Телефон: +375 (25) 776-64-62. Режим работы: Пн–Пт 9:00–21:00. ООО «Баратех», УНП 193796252.',
  alternates: {
    canonical: `${siteUrl}/contacts`,
  },
  openGraph: {
    title: 'Контакты — Texnobar | Интернет-магазин техники в Минске',
    description:
      'Адрес: г. Минск, ул. Сурганова, 43. Телефон: +375 (25) 776-64-62. Работаем Пн–Пт 9:00–21:00.',
    url: `${siteUrl}/contacts`,
    type: 'website',
  },
};

export default function Contacts() {
  const localBusinessSchema = getLocalBusinessSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Контактная информация
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Компания</Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1, pl: 5 }}>
                  ООО «Баратех»
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, pl: 5 }}>
                  УНП: 193796252
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon
                    color="primary"
                    sx={{ fontSize: 30, mr: 2 }}
                  />
                  <Typography variant="h6">Адрес</Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  220013, г. Минск, ул. Сурганова, д. 43, пом. 804
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon
                    color="primary"
                    sx={{ fontSize: 30, mr: 2 }}
                  />
                  <Typography variant="h6">Время работы</Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  Понедельник - пятница, с 9:00 до 21:00
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Телефон</Typography>
                </Box>
                <Link
                  href="tel:+375 44 741-84-23"
                  sx={{
                    textDecoration: 'none',
                    color: 'text.primary',
                    pl: 5,
                    display: 'block',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Typography variant="body1">+375 (25) 776-64-62</Typography>
                </Link>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
                  <Typography variant="h6">Email</Typography>
                </Box>
                <Link
                  href="mailto:baratexby@gmail.com"
                  sx={{
                    textDecoration: 'none',
                    color: 'text.primary',
                    pl: 5,
                    display: 'block',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Typography variant="body1">baratexby@gmail.com</Typography>
                </Link>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon
                    color="primary"
                    sx={{ fontSize: 30, mr: 2 }}
                  />
                  <Typography variant="h6">
                    Органы, осуществляющие контроль за деятельностью
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  +375 17 318-13-33; +375 17 360-82-11 – администрация
                  Советского района г. Минска, отдел торговли
                  <br />
                  Адрес: г. Минск, ул. Дорошевича, 8
                  <br />
                  Электронный адрес: sovadm@minsk.gov.by
                  <br />
                  +375 17 218-00-82 – главное управление торговли и услуг
                  Мингорисполкома
                  <br />
                  Лицо, уполномоченное рассматривать обращения покупателей о
                  нарушении их прав, предусмотренных законодательством о защите
                  прав потребителей, – специалист отдела рекламаций, контактный
                  телефон +375 44 741-84-23
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
