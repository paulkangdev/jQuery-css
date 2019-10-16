$(document).ready(function() {
    
var UIController = (function() {
    function displayNewQuestion(qNum) {
        var quest = questionController.getQuestion(qNum);
        $(".question-body").text(quest.question);
        $(".answer-a").text(quest.a);
        $(".answer-b").text(quest.b);
        $(".answer-c").text(quest.c);
        $(".answer-d").text(quest.d);
        $((".answer-"+quest.correct)).parent().addClass("correct");
    }
    function clearDisplay(){
        $(".question-card").html('<h2 class="card-title text-center question-title">Question:</h2><div class="card-body text-center question-body"></div>');
        $('.questions-group').children().removeClass("list-group-item-dark list-group-item-success list-group-item-danger correct");

    }
    function correctAnswer(){
        $('.questions-group').children().removeClass("list-group-item-light");
        $('.questions-group').children().addClass("list-group-item-dark");
        $('.correct').removeClass("list-group-item-dark");
        $('.correct').addClass("list-group-item-success");
        $(".question-card").html('<h2 class="card-title text-center question-title">Correct!</h2><button class="card-body text-center question-body btn btn-success next-question">Next Question</button>');
    }
    
    function gameComplete(){
        $(".question-card").html('<h2 class="card-title text-center question-title">You have finished the game!</h2><div class="card-body text-center question-body empty"></div>');
        $(".answers-wrapper").children().text("");
    }
    
    function updateScore(num) {
        $(".player-score").text(num);
    }
    
    function updateRight(num) {
        $(".questions-right").text(num);
    }
    
    function updateWrong(num) {
        $(".questions-wrong").text(num);
    }
    
    function wrongAnswer(){
        $('.questions-group').children().removeClass("list-group-item-light");
        $('.questions-group').children().addClass("list-group-item-danger");
        $(".question-card").html('<h2 class="card-title text-center question-title">Wrong!</h2><button class="card-body text-center question-body btn btn-danger next-question">Next Question</button>');
    }
    
   return {
       displayNewQuestion,
       clearDisplay,
       correctAnswer,
       gameComplete,
       updateScore,
       updateRight,
       updateWrong,
       wrongAnswer,
        
   };
    
})();

var questionController = (function() {
    function Question(question, a, b, c, d, correct, id) {
        this.question = question;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.correct = correct;
        this.id = id;
    }
    
    var questionOne = new Question (
        "What is the name of the current President of the United States?",
        "Donald Trump",
        "Barack Obama",
        "George Bush",
        "Tweedle Dee",
        "a",
        0);
        
    var questionTwo = new Question (
        "What is the name of my dog?",        
        "Sam",
        "Ollie",
        "Josephine",
        "Elephante",
        "b",
        1);

    var questionThree = new Question (
        "What is JavaScript?",
        "Cool",
        "Hard",
        "Fun",
        "All of the Above",
        "d",
        2);
    
    var questionList = [questionOne, questionTwo, questionThree];
    
    function removeQuestionFromList(num) {
        questionList.splice(num, 1);
    }
    function getListLength() {
        return questionList.length;
    }
    function getQuestion(qNum) {
        return questionList[qNum];
    }
    
    return {
        getQuestion,
        removeQuestionFromList,
        getListLength,
        questionList,
    };
        
    
})();

var globalController = (function (UICtrl) {
    
    var gameState = {
        active: true,
        correct: "a",
        qNum: 0,
        right: 0,
        score: 0,
        wrong: 0,
    };
    
    function correctAnswer() {
        gameState.score+=50;
        gameState.right++;
        updatePointDisplay();
        UICtrl.correctAnswer();
        questionController.removeQuestionFromList(gameState.qNum);
        gameState.active = false;
    }
    
    function init() {
        setupEventListeners();
        generateNewQuestion();
        updatePointDisplay();
        
    }
    
    function gameComplete() {
    }
    
    function generateNewQuestion() {
        gameState.active = true;
        length = questionController.getListLength();
        if(length===0){
            gameState.active=false;
            gameComplete();
            UICtrl.gameComplete();
            return;
        }
        var qNum = Math.floor(Math.random(0, length)*length);
        UICtrl.clearDisplay();
        UICtrl.displayNewQuestion(qNum);
        gameState.qNum = qNum;
        gameState.correct = questionController.getQuestion(qNum).correct;
    }
    
    function setupEventListeners() {
        $(document).keydown(event => {
            const keyName = ((event.key).toString()).toLowerCase();
            switch(keyName) {
                case "a":
                    quizAnswerKey("a");
                    break;
                case "b":
                    quizAnswerKey("b");
                    break;
                case "c":
                    quizAnswerKey("c");
                    break;
                case "d":
                    quizAnswerKey("d");
                    break;
            }
        });
        
        $(".container-fluid").children().click(quizAnswerClick);
    }
    
    function quizAnswerKey(key) {
        if(!gameState.active){
            return;
        }  
        if(key === gameState.correct){
            correctAnswer();
        } else {
            wrongAnswer();
        }
    }
    
    
    function quizAnswerClick() {
        var target = event.target;
        console.log(event.target);
        if(gameState.active){
            if(target===$('.correct')[0]){
                correctAnswer();
            } 
        }
        if(event.target===$('.next-question')[0]){
            generateNewQuestion();
        }
    }
    
    function updatePointDisplay() {
        UICtrl.updateScore(gameState.score);
        UICtrl.updateRight(gameState.right);
        UICtrl.updateWrong(gameState.wrong);
    }
    
    function wrongAnswer() {
        gameState.score-=20;
        gameState.wrong++;
        updatePointDisplay();
        UICtrl.wrongAnswer();
        gameState.active = false;
    }
 
    return {
        init,
    }
    
})(UIController);

globalController.init();
});