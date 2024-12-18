export const formatPrice = (price) => {
    if (!price) return '0 ₽'
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(price)
}
