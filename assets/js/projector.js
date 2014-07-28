'use strict';

var w = window,
    d = document,
    e = d.documentElement,
    b = d.getElementsByTagName("body")[0],
    atn = w.atn = {},
    connectionString = "https://atndemo1.firebaseio.com/",
    slideRef = new Firebase(connectionString + "SelectedSlide/"),
    questionsRef = new Firebase(connectionString + "AudienceQuestions/"),
    responsesRef = new Firebase(connectionString + "AudienceResponses/"),
    $section = $("#section-slide");


atn.dom = {};
atn.dom.header = '<div class="structure--1__item"><div class="display-result__intro"> <h2 class="title--display-results"> <span class="title__question" id="question-title">{{TITLE}}</span></h2></div></div>';
atn.dom.response = '<div class="poll--display-results__items__item"> <div class="poll--display-results__result"> <div class="poll--display-results__result__bar"> <span class="poll--display-results__result__bar__amount" style="width: {{percent}};"> <span class="poll--display-results__result__bar__amount__vertical">{{percent}}</span> </span> </div> </div> </div>';


//var responsesRef = new Firebase(connectionString + "AudienceResponses/");


var displayBlankSlide = function() {
    $("#section-slide").html("");
};

var displayQASlide = function() {
    $("#section-slide").html(
        "<article>" +
        "<h3>Q & A</h3>" +
        "</article>");
};


var displayQuestionSlide = function(slide) {
    $.getJSON("assets/data/questions.json", function(json) {
        var html = "[Error: Slide not found]";
        $.each(json, function() {
            var question = this;
            if (question.id == slide.id) {
                var answers = "";
                var index = 0;
                $.each(question.answers, function() {
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
};



var loadResponses = function() {
    var responsesRef = new Firebase(connectionString + "AudienceResponses/");
    responsesRef.on('child_added', function(rec) {
        var response = rec.val();
        var responseId = "#" + response.questionId + "_" + response.answerIndex;
        var countElement = $(responseId);
        var currentCount = parseInt(countElement.text());
        countElement.text(currentCount + 1);
    });
};


$(function() {
    slideRef.on('child_added', function(rec) {
        var slide = rec.val();
        if (slide.id == "blank") {
            displayBlankSlide();
        } else if (slide.id == 'qa') {
            displayQASlide();
        } else {
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