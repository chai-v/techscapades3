const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const JSONdb = require('simple-json-db')
const udb = new JSONdb('users.json')
const qdb = new JSONdb('questions.json')
const rdb = new JSONdb('registration.json')

const max_score = 8
const total_questions = 14

app.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password
	if (rdb.has(username) && rdb.get(username).password1 == password) {
		res.send({ 'status': true })
	} else {
		res.send({ 'status': false })
	}
})

app.post('/register', (req, res) => {
	const username = req.body.captainMailId
	if (rdb.has(username)) {
		res.send({ 'status': false, 'message': 'User already exists' })
	} else {
		rdb.set(username, req.body)
		udb.set(username, { 'ques': [], 'hint': ['start-point'], 'score': 0 })
		res.send({ 'status': true })
	}
})

app.post('/scan', (req, res) => {
	const username = req.body.username
	const hint = req.body.hint

	const data = udb.get(username)
	const condition1 = data.hint.at(-1) == hint
	const condition2 = data.ques.length == data.score
	const condition3 = data.ques.length == data.hint.length

	if (!condition1) {
		res.send({ 'message': 'Wrong Location' })
		return
	}
	
	let question = null
	
	if (data.score >= max_score-1) {
		if (data.score == max_score-1) {
			data.score += 1
			const date = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
			data.time = date
			udb.set(username, data)
		}
		res.send({ 'message': 'You finished the game' })
	} else if (data.score == max_score-2) {
		question = qdb.get('last-question').question
	} else if (condition2) {
		//asking random question
		const ar = []
		for (let i = 1; i <= total_questions; i++) {
			if (!data.ques.includes(i)) {
				ar.push(i)
			}
		}
		const rand = randomIntFromInterval(0, ar.length - 1)
		data.ques.push(ar[rand])
		udb.set(username, data)
		question = qdb.get('question_' + ar[rand]).question
	} else if (condition3) {
		//asking same question again
		const num = data.ques.at(-1)
		question = qdb.get('question_' + num).question
	}

	if (question) {
		res.send({ 'question': question })
	}

})

app.post('/check-answer', (req, res) => {
	const username = req.body.username
	const answer = req.body.answer
	if (!answer || !username) {
		res.send({ 'message': 'Missing parameters' })
		return
	}
	const data = udb.get(username)
	const condition = data.ques.length == data.hint.length

	let answers = []
	if (data.score == max_score-2) {
		answers = qdb.get('last-question').answer
	} else if (condition) {
		const num = data.ques.at(-1)
		answers = qdb.get('question_' + num).answer
	}

	if (answers.includes(answer)) {
		data.score += 1
		data.hint.push(answers.at(0))
		udb.set(username, data)
	}
	res.send({ 'isCorrect': answers.includes(answer) })
	console.log(answers.includes(answer))
})

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

app.post('/stats', (req, res) => {
	const username = req.body.username
	const team_name = rdb.get(username).teamName
	const score = udb.get(username).score
	res.send({ 'team_name': team_name, 'score': score })
})

app.get('/', (req, res) => {
	res.send('Hello Express app!')
})

app.listen(3000, () => {
	console.log('server started')
})
