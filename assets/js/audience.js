"use strict";

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
atn.dom.header = "<h2 class='title--results'><span class='title__question'>{{question}}</span></h2>";
atn.dom.response = "<fieldset class='poll--question__fieldset'><input class='response-input poll--question__radio' id='response_{{id}}_{{index}}' data-id='{{id}}' data-index='{{index}}' value='{{id}}' ame='response' type='radio' /><label class='poll--question__label' for='response_{{id}}_{{index}}'>{{response}}</label></fieldset>";

var displayBlankSlide = function() {
    $section.html("");
};

var displayQASlide = function() {
    $section.html("<article><h3>Q & A</h3></article>");
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
                    answers += atn.dom.response.replace(/{{id}}/gi, question.id).replace(/{{response}}/gi, this).replace(/{{index}}/gi, index);
                    index++;
                });
                html = atn.dom.header.replace(/{{question}}/gi, question.question) + "\n" + answers;
            }
        });

        $section.html(html);
        $(".response-input").click(function() {
            submitResponse($(this));
        });
    });
};

var submitQuestion = function() {
    var name = $("#name-input").val(),
        question = $("#question-input").val();

    if (name != "" && question != "") {
        questionsRef.push({
            name: name,
            text: question
        });

        $("#question-input").val("");
        $("#question-status").text("Your question has been submitted to the presenter.");
    } else {
        $("#question-status").text("Please enter your name and question.");
    }
};

var submitResponse = function(selector) {
    var id = selector.data("id"),
        index = selector.data("index");

    responsesRef.push({
        questionId: id,
        answerIndex: index
    });

    $(".response-input").attr("disabled", "disabled");
};

$(function() {
    slideRef.on("child_added", function(rec) {
        var slide = rec.val();
        if (slide.id == "blank") {
            displayBlankSlide();
        } else if (slide.id == "qa") {
            displayQASlide();
        } else {
            displayQuestionSlide(slide);
        }
    });

    $("#button-ask-quesiton").click(function () {
        $("#section-question-form").toggle();
    });

    $("#submit-question-button").click(submitQuestion);
});