import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import MaskedPhoneInput from '../InputMask/InputMask'
import styles from './Quiz.module.css'
import Button from '../button/Button'
import ThankYouModal from '@/shared/ui/ThankYouModal/ThankYouModal'

const Quiz = ({ isOpen, onClose, questions, onSubmit, successMessage }) => {
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
	const [customOptions, setCustomOptions] = useState({})
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

	const handleCustomInputChange = (questionId, value) => {
		setCustomOptions((prev) => ({
			...prev,
			[questionId]: value,
		}))
		setValue(`customInput${questionId}`, value)
	}

	const handleConsentChange = (e) => {
		if (currentQuestion === questions.length - 1) {
			setConsent(true)
			setValue('consent', true)
		} else {
			setConsent(e.target.checked)
			setValue('consent', e.target.checked)
		}
	}

	const handleValidation = async () => {
		const isValid = await trigger('consent')
		if (!isValid) {
			setValidationError('Пожалуйста, дайте согласие на обработку данных.')
			return false
		}
		setValidationError('')
		return true
	}

	const handleFormSubmit = async (e) => {
		e.preventDefault()

		const isValid = await handleValidation()

		if (isValid) {
			handleSubmit(async (data) => {
				const formattedComments = questions
					.map((question) => {
						const answer = data[`question${question.id}`]

						if (!answer) return `${question.question}: Не указан`

						if (question.type === 'checkbox') {
							const answers = Array.isArray(answer) ? answer : [answer]
							const customValue = data[`customInput${question.id}`]
							const finalAnswers = answers.map((ans) =>
								ans === 'custom' ? customValue || 'Не указан' : ans
							)
							return `${question.question}: ${finalAnswers.join(', ')}`
						}

						if (question.type === 'radio') {
							const customValue = data[`customInput${question.id}`]
							return `${question.question}: ${
								answer === 'custom' ? customValue || 'Не указан' : answer
							}`
						}

						if (question.type === 'text') {
							return `${question.question}: ${answer || 'Не указан'}`
						}

						return `${question.question}: ${answer}`
					})
					.join('\n')

				const formattedData = {
					FIELDS: {
						TITLE: 'Новая заявка с Quiz',
						COMMENTS: formattedComments,
						PHONE: [
							{
								VALUE: data.question4 || 'Не указан',
								VALUE_TYPE: 'WORK',
							},
						],
						STATUS_ID: 'NEW',
						SOURCE_ID: 'WEB',
					},
				}
				try {
					await onSubmit(formattedData).then(() => {
						setIsSubmitted(true)
					})
				} catch (error) {
					setValidationError('Не удалось отправить данные, попробуйте позже.')
				}
			})()
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
					<ThankYouModal isSubmitted={isSubmitted} />
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
															/>
															{option.label}
														</label>
														{option.value === 'custom' &&
															field.value === 'custom' && (
																<input
																	type='text'
																	value={
																		customOptions[
																			questions[currentQuestion].id
																		] || ''
																	}
																	onChange={(e) =>
																		handleCustomInputChange(
																			questions[currentQuestion].id,
																			e.target.value
																		)
																	}
																	className={styles.customInput}
																	placeholder='Введите свой вариант'
																/>
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
													<>
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
														{option.value === 'custom' &&
															field.value.includes('custom') && (
																<input
																	type='text'
																	value={
																		customOptions[
																			questions[currentQuestion].id
																		] || ''
																	}
																	onChange={(e) =>
																		handleCustomInputChange(
																			questions[currentQuestion].id,
																			e.target.value
																		)
																	}
																	className={styles.customInput}
																	placeholder='Введите свой вариант'
																/>
															)}
													</>
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
												value={field.value || '+375'}
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
								<Button
									type='button'
									onClick={prevQuestion}
									label='Назад'
									color='orange'
								/>
							)}
							{currentQuestion < questions.length - 1 && (
								<Button
									type='button'
									onClick={nextQuestion}
									label='Далее'
									color='orange'
									className={styles.submitButton}
								/>
							)}
							{currentQuestion === questions.length - 1 && (
								<div className={styles.consentsContainer}>
									<Button
										type='submit'
										label='Отправить'
										color='orange'
										className={styles.submitButton}
									/>
									<label>
										<input
											type='checkbox'
											checked={consent || true}
											onChange={handleConsentChange}
											className={styles.checkboxInput}
										/>
										Я даю согласие на обработку персональных данных.
									</label>
									{validationError && (
										<span className={styles.error}>{validationError}</span>
									)}
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
