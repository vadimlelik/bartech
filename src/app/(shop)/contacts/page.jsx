import { Container, Typography, Box, Paper, Grid, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';

export default function Contacts() {
  return (
    <>
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
            {/* Основная информация */}
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
                  220068, г. Минск, ул. Червякова, д. 60, пом. 179
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
                  Понедельник - пятница, с 9:30 до 21:30
                </Typography>
              </Box>
            </Grid>

            {/* Контактная информация */}
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
                  <Typography variant="h6">Банковские реквизиты</Typography>
                </Box>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  Текущий (расчетный):
                </Typography>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  BY07BPSB30123442980159330000 в BYN
                </Typography>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  в ОАО &ldquo;Сбербанк&quot;
                </Typography>
                <Typography variant="body1" sx={{ pl: 5 }}>
                  БИК: BPSBBY2X
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
