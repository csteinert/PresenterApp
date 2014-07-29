var connectionString = "https://atndemo1.firebaseio.com/";
var questionsRef = new Firebase(connectionString + "AudienceQuestions/");
var slideRef = new Firebase(connectionString + "SelectedSlide/");
var responsesRef = new Firebase(connectionString + "AudienceResponses/");

$(document).ready(function() {
    $.getJSON("assets/data/questions.json", function(json) {
        $.each(json, function() {
            $("#section-slides").append("<button class='slide-button' id='slide_" + this.id + "' data-id=" + this.id + ">" + this.id + ".  " + this.question + "</button>");
            $("#section-questions").append(questionTemplate(this));
        });

        $(".slide-button").click(function() {
            selectSlide(this);
        });
    });

    responsesRef.on("child_added", function (rec) {
        var response = rec.val();
        var responseId = "#" + response.questionId + "_" + response.answerIndex;
        var countElement = $(responseId);
        var currentCount = parseInt(countElement.text());
        countElement.text(currentCount + 1);
    });

    responsesRef.on("child_removed", function (rec) {
        var response = rec.val();
        var responseId = "#" + response.questionId + "_" + response.answerIndex;
        var countElement = $(responseId);
        countElement.text("0");
    });

    $("#resetButton").click(function () {
        responsesRef.remove();
    });

    questionsRef.on("child_added", function (rec) {
        var question = rec.val();
        var removeKey = rec.kc.path.n[1];
        displayAudianceQuestion(question.name, question.text, removeKey);
    });
});

function displayAudianceQuestion(name, text, removeKey) {
    $("#messagesDiv").append("<article id='article" + removeKey + "'><p id='message" + removeKey + "'>" + "<strong>" + name + " asks:</strong>  " + text + "</p></article>");
    $("#messagesDiv")[0].scrollTop = $("#messagesDiv")[0].scrollHeight;
    $("#message" + removeKey).click(function() {
        questionsRef.remove();
        $("#article" + removeKey).remove();
    });
}

function selectSlide(selector) {
    slideRef.remove();
    slideRef.push({ id: $(selector).data("id") });
    $(".slide-button").removeClass("current-slide");
    $(selector).addClass("current-slide");
}

function questionTemplate(question) {
    var answers = "";
    $.each(question.answers, function(index) {
        answers += "<li>" + this + "   <span id='" + question.id + "_" + index + "' class='answer-count'>0</span>" + "</li>"
    });
    return "<article>" +
        "<h3>" + question.question + "</h3>" +
        "<ol>" + answers + "</ol>" +
        "</article>";
}