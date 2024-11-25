import styles from './page.module.css'

const Loading = () => {
	return (
		<div className={styles.loadingContainer}>
			<div className={styles.loader}></div>
			<p className={styles.loadingText}>Loading...</p>
		</div>
	)
}

export default Loading
