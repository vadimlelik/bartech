import React from 'react'
import styles from './footer.module.css'
import Link from 'next/link'
import { FaInstagram, FaTiktok, FaTelegramPlane } from 'react-icons/fa'

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.text}>
						ООО «Баратех» УНП: 193796252 <br /> Юридический и почтовый адрес:
						220068, г. Минск, ул. Червякова, д. 60, пом. 179
						<br /> +375257766462
					</div>
					<div className={styles.social}>
						<a
							href='https://instagram.com'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaInstagram size={30} style={{ color: 'black' }} />
						</a>
						<a
							href='https://tiktok.com'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaTiktok size={30} style={{ color: 'black' }} />
						</a>
						<a
							href='https://telegram.org'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaTelegramPlane size={30} style={{ color: 'black' }} />
						</a>
					</div>
					<div className={styles.offer}>
						<ul className={styles['footer__offer__list']}>
							<li className={styles['footer__offer__item']}>
								<Link className={styles['footer__offer__link']} href={'/'}>
									Политика конфиденциальности
								</Link>
							</li>
							<li className={styles['footer__offer__item']}>
								<Link className={styles['footer__offer__link']} href={'/'}>
									Публичная оферта
								</Link>
							</li>
							<li className={styles['footer__offer__item']}>
								<Link href={'/'} className={styles['footer__offer__link']}>
									Возврат товара
								</Link>
							</li>
							<li className={styles['footer__offer__item']}>
								<Link className={styles['footer__offer__link']} href={'/'}>
									Условия рассрочки и сертификация
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
