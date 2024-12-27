import React from 'react'
import MaskedInput from 'react-text-mask'
import './InputMask.css'

const MaskedPhoneInput = ({ value, onChange, error, disabled }) => {
	const phoneMask = [
		'+',
		'3',
		'7',
		'5',
		' ',
		'(',
		/\d/,
		/\d/,
		')',
		' ',
		/\d/,
		/\d/,
		/\d/,
		'-',
		/\d/,
		/\d/,
		'-',
		/\d/,
		/\d/,
	]

	return (
		<div className='masked-input-container'>
			<MaskedInput
				mask={phoneMask}
				className={`masked-input ${error ? 'input-error' : ''}`}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder='+375 (__) ___-__-__'
				disabled={disabled}
			/>
			{error && <span className='error-message'>{error}</span>}
		</div>
	)
}

export default MaskedPhoneInput
