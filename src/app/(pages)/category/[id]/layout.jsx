import styles from './category.module.css'

export default function CategoryLayout({ children }) {
	return (
		<div className={styles.CategoryLayout}>
			<div className={styles.CategoryContainer}>{children}</div>
		</div>
	)
}
