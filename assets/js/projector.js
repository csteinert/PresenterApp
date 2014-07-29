"use strict";

var w = window,
    d = document,
    e = d.documentElement,
    b = d.getElementsByTagName("body")[0],
    atn = w.atn = {},
    connectionString = "https://atndemo1.firebaseio.com/",
    slideRef = new Firebase(connectionString + "SelectedSlide/"),
    responsesRef = new Firebase(connectionString + "AudienceResponses/"),
    $section = $("#section-slide");

atn.dom = {};
atn.dom.header = '<div class="structure--1__item"> <div class="display-result__intro"> <h2 class="title--display-results"> <span class="title__question"> {{title}} </span> </h2> </div> </div> <div class="structure--1__item"> <div class="display-result__content"> <div class="poll--display-results"> <div class="poll--display-results__items">';
atn.dom.responseBar = '<div class="poll--display-results__items__item"> <div class="poll--display-results__result"> <div class="poll--display-results__result__bar"> <span class="poll--display-results__result__bar__amount" id="{{id}}_{{index}}" data-total="0" style="width: 0%;"> <span class="poll--display-results__result__bar__amount__vertical">0%</span> </span> </div> </div> </div> <div class="poll--display-results__items__item--alt"> <div class="poll--display-results__result-title"> {{response}} </div> </div>';
atn.dom.totals = '<div class="poll--display-results__items__item"> <div class="poll--display-results__result"> <div class="poll--display-results__result__bar" style="background-color: #000;"> <span class="color--white display-results--small-font"><span id="response-count" data-total="0">0</span> Responses</span> </div> </div> </div>';


var displayBlankSlide = function() {
    $("#results").html(
        "<div id='blank-slide'></div>"
        );
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
                var answers = "",
                    index = 0;
                $.each(question.answers, function() {
                    answers += atn.dom.responseBar.replace(/{{response}}/gi, this).replace(/{{id}}/gi, question.id).replace(/{{index}}/gi, index);
                    index++;
                });

                html = atn.dom.header.replace(/{{title}}/gi, question.question) + answers + atn.dom.totals + " </div> </div> </div> </div> ";
            }
        });

        $("#results").html(html);
        loadResponses();
    });
};



/**


var loadResponses = function() {
    responsesRef.off("child_added");
    responsesRef.on("child_added", function(rec) {
        var response = rec.val(),
            responseId = "#" + response.questionId + "_" + response.answerIndex;

        if ($(responseId).length != 0) {
            //Question count
            var countElement = $(responseId),
                currentCount = parseInt(countElement.text()) + 1,
                responsesElement = $("#response-count"),
                responseCount = parseInt(responsesElement.text()) + 1,
                currentPercent = makePercent(currentCount, responseCount);

            console.log(responseCount);
            //countElement.text(currentCount + 1);
            $(responseId).css("width", currentPercent);
            $(responseId).text(currentPercent);

            responsesElement.text(responseCount);
        }
    });
};

*/

var loadResponses = function() {
    responsesRef.off("child_added");
    responsesRef.on("child_added", function(rec) {
        var response = rec.val(),
            responseId = "#" + response.questionId + "_" + response.answerIndex;

        if ($(responseId).length != 0) {
            //Question count
            var countElement = $(responseId),
                currentCount = parseInt(countElement.attr("data-total")) + parseInt(1),
                responsesElement = $("#response-count"),
                responseCount = parseInt(responsesElement.attr("data-total")) + parseInt(1),
                currentPercent = currentCount;

            //countElement.text(currentCount + 1);
        }

        $(responseId).attr("data-total", currentCount);
        $(responsesElement).attr("data-total", responseCount);
        $(responsesElement).text(responseCount);

        atn.dom.total = responseCount;

        calculateResults();

    });
};

var makePercent = function(num, total) {

    total = total || $("#response-count").text();
    num = parseInt(num);
    console.log(num + " / " + atn.dom.total);

    if ( total > 0) {
        return Math.round((num / parseInt(total)) * 100) + "%"; 
    } else {
        return "0%";
    }
};

var calculateResults = function() {
    $(".poll--display-results__result__bar__amount").each(function() {
        var total = parseInt($(this).attr("data-total")),
            percent = makePercent(total);

        $(this).css("width", percent);
        $(this).html(percent);
    });
};

$(function() {
    slideRef.on("child_added", function(rec) {
        var slide = rec.val();
        if (slide.id == "blank") {
            displayBlankSlide();
        } else {
            displayQuestionSlide(slide);
        }
    });
});