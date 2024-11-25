import React from 'react'
import styles from './footer.module.css'
import Link from 'next/link'

const Footer = ({ isLanding = false }) => {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.text}>
						ООО «Баратех» УНП: 193796252 <br /> Юридический и почтовый адрес:
						220068, г. Минск, ул. Червякова, д. 60, пом. 179
						<br /> +375257766462
					</div>
					<div className={styles.offer}>
						<ul className={styles['footer__offer__list']}>
							<li className={styles['footer__offer__item']}>
								<Link
									className={styles['footer__offer__link']}
									href={'pk'}
									target='_blank'
								>
									Политика конфиденциальности
								</Link>
							</li>
							<li className={styles['footer__offer__item']}>
								<Link
									target='_blank'
									className={styles['footer__offer__link']}
									href={'po'}
								>
									Публичная оферта
								</Link>
							</li>
							<li className={styles['footer__offer__item']}>
								<Link
									target='_blank'
									href={'guarantee'}
									className={styles['footer__offer__link']}
								>
									Возврат товара
								</Link>
							</li>
							{!isLanding && (
								<li className={styles['footer__offer__item']}>
									<Link
										className={styles['footer__offer__link']}
										href={'/pass'}
										target='_blank'
									>
										Условия рассрочки и сертификация
									</Link>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
