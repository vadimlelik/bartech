'use client'

import React from 'react'
import classNames from 'classnames'
import styles from './Button.module.css'

const Button = ({
	label,
	color = 'primary',
	size = 'default',
	onClick,
	className,
}) => {
	return (
		<button
			className={classNames(
				styles.button,
				styles[color],
				styles[size],
				className
			)}
			onClick={onClick}
		>
			{label}
		</button>
	)
}

export default Button
