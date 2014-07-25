var connectionString = "https://atndemo1.firebaseio.com/";
var slideRef = new Firebase(connectionString + "SelectedSlide/");
//var responsesRef = new Firebase(connectionString + "AudienceResponses/");

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

    //responsesRef.on('child_added', function (rec) {
    //    var response = rec.val();
    //    var responseId = "#" + response.questionId + "_" + response.answerIndex;
    //    var countElement = $(responseId);
    //    var currentCount = parseInt(countElement.text());
    //    countElement.text(currentCount + 1);
    //});
});

function displayBlankSlide() {
    $("#section-slide").html("");
}

function displayQASlide() {
    $("#section-slide").html(
        "<article>" +
            "<h3>Q & A</h3>" +
        "</article>");
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
                            "   <span id='" + question.id + "_" + index + "' class='right-justify'>0</span>" +
                        "</li>";
                    index++;
                });
                html = "<article><h3>" + question.question + "</h3><ol>" + answers + "</ol></article>";
            }
        });

        $("#section-slide").html(html);
        loadResponses();
    });
}

function loadResponses() {
    var responsesRef = new Firebase(connectionString + "AudienceResponses/");
    responsesRef.on('child_added', function (rec) {
        var response = rec.val();
        var responseId = "#" + response.questionId + "_" + response.answerIndex;
        var countElement = $(responseId);
        var currentCount = parseInt(countElement.text());
        countElement.text(currentCount + 1);
    });
}