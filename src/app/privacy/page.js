export default function Privacy() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>Политика конфиденциальности</h1>

			<div className='prose max-w-none'>
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>1. Общие положения</h2>
					<p>
						Настоящая политика конфиденциальности описывает, как мы собираем,
						используем и защищаем вашу личную информацию при использовании
						нашего сайта.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>2. Сбор информации</h2>
					<p>Мы собираем информацию, которую вы предоставляете нам напрямую:</p>
					<ul className='list-disc ml-6 mt-2'>
						<li>Имя и контактная информация</li>
						<li>Адрес доставки</li>
						<li>История заказов</li>
					</ul>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>
						3. Использование информации
					</h2>
					<p>Мы используем собранную информацию для:</p>
					<ul className='list-disc ml-6 mt-2'>
						<li>Обработки ваших заказов</li>
						<li>Улучшения работы сайта</li>
						<li>Связи с вами по поводу заказов</li>
					</ul>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>4. Защита информации</h2>
					<p>
						Мы принимаем необходимые меры для защиты вашей личной информации от
						несанкционированного доступа, использования или раскрытия.
					</p>
				</section>

				<section className='mb-8'>
					<h2 className='text-2xl font-semibold mb-4'>5. Контакты</h2>
					<p>
						Если у вас есть вопросы о нашей политике конфиденциальности,
						пожалуйста, свяжитесь с нами.
					</p>
				</section>
			</div>
		</div>
	)
}
