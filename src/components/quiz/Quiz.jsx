import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import styles from './Quiz.module.css'
import MaskedPhoneInput from '@/app/(shop)/components/InputMask/InputMask'
import Button from '@/app/(shop)/components/button/Button'

const Quiz = ({ isOpen, onClose, questions, onSubmit }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		trigger,
		watch,
		setValue,
	} = useForm()

	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [validationError, setValidationError] = useState('')

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

	const handleFieldInteraction = () => {
		setValidationError('')
	}

	const nextQuestion = async () => {
		const currentFieldName = `question${questions[currentQuestion].id}`
		const isValid = await trigger(currentFieldName)

		if (!isValid) {
			setValidationError('Пожалуйста, ответьте на текущий вопрос.')
			return
		}

		setValidationError('')
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1)
		}
	}

	const progress = ((currentQuestion + 1) / questions.length) * 100

	const handleFormSubmit = async (e) => {
		e.preventDefault()

		const allValid = await trigger()
		if (!allValid) {
			setValidationError('Пожалуйста, ответьте на все вопросы.')
			return
		}

		handleSubmit(async (data) => {
			const formattedComments = questions
				.map((question) => {
					const answer = data[`question${question.id}`]
					if (!answer) return `${question.question}: Не указан`

					if (question.type === 'checkbox') {
						const answers = Array.isArray(answer) ? answer : [answer]
						return `${question.question}: ${answers.join(', ')}`
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
				await onSubmit(formattedData)
			} catch (error) {
				setValidationError('Не удалось отправить данные, попробуйте позже.')
			}
		})()
	}

	if (!isOpen) return null

	return (
		<div className={styles.quizOverlay}>
			<div className={styles.quizContainer}>
				<button
					className={styles.closeButton}
					onClick={() => {
						onClose()
						setCurrentQuestion(0)
					}}
				>
					✖
				</button>

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
													<input
														{...field}
														type='radio'
														value={option.value}
														id={`radio-${option.value}`}
														className={styles.radioInput}
														onFocus={handleFieldInteraction}
														onChange={(e) => {
															handleFieldInteraction()
															field.onChange(e)
														}}
													/>
													<label
														htmlFor={`radio-${option.value}`}
														className={styles.radioLabel}
													>
														{option.label}
													</label>
												</>
											)}
										/>
									</div>
								))
							) : questions[currentQuestion].type === 'checkbox' ? (
								questions[currentQuestion].options.map((option) => (
									<div key={option.value} className={styles.checkboxContainer}>
										<Controller
											name={`question${questions[currentQuestion].id}`}
											control={control}
											defaultValue={[]}
											rules={{ required: 'Это поле обязательно' }}
											render={({ field }) => (
												<>
													<input
														{...field}
														type='checkbox'
														value={option.value}
														id={`checkbox-${option.value}`}
														className={styles.checkboxInput}
														onFocus={handleFieldInteraction}
														onChange={(e) => {
															handleFieldInteraction()
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
													<label
														htmlFor={`checkbox-${option.value}`}
														className={styles.checkboxLabel}
													>
														{option.label}
													</label>
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
											onChange={(e) => {
												handleFieldInteraction()
												field.onChange(e)
											}}
											onBlur={field.onBlur}
											error={
												fieldState.invalid ? fieldState.error.message : null
											}
										/>
									)}
								/>
							)}
						</div>
						{validationError && (
							<span className={styles.error}>{validationError}</span>
						)}
					</div>
					<div className={styles.navigation}>
						{currentQuestion < questions.length - 1 ? (
							<Button
								type='button'
								onClick={nextQuestion}
								label='Далее'
								color='orange'
								className={styles.navButton}
							/>
						) : (
							<Button
								type='submit'
								label='Отправить'
								color='orange'
								className={styles.navButton}
							/>
						)}
					</div>
				</form>
			</div>
		</div>
	)
}

export default Quiz
