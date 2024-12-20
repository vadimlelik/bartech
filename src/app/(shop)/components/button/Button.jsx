'use client'

import React from 'react'
import classNames from 'classnames'
import styles from './Button.module.css'

const Button = ({
	type,
	label,
	color = 'primary',
	size = 'default',
	onClick,
	className,
}) => {
	return (
		<button
			type={type}
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
