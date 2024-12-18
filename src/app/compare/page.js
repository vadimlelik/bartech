'use client'

import { useEffect, useState } from 'react'
import { useCompareStore } from '../../store/compare'
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Box,
    IconButton,
    styled
} from '@mui/material'
import Image from 'next/image'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/navigation'

// Styled компонент для подсветки различий
const HighlightedCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== 'isDifferent'
})(({ theme, isDifferent }) => ({
    backgroundColor: isDifferent ? 'rgba(255, 223, 126, 0.2)' : 'inherit',
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: isDifferent ? 'rgba(255, 223, 126, 0.4)' : theme.palette.action.hover,
    },
}))

export default function ComparePage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { compareItems, removeFromCompare } = useCompareStore()
    const router = useRouter()

    useEffect(() => {
        const fetchProducts = async () => {
            if (compareItems.length === 0) {
                setProducts([])
                setLoading(false)
                return
            }

            console.log('Compare items:', compareItems)

            try {
                const params = new URLSearchParams()
                // Добавляем каждый ID как отдельный параметр ids
                compareItems.forEach(id => params.append('ids', id))
                
                console.log('Request URL:', `/api/products?${params.toString()}`)
                const response = await fetch(`/api/products?${params.toString()}`)
                const data = await response.json()
                console.log('Fetched products:', data.products)
                
                if (!data.products || !Array.isArray(data.products)) {
                    console.error('Invalid products data:', data)
                    setProducts([])
                    return
                }
                
                // Убеждаемся, что порядок продуктов соответствует порядку в compareItems
                const orderedProducts = compareItems
                    .map(id => data.products.find(p => p._id === id))
                    .filter(Boolean)
                
                setProducts(orderedProducts)
            } catch (error) {
                console.error('Error fetching products for comparison:', error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [compareItems])

    const handleRemoveProduct = async (productId) => {
        console.log('Removing product:', productId)
        removeFromCompare(productId)
        
        // Если это был последний товар, перенаправляем на главную
        if (compareItems.length <= 1) {
            router.push('/')
        }
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Загрузка...</Typography>
            </Container>
        )
    }

    if (!products || products.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Нет товаров для сравнения
                </Typography>
                <Button variant="contained" onClick={() => router.push('/')}>
                    Вернуться к покупкам
                </Button>
            </Container>
        )
    }

    // Минимальное количество товаров для сравнения
    if (products.length < 2) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Добавьте еще товары для сравнения
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Для сравнения необходимо выбрать минимум 2 товара
                </Typography>
                <Button variant="contained" onClick={() => router.push('/')}>
                    Вернуться к покупкам
                </Button>
            </Container>
        )
    }

    // Функция для проверки различий в значениях
    const hasDifferences = (key) => {
        const values = products.map(product => {
            if (key === 'price') {
                return product.variants?.[0]?.price
            }
            return product.specifications?.[key]
        }).filter(value => value !== undefined && value !== null)
        return values.length > 0 && new Set(values).size > 1
    }

    // Функция для получения значения характеристики
    const getSpecValue = (product, spec) => {
        if (!product) return 'N/A'
        
        if (spec === 'price') {
            return product.variants?.[0]?.price ? 
                `${product.variants[0].price.toLocaleString()} ₽` : 
                'N/A'
        }
        
        if (spec === 'name') {
            return product.name || 'N/A'
        }
        
        return product.specifications?.[spec] || 'N/A'
    }

    // Список характеристик для сравнения
    const specs = [
        { key: 'name', label: 'Название' },
        { key: 'price', label: 'Цена' },
        { key: 'brand', label: 'Бренд' },
        { key: 'model', label: 'Модель' },
        { key: 'storage', label: 'Объем памяти' },
        { key: 'memory', label: 'Память' },
        { key: 'ram', label: 'Оперативная память' },
        { key: 'processor', label: 'Процессор' },
        { key: 'display', label: 'Дисплей' },
        { key: 'camera', label: 'Камера' },
        { key: 'battery', label: 'Батарея' },
        { key: 'os', label: 'Операционная система' },
        { key: 'color', label: 'Цвет' },
        { key: 'condition', label: 'Состояние' },
        { key: 'year', label: 'Год выпуска' }
    ]

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Сравнение товаров
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Характеристики</TableCell>
                            {products.map((product) => (
                                <TableCell key={product._id} align="center">
                                    <Box sx={{ position: 'relative' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveProduct(product._id)}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                zIndex: 1
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: 200,
                                                mb: 2
                                            }}
                                        >
                                            {product.images && product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {specs.map((spec) => (
                            <TableRow key={spec.key}>
                                <TableCell component="th" scope="row">
                                    {spec.label}
                                </TableCell>
                                {products.map((product) => (
                                    <HighlightedCell
                                        key={`${product._id}-${spec.key}`}
                                        align="center"
                                        isDifferent={hasDifferences(spec.key)}
                                    >
                                        {getSpecValue(product, spec.key)}
                                    </HighlightedCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/')}
                >
                    Продолжить покупки
                </Button>
            </Box>
        </Container>
    )
}
