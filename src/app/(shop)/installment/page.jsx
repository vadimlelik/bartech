export default function Installment() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Покупка в рассрочку</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Условия рассрочки</h2>
          <p>
            Мы предлагаем возможность покупки товаров в рассрочку на следующих
            условиях:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Срок рассрочки: до 12 месяцев</li>
            <li>Первоначальный взнос: от 10%</li>
            <li>Без переплат и скрытых комиссий</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
