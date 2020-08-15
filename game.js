const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions={};

let questions = [];
/* BY OUR FILE
fetch("questions.json")
	.then(res => {
			return res.json();
	})
	.then(loadedQuestions => {
		console.log(loadedQuestions);
		questions = loadedQuestions;
		startGame();
	})
	.catch(err => {
		console.error(err);
	});
*/

//BY API
fetch("https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple")
	.then(res =>{
		return res.json();
	})
	.then(loadedQuestions => {
		console.log(loadedQuestions.results);
		questions = loadedQuestions.results.map(loadedQuestion => {
			const formattedQuestion = {
				question : loadedQuestion.question
			};

			const answerChoices = [ ...loadedQuestion.incorrect_answers];
			formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
			answerChoices.splice(
				formattedQuestion.answer - 1,
				0,
				loadedQuestion.correct_answer
			);
			answerChoices.forEach((choice,index) => {
				formattedQuestion["choice"+ (index+1) ] = choice;	
			});
			return formattedQuestion;
		});
		startGame();
	})
	.catch(err => {
		console.error(err);
		swal("OOPSSS!!","PLEASE CHECK YOUR CONNECTION","error");
	});


//CONSTANTS
const CORRECT_BONUS=10;
const MAX_QUESTIONS = 10;

startGame = () => {
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	getNewQuestion()
	game.classList.remove("hidden");
	loader.classList.add("hidden");	
};
getNewQuestion = () => {

	if(availableQuestions.length == 0 || questionCounter >=  MAX_QUESTIONS ) {
		//localStorage.setItem("mostRecentScore",score)``
		localStorage.setItem(`mostRecentScore`,score);
		return window.location.assign("end.html");
	}
	questionCounter++;
	//questionCounterText.innerText = questionCounter +"/"+ MAX_QUESTIONS;
	progressText.innerText = "Question "+questionCounter +"/"+ MAX_QUESTIONS;
	progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
	
	const questionIndex = Math.floor(Math.random()  * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;
	choices.forEach( (choice) => {
		const number = choice.dataset['number'];
		choice.innerText = currentQuestion["choice" + number];
	});

	availableQuestions.splice(questionIndex,1);
	console.log(availableQuestions);
	acceptingAnswers = true;
}; 

choices.forEach((choice) => {
	choice.addEventListener("click", e => {
		if(!acceptingAnswers) return;

		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset['number'] ;
		const classToApply = selectedAnswer == currentQuestion.answer ? "correct": "incorrect";
		
		if(classToApply == "correct"){
			incremetScore(CORRECT_BONUS);
		}

		selectedChoice.parentElement.classList.add(classToApply);
		setTimeout( () => {
			selectedChoice.parentElement.classList.remove(classToApply);
			getNewQuestion();
		},1000)
		
	});
});

incremetScore = num => {
	score += num;
	scoreText.innerText = score;
}

