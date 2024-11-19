import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import MaskedPhoneInput from '../InputMask/InputMask'
import styles from './Quiz.module.css'

const Quiz = ({ isOpen, onClose, questions }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		trigger,
	} = useForm()
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [validationError, setValidationError] = useState('')
	const [customOption, setCustomOption] = useState('')
	const [consent, setConsent] = useState(false)

	const watchedFields = watch()

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	const onSubmit = (data) => {
		// Для всех вопросов с типом radio или checkbox, где выбран custom, заменяем на введенный текст
		for (const key in data) {
			if (data[key] === 'custom' && customOption) {
				data[key] = customOption
			}
		}

		console.log('Отправленные данные:', data)
		setIsSubmitted(true)
	}

	const nextQuestion = async () => {
		const currentFieldName = `question${questions[currentQuestion].id}`
		if (!watchedFields[currentFieldName]) {
			setValidationError('Пожалуйста, ответьте на текущий вопрос.')
			return
		}
		setValidationError('')
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
		}
	}

	const prevQuestion = () => {
		setValidationError('')
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1)
		}
	}

	const progress = ((currentQuestion + 1) / questions.length) * 100

	const handleRadioChange = (e) => {
		if (e.target.value === 'custom') {
			setCustomOption('')
		}
	}

	const handleCustomInputChange = (e) => {
		setCustomOption(e.target.value)
	}

	const handleConsentChange = (e) => {
		// Чекбокс согласия устанавливаем в true, если это последний вопрос
		if (currentQuestion === questions.length - 1) {
			setConsent(true)
			setValue('consent', true)
		} else {
			setConsent(e.target.checked)
			setValue('consent', e.target.checked)
		}
	}

	const handleValidation = async () => {
		// Проверяем согласие на обработку данных перед отправкой формы
		const isValid = await trigger('consent')
		if (!isValid) {
			setValidationError('Пожалуйста, дайте согласие на обработку данных.')
			return false
		}
		setValidationError('')
		return true
	}

	// Отправка формы
	const handleFormSubmit = async (e) => {
		e.preventDefault()

		// Проверяем согласие перед отправкой формы
		const isValid = await handleValidation()
		if (isValid) {
			handleSubmit(onSubmit)()
		}
	}

	if (!isOpen) return null

	return (
		<div className={styles.quizOverlay}>
			<div className={styles.quizContainer}>
				<button
					className={styles.closeButton}
					onClick={() => {
						onClose()
						setIsSubmitted(false)
						setCurrentQuestion(0)
					}}
				>
					✖
				</button>
				{isSubmitted ? (
					<div className={styles.modal}>
						<h2>Ваши данные успешно отправлены!</h2>
					</div>
				) : (
					<form onSubmit={handleFormSubmit} className={styles.form}>
						<div className={styles.progressBarContainer}>
							<div
								className={styles.progressBar}
								style={{ width: `${progress}%` }}
							></div>
						</div>
						<div className={styles.questionContainer}>
							<h2>{questions[currentQuestion].question}</h2>
							<div className={styles.inputContainer}>
								{questions[currentQuestion].type === 'radio' ? (
									questions[currentQuestion].options.map((option) => (
										<div key={option.value} className={styles.radioContainer}>
											<Controller
												name={`question${questions[currentQuestion].id}`}
												control={control}
												rules={{ required: 'Это поле обязательно' }}
												render={({ field }) => (
													<>
														<label
															className={`${styles.radioLabel} ${
																field.value === option.value
																	? styles.radioSelected
																	: ''
															}`}
														>
															<input
																{...field}
																type='radio'
																value={option.value}
																className={styles.radioInput}
																onChange={(e) => {
																	field.onChange(e)
																	handleRadioChange(e) // Handle custom option
																}}
															/>
															{option.label}
														</label>
														{option.value === 'custom' &&
															field.value === 'custom' && (
																<div className={styles.customInputContainer}>
																	<input
																		type='text'
																		value={customOption}
																		onChange={handleCustomInputChange}
																		className={styles.customInput}
																		placeholder='Введите свой вариант'
																	/>
																</div>
															)}
													</>
												)}
											/>
										</div>
									))
								) : questions[currentQuestion].type === 'checkbox' ? (
									questions[currentQuestion].options.map((option) => (
										<div
											key={option.value}
											className={styles.checkboxContainer}
										>
											<Controller
												name={`question${questions[currentQuestion].id}`}
												control={control}
												defaultValue={[]}
												rules={{ required: 'Это поле обязательно' }}
												render={({ field }) => (
													<label
														className={`${styles.checkboxLabel} ${
															field.value.includes(option.value)
																? styles.checkboxSelected
																: ''
														}`}
													>
														<input
															{...field}
															type='checkbox'
															value={option.value}
															className={styles.checkboxInput}
															onChange={(e) => {
																const value = e.target.value
																if (field.value.includes(value)) {
																	field.onChange(
																		field.value.filter((v) => v !== value)
																	)
																} else {
																	field.onChange([...field.value, value])
																}
															}}
														/>
														{option.label}
													</label>
												)}
											/>
										</div>
									))
								) : (
									<Controller
										name={`question${questions[currentQuestion].id}`}
										control={control}
										defaultValue=''
										rules={{
											required: 'Это поле обязательно',
											pattern: {
												value: /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
												message: 'Введите корректный номер телефона',
											},
										}}
										render={({ field, fieldState }) => (
											<MaskedPhoneInput
												mask='+375 (99) 999-99-99'
												placeholder='+375 (__) ___-__-__'
												value={field.value}
												onChange={field.onChange}
												onBlur={field.onBlur}
												error={
													fieldState.invalid ? fieldState.error.message : null
												}
											/>
										)}
									/>
								)}
							</div>
							{errors[`question${questions[currentQuestion].id}`] && (
								<span className={styles.error}>
									{errors[`question${questions[currentQuestion].id}`]?.message}
								</span>
							)}
							{validationError && (
								<span className={styles.error}>{validationError}</span>
							)}
						</div>
						<div className={styles.navigation}>
							{currentQuestion > 0 && (
								<button
									type='button'
									onClick={prevQuestion}
									className={styles.button}
								>
									Назад
								</button>
							)}
							{currentQuestion < questions.length - 1 && (
								<button
									type='button'
									onClick={nextQuestion}
									className={styles.button}
								>
									Далее
								</button>
							)}
							{currentQuestion === questions.length - 1 && (
								<div className={styles.consentsContainer}>
									<label>
										<input
											type='checkbox'
											checked={consent}
											onChange={handleConsentChange}
											className={styles.checkboxInput}
										/>
										Я даю согласие на обработку персональных данных.
									</label>
									{validationError && (
										<span className={styles.error}>{validationError}</span>
									)}
									<button type='submit' className={styles.submitButton}>
										Отправить
									</button>
								</div>
							)}
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default Quiz
