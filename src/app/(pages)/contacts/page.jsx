import Footer from '@/shared/ui/footer/Footer'
import Header from '@/shared/ui/header/Header'
import styles from './contactPage.module.css'
import React from 'react'

const Contacts = () => {
	return (
		<div className={styles.page}>
			<Header />
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.text}></div>
					<h1>Свяжитесь с нами:</h1>
					<p>ООО «Баратех» УНП: 193796252</p>
					<p>
						Юридический и почтовый адрес: 220068, г. Минск, ул. Червякова, д.
						60, пом. 179
					</p>
					<p>Время работы: понедельник - пятница, с 9:30 до 21:30</p>
					<p>Тел.: +375257766462</p>
					<p>Электронная почта: baratexby@gmail.com</p>
					<p>
						Текущий (расчетный): BY07BPSB30123442980159330000 в BYN в ОАО
						&ldquo;Сбербанк&ldquo;, БИК: BPSBBY2X
					</p>
				</div>
			</main>
			<Footer />
		</div>
	)
}

export default Contacts
