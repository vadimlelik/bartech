page

axios.post(
'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
data
)

quiz

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
