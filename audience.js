var connectionString = "https://atndemo1.firebaseio.com/";
var slideRef = new Firebase(connectionString + "SelectedSlide/");
var questionsRef = new Firebase(connectionString + "AudienceQuestions/");
var responsesRef = new Firebase(connectionString + "AudienceResponses/");

$(document).ready(function () {
    slideRef.on('child_added', function (rec) {
        var slide = rec.val();
        if (slide.id == "blank") {
            displayBlankSlide();
        }
        else if (slide.id == 'qa') {
            displayQASlide();
        }
        else {
            displayQuestionSlide(slide);
        }
    });
});

function displayBlankSlide() {
    $("#section-slide").html("");
}

function displayQASlide() {
    $("#section-slide").html(
        "<article>" +
            "<h3>Q & A</h3>" +
            "<input id='name-input' type='text' placeholder='Name'>" +
            "<br /><br />" +
            "<input id='question-input' type='text' placeholder='Question'>" +
            "<br /><br />" +
            "<input id='submit-question-button' type='button' value='Submit Question'>" +
            "<br /><br />" +
            "<span id='question-status'></span>" +
        "</article>");

    $("#submit-question-button").click(submitQuestion);
}

function displayQuestionSlide(slide) {
    $.getJSON("Questions.json", function (json) {
        var html = "[Error: Slide not found]";
        $.each(json, function () {
            var question = this;
            if (question.id == slide.id) {
                var answers = "";
                var index = 0;
                $.each(question.answers, function () {
                    answers +=
                        "<li>" +
                            this +
                            "<input id='response_" + question.id + "_" + index + "' class='response-input' data-id=" + question.id + " data-index=" + index + " type='radio' name='response'>" +
                        "</li>";
                    index++;
                });
                html = "<article><h3>" + question.question + "</h3><ol>" + answers + "</ol></article>";
            }
        });

        $("#section-slide").html(html);
        $(".response-input").click(function () {
            submitResponse($(this));
        });
    });
}

function submitQuestion() {
    var name = $("#name-input").val();
    var question = $("#question-input").val();

    if (name != "" && question != "") {
        questionsRef.push({ name: name, text: question });
        $("#question-input").val("");
        $("#question-status").text("Your question has been submitted to the presenter.");
    }
    else {
        $("#question-status").text("Please enter your name and question.");
    }
}

function submitResponse(selector) {
    var id = selector.data("id");
    var index = selector.data("index");
    responsesRef.push({ questionId: id, answerIndex: index });
    $(".response-input").attr("disabled", "disabled");
}