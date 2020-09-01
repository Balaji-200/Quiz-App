const queryData = decodeURIComponent(window.location.href)
  .toString()
  .split("?");
const url = `https://opentdb.com/api.php?${queryData[1]}&encode=url3986`;
const totalQuestion = document.getElementById("total-questions");
const totalScore = document.getElementById("total-Score");
const answeredQuestions = document.getElementById("answered-total-questions");
const load = document.getElementById("load");
const quizBoard = document.getElementById("quiz-board");
const quiz = [];
window.onload = () => {
  load.classList.add("d-show");
};
fetch(url)
  .then((response) => {
    if (response) return response.json();
  })
  .then((data) => {
    localStorage.setItem("queryData",queryData[1]);
    load.classList.remove("d-show");
    load.classList.add("d-none");
    quizBoard.classList.remove("d-none");
    quizBoard.classList.add("d-show");
    const quizData = [...data.results];
    quizData.map((el) => {
      const options = [...el.incorrect_answers];
      options.push(el.correct_answer);
      const answer = [];
      answer.push(el.correct_answer);
      quiz.push({
        question: el.question,
        options: options,
        answer: answer,
      });
    });
    totalQuestion.innerText = quiz.length;
    answeredQuestions.innerText = quiz.length;
    totalScore.innerText = quiz.length * 10;
    const quizQuestion = document.getElementById("quiz-question");
    const questionIndex = document.getElementById("question-number");
    const options = document.getElementById("quiz-options");
    const score = document.getElementById("score");
    const header = document.getElementById("header");
    const nextButton = document.getElementById("next");
    const actions = document.getElementById("actions");
    const correct = document.getElementById("correct");
    const answered = document.getElementById("Correct");

    var available = [...quiz];
    // console.log(available);
    var duration = 0.3;
    var questionNumber = 0,
      s = 0,
      c = 0;
    var availableClicks;
    var usedClicks = false;
    var answeredQuestion = 0;
    function getNewQuestion() {
      questionNumber++;
      answeredQuestion = 0;
      const question = available[Math.floor(Math.random() * available.length)];
      // console.log(question);
      quizQuestion.innerText = decodeURIComponent(question.question);
      getOptionsAndCheckAnswer(question.options, question.answer);
      const usedQuestion = available.indexOf(question);
      available.splice(usedQuestion, 1);
      questionIndex.innerText = questionNumber;
      // console.log(available);
    }
    function getOptionsAndCheckAnswer(opts, answers) {
      availableClicks = answers.length;
      shuffleArray(opts);
      opts.map((q) => {
        var div = document.createElement("div");
        div.className = "bg-option";
        div.classList.add("option", "rounded");
        div.style.animationDuration = (duration += 0.2).toString() + "s";
        div.innerText = decodeURIComponent(q);
        div.addEventListener("click", () => {
          if (availableClicks != 0) {
            if (answers.indexOf(q) >= 0) {
              s += 10;
              score.innerText = s;
              div.classList.remove("bg-option");
              div.classList.add("bg-success", "text-light");
            } else {
              div.classList.remove("bg-option");
              div.classList.add("bg-danger", "text-light");
            }
            availableClicks--;
            // console.log(score);
          }
          if (availableClicks == 0) {
            const answer = opts.filter((ans) => {
              return answers.indexOf(ans) >= 0;
            });
            // console.log(decodeURIComponent(answer));
            for (let i = 0; i <= opts.length; i++) {
              if (options.children[i] != null) {
                if (
                  decodeURIComponent(answer) === options.children[i].innerText
                ) {
                  if (!options.children[i].classList.contains("bg-success")) {
                    options.children[i].classList.remove("bg-option");
                    options.children[i].classList.add(
                      "bg-success",
                      "text-light"
                    );
                    options.children[i].classList.add("correctAnswer");
                  } else {
                    answeredQuestion += 1;
                  }
                }
              }
            }
            if (answeredQuestion == answer.length) {
              c += 1;
              correct.innerText = c;
            }
          }
        });
        options.appendChild(div);
      });
      duration = 0.3;
    }
    function clearOpions() {
      if (options.hasChildNodes()) {
        var child = options.lastChild;
        while (child) {
          options.removeChild(child);
          child = options.lastChild;
        }
      }
    }
    function clearQuestion() {
      quizQuestion.innerText = "";
    }

    function ResultPage() {
      clearOpions();
      clearQuestion();
      var div = document.createElement("div");
      var proceed = document.createElement("button");
      var retry = document.createElement("button");
      const alert = document.createElement("div");
      if (header.hasChildNodes()) {
        var child = header.lastChild;
        while (child) {
          header.removeChild(child);
          child = header.lastChild;
        }
      }
      div.className = "text-center";
      header.classList.remove("bg-success");
      header.classList.add("bg-cherry");
      div.innerText = "Result";
      header.appendChild(div);
      quizQuestion.classList.add("text-center");
      quizQuestion.style.fontSize = "70px";
      quizQuestion.innerText = Math.floor((s / 100) * 100).toString() + "%";
      nextButton.remove();
      proceed.className = "btn";
      proceed.classList.add(
        "btn-sm",
        "btn-outline-success",
        "pl-3",
        "pr-3",
        "ml-3",
        "text-lightI"
      );
      proceed.innerText = "Proceed";
      proceed.addEventListener("click", () => {
        var data = {
          highScore: s,
          totalAnsweredQuestions: quiz.length,
          highestAnsweredCorrect: c,
        };
        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "users/score", true);
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xhr.onload = function () {
          var response = JSON.parse(xhr.responseText);
          if (xhr.readyState == 4 && xhr.status == "200") {
            location.href = response.redirectUrl;
          } else {
            console.error(response);
          }
        };
        xhr.send(json);
      });
      retry.className = "btn";
      retry.classList.add("btn-sm", "btn-outline-info", "pl-3", "pr-3","text-light");
      retry.innerText = "Try Again";
      retry.addEventListener("click", () => {
        location.href = `/quiz?${localStorage.getItem('queryData')}`;
      });
      answered.remove();
      actions.appendChild(retry);
      actions.appendChild(proceed);
      options.appendChild(showResult(`Your Score: ${s}`));
      options.appendChild(showResult(`Successfully Answered Questions: ${c}`));
    }

    function showResult(content) {
      var div = document.createElement("div");
      var span = document.createElement("span");
      div.classList.add(
        "result",
        "p-2",
        "card-subtitle",
        "align-items-center",
        "mt-3"
      );
      span.classList.add("text-dark");
      span.innerText = content;
      div.style.animationDuration = (duration += 0.2).toString() + "s";
      div.appendChild(span);
      return div;
    }
    nextButton.addEventListener("click", next);

    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    function next() {
      if (questionNumber === quiz.length) {
        ResultPage();
      } else {
        // console.log(questionNumber);
        clearOpions();
        getNewQuestion();
      }
    }

    getNewQuestion();
  })
  .catch((err) => console.log(err));
