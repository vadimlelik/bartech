'use client'

import { Box, Container, Grid, Typography, Link as MuiLink, useTheme, useMediaQuery } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                py: { xs: 4, md: 6 },
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 2, md: 4 }}>
                    {/* Юридическая информация */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            Контактная информация
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            ООО «Баратех» УНП: 193796252
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            Юридический и почтовый адрес: 220068, г. Минск, ул. Червякова, д. 60, пом. 179
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            <MuiLink href="tel:+375257766462" color="inherit">
                                +375 25 776-64-62
                            </MuiLink>
                        </Typography>
                    </Grid>

                    {/* Ссылки */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            Информация
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: { xs: 1, md: 1.5 },
                            '& a': {
                                fontSize: { xs: '0.875rem', md: '1rem' }
                            }
                        }}>
                            <Link href="/privacy" passHref style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Политика конфиденциальности
                                </Typography>
                            </Link>
                            <Link href="/offer" passHref style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Публичная оферта
                                </Typography>
                            </Link>
                            <Link href="/return" passHref style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Возврат товара
                                </Typography>
                            </Link>
                            <Link href="/installment" passHref style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Условия рассрочки и сертификация
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>

                    {/* Дополнительная информация */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: { xs: 1.5, md: 2 },
                            '& .MuiTypography-root': {
                                fontSize: { xs: '0.875rem', md: '1rem' }
                            }
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                © 2018-2024 ООО «В тренде»
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Продвижение сайта ZELKIRAL
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Работает на MixCMS
                            </Typography>
                            <Box sx={{ mt: { xs: 1, md: 2 } }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Варианты оплаты
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: { xs: 1, md: 2 }, 
                                    mt: 1,
                                    '& img': {
                                        width: { xs: '32px', md: '40px' },
                                        height: 'auto'
                                    }
                                }}>
                                    <Image src="/payment-visa.png" alt="Visa" width={40} height={25} />
                                    <Image src="/payment-mastercard.png" alt="Mastercard" width={40} height={25} />
                                    <Image src="/payment-belcard.png" alt="BelCard" width={40} height={25} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
