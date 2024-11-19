import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoIosArrowForward } from 'react-icons/io'
import styles from './categoriesItem.module.css'

const CategoriesItem = ({ id, name, imageUrl }) => {
	return (
		<Link key={id} href={`/category/${id}`} className={styles.categoriesItem}>
			<span className={styles.categoriesName}>
				{name}
				<IoIosArrowForward className={styles.categoriesIcon} />
			</span>
			<Image
				src={imageUrl}
				width={400}
				height={300}
				layout='responsive'
				alt={name}
			/>
		</Link>
	)
}

export default CategoriesItem
