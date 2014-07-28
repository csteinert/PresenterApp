var connectionString = "https://atndemo1.firebaseio.com/";
var audianceQuestionsRef = new Firebase(connectionString + "AudienceQuestions/");
var selectedSlideRef = new Firebase(connectionString + "SelectedSlide/");
var questionResponses = new Firebase(connectionString + "AudienceResponses/");

$(document).ready(function() {

    $("#resetButton").click(resetTheCounts);

    $.getJSON("assets/data/questions.json", function(json) {
        $.each(json, function() {
            $("#section-slides").append("<button class='slide-button' id='slide_" + this.id + "' data-id=" + this.id + ">" + this.id + ".  " + this.question + "</button>");
            $("#section-questions").append(questionTemplate(this));
        });

        $(".slide-button").click(function() {
            selectSlide(this);
        });
    });

    // $("#messageInput").keypress(function (e) {
    // if (e.keyCode == 13) {
    // var name = $("#nameInput").val();
    // var text = $("#messageInput").val();
    // audianceQuestionsRef.push({ name: name, text: text });
    // $("#messageInput").val("");
    // }
    // });
    questionResponses.on("child_removed", function(snapshot) {
        var message = snapshot.val();

        var responseId = "#" + message.questionId + "_" + message.answerIndex;
        var countElement = $(responseId);
        var currentCount = parseInt(countElement.text());
        countElement.text(0);
    });


    audianceQuestionsRef.on("child_added", function(snapshot) {
        var message = snapshot.val();
        var removeKey = snapshot.kc.path.n[1];
        displayChatMessage(message.name, message.text, removeKey);
    });

    listenForAudienceResponses();


});

function resetTheCounts() {




    var questionResponses = new Firebase('https://atndemo1.firebaseio.com/AudienceResponses/');
    questionResponses.remove();

    // $.getJSON("Questions.json", function (json) {
    // $.each(json, function () {
    // var questionId = this.id;
    // $.each(this.answers, function(index){
    // var responseId = "#" + questionId + "_" + index;
    // var countElement = $(responseId);
    // countElement.text(0);
    // });
    // });
    // });
}

function listenForAudienceResponses() {
    var questionResponses = new Firebase('https://atndemo1.firebaseio.com/AudienceResponses/');
    questionResponses.on('child_added', function(snapshot) {
        var message = snapshot.val();

        var responseId = "#" + message.questionId + "_" + message.answerIndex;
        var countElement = $(responseId);
        var currentCount = parseInt(countElement.text());
        countElement.text(currentCount + 1);
    });
}


function displayChatMessage(name, text, removeKey) {
    $("#messagesDiv").append('<article id="article' + removeKey + '"><p id="message' + removeKey + '">' + '<strong>' + name + ' asks:</strong>  ' + text + '</p></article>');
    $("#messagesDiv")[0].scrollTop = $("#messagesDiv")[0].scrollHeight;
    $("#message" + removeKey).click(function() {
        var votesRef = new Firebase(connectionString + "AudienceQuestions/" + removeKey);
        votesRef.remove();
        $("#article" + removeKey).remove();
    });
}

function selectSlide(selector) {
    selectedSlideRef.remove();
    selectedSlideRef.push({
        id: $(selector).data("id")
    });
    $(".slide-button").removeClass("current-slide");
    $(selector).addClass("current-slide");
}

function questionTemplate(question) {
    var answers = "";
    $.each(question.answers, function(index) {
        answers += "<li>" + this + "   <span id='" + question.id + "_" + index + "' class='right-justify'>0</span>" + "</li>"
    });
    return "<article>" +
        "<h3>" + question.question + "</h3>" +
        "<ol>" + answers + "</ol>" +
        "</article>";
}