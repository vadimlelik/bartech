export default function Offer() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Публичная оферта</h1>
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
          <p>
            Настоящий документ является публичной офертой и содержит все
            существенные условия договора купли-продажи товаров через
            интернет-магазин.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Предмет договора</h2>
          <p>
            Продавец обязуется передать в собственность Покупателю товар, а
            Покупатель обязуется оплатить и принять товар на условиях настоящего
            Договора.
          </p>
        </section>
      </div>
    </div>
  );
}
