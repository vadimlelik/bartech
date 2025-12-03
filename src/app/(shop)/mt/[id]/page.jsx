'use client';
import { useCartStore } from '@/store/cart';
import styles from './page.module.css';
import { useParams } from 'next/navigation';

const products = [
  {
    id: 1,
    title: 'Мотоблок Беларус 09Н-02 Lifan 9 л.с.',
    price: 6200,
    description: `КОМПЛЕКТАЦИЯ: Плуг П-5, Окучник ОД-5, Сцепка СУ-5, Борона Б-5.

Мотоблок предназначен для пахоты, боронования, культивации, междурядной обработки, кошения трав и транспортировки грузов.

Преимущества:
1. Повышенный КПД
2. Автоматическое отключение двигателя при низком уровне масла
3. Большой вес (176 кг) для тяжелых почв
4. Регулируемая колея, утяжелители колес
5. Компактность и удобное хранение
6. Пневматические колеса 6Lх12,00

Характеристики:
- Масса: 176±10 кг
- Габариты: 1780×846×1070 мм
- Колея: 450, 600, 700 мм
- Скорость: 2.6–11.4 км/ч (вперед), 3–5.35 км/ч (назад)
- Топливо: бензин А-92, бак 6 л`,
    details: '',
    image: '/images/mt/img_9_1.png',
  },
  {
    id: 2,
    title: 'Мотоблок Беларус 012 WM Weima 13 л.с.',
    price: 6400,
    description: `КОМПЛЕКТАЦИЯ: Плуг П-5, Окучник ОД-5, Сцепка СУ-5, Борона Б-5.

Преимущества:
- Современные технологии
- Гарантия 2 года
- Мощный двигатель Weima GX390 (13 л.с.)
- Регулируемая колея (450–700 мм)
- Дорожный просвет 295 мм
- Несколько передач (4 вперед/2 назад)

Характеристики:
- Габариты: 1780×846×1070 мм
- Вес: 176 кг
- Мощность: 13 л.с.
- Объем бака: 6,1 л
- ВОМ: есть
- Колеса: 6Lх12
- Грузоподъемность: 650 кг`,
    details: '',
    image: '/images/mt/img_13_1.jpg',
  },
  {
    id: 3,
    title: 'Мотоблок Беларус 012 WM Rato 420 15 л.с.',
    price: 6600,
    description: `КОМПЛЕКТАЦИЯ: Плуг П-5, Окучник ОД-5, Сцепка СУ-5, Борона Б-5. В подарок: утяжелители, сцепка, горловина.

Преимущества:
- Универсальность: культивация, вспашка, уборка урожая
- Реверсивная рулевая штанга
- Вал отбора мощности 1200 об/мин
- Дифференциал с блокировкой
- Регулируемая колея (450–700 мм)
- Масса: 176 кг
- Сцепление: многодисковое
- Тормоза: на прицепе

Двигатель: RATO R420 (15 л.с.), воздушное охлаждение, датчик уровня масла`,
    details: '',
    image: '/images/mt/img_13_1.jpg',
  },
];
export default function ProductPage() {
  const params = useParams();
  const product = products.find((p) => p.id === Number(params.id));

  const { addToCart } = useCartStore();
  if (!product) {
    return <div className={styles.container}>Товар не найден</div>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <img src={product.image} alt={product.title} className={styles.image} />
        <div className={styles.content}>
          <h1 className={styles.title}>{product.title}</h1>
          <span className={styles.price}>{product.price} руб.</span>
          <pre className={styles.description}>{product.description}</pre>
          <button
            className={styles.button}
            onClick={() => addToCart({ ...product, name: product.title })}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </main>
  );
}
