'use client'

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
} from '@mui/material'
import { useRouter } from 'next/navigation'

export default function CategoryCard({ id, name, image, description }) {
    const router = useRouter()

    return (
        <Card 
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            <CardActionArea 
                onClick={() => router.push(`/categories/${id}`)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                <Box sx={{ position: 'relative', paddingTop: '60%' }}>
                    <CardMedia
                        component="img"
                        image={image}
                        alt={name}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            p: 2,
                        }}
                    />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h2" 
                        align="center"
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                        }}
                    >
                        {name}
                    </Typography>
                    {description && (
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            align="center"
                            sx={{ mt: 'auto' }}
                        >
                            {description}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
