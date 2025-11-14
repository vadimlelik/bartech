import style from './sales.module.css';

const Sales = () => {
  return (
    <div className={style.promo}>
      <h2 className={style.title}>АКЦИЯ с 14.11.2025 по 14.02.2026</h2>

      <div className={style.block}>
        <h3>1. При покупке смартфона</h3>
        <p>
          любых марок и моделей стоимостью от <strong>1000 BYN</strong> —
          получаете ПОДАРОК за <strong>1 BYN</strong> на выбор:
        </p>
        <ul>
          <li>Пауэрбэнк 22.5W Digital Display 20000mAh</li>
          <li>Беспроводные наушники XO T4Pods</li>
        </ul>
      </div>

      <div className={style.block}>
        <h3>2. При покупке бронетелефона CUBOT / CUBOT KINGKONG</h3>
        <p>
          стоимостью от <strong>1700 BYN</strong> — подарок за{' '}
          <strong>1 BYN</strong>:
        </p>
        <ul>
          <li>Пауэрбэнк 22.5W Digital Display 20000mAh</li>
          <li>Беспроводные наушники XO T4Pods</li>
          <li>Смартчасы Cubot X3</li>
        </ul>
      </div>

      <div className={style.block}>
        <h3>
          3. При покупке ноутбуков Ninkear / KUU / Chuwi / Horizont H-Book
        </h3>
        <p>
          от <strong>2500 BYN</strong> — подарок за <strong>1 BYN</strong>:
        </p>
        <ul>
          <li>Смартфон Xiaomi Redmi A5 3/64</li>
          <li>Набор Defender Target MKP-350</li>
        </ul>
      </div>

      <div className={style.block}>
        <h3>4. При покупке телевизора от 50″</h3>
        <p>
          от <strong>3000 BYN</strong> — подарок за <strong>1 BYN</strong>:
        </p>
        <ul>
          <li>Яндекс Станция Лайт 2</li>
          <li>Смартфон Xiaomi Redmi A5 3/64</li>
        </ul>
      </div>

      <div className={style.block}>
        <h3>5. При покупке стирально-сушильной машины</h3>
        <p>
          от <strong>3000 BYN</strong> — подарок за <strong>1 BYN</strong>:
        </p>
        <ul>
          <li>Яндекс Станция Лайт 2</li>
          <li>Аэрогриль Galaxy Line GL 2530</li>
        </ul>
      </div>
    </div>
  );
};

export default Sales;
