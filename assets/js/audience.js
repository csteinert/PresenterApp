"use strict";

var w = window,
    d = document,
    e = d.documentElement,
    b = d.getElementsByTagName("body")[0],
    atn = w.atn = {},
    responses = [],
    connectionString = "https://atndemo1.firebaseio.com/",
    slideRef = new Firebase(connectionString + "SelectedSlide/"),
    questionsRef = new Firebase(connectionString + "AudienceQuestions/"),
    responsesRef = new Firebase(connectionString + "AudienceResponses/"),
    $section = $("#section-slide");

atn.dom = {};
atn.dom.header = "<h2 class='title--results'><span class='title__question'>{{question}}</span></h2>\n{{answers}}\n<button id='submit-response-button' class='poll--question__button' disabled>Submit</button><span id='response-status'></span>";
atn.dom.response = "<fieldset class='poll--question__fieldset'><input class='response-input poll--question__radio' id='response_{{id}}_{{index}}' data-id='{{id}}' data-index='{{index}}' value='{{id}}' name='response' type='radio' /><label class='poll--question__label' for='response_{{id}}_{{index}}'>{{response}}</label></fieldset>";
atn.dom.blank = '<div class="container--full padding-top padding-bottom--2x"> <div class="container__wrap"> <h2 class="title--results"> <span class="title__question"> Hey you! </span> </h2> <p class="reset--p"> There\'s more to come on here... just wait :) <br />- <a href="twitter.com/nicetransition" target="_blank">@nicetransition</a> </p> <p> Here\'s a good opportunity to join the <a href="http://www.meetup.com/Columbus-Web-Group/" target="_blank">Columbus Web Group</a>. </p> </div> </div> ';

var displayBlankSlide = function() {
    $section.html(atn.dom.blank);
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
                html = atn.dom.header.replace(/{{question}}/gi, question.question).replace(/{{answers}}/gi, answers);
            }
        });

        $section.html(html);

        var response = getPreviousResponse(slide.id);
        if (response == null) {
            $("#submit-response-button").click(submitResponse);
            $(".response-input").click(function() {
                $("#submit-response-button").removeAttr("disabled");
            });
        }
        else {
            var responseId = "#response_" + response.questionId + "_" + response.answerIndex;
            $(responseId).attr("checked", "checked");
            $(".response-input").attr("disabled", "disabled");
            $("#submit-response-button").hide();
            $("#response-status").text("You have already submitted a response for this question.");
        }
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
        $("#section-question-form").parent().hide();
        $("#section-ask-quesiton").toggle();
    } else {
        alert("Please enter your name and question.");
    }
};

var submitResponse = function () {
    var selector = $(".response-input:checked"),
        id = selector.data("id"),
        index = selector.data("index"),
        response = {
            questionId: id,
            answerIndex: index
        };

    responsesRef.push(response);
    responses.push(response);

    $(".response-input").attr("disabled", "disabled");
    $("#submit-response-button").hide();
    $("#response-status").text("Your response has been submitted to the presenter.");
};

var getPreviousResponse = function (questionId) {
    for (var i = 0; i < responses.length; i++) {
        if (responses[i].questionId == questionId) {
            return responses[i];
        }
    }
    return null;
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

    $("#button-ask-quesiton, #cancel-button").click(function () {
        w.scrollTo(0, 0);
        $("#section-question-form").parent().toggle();
        $("#section-ask-quesiton").toggle();
    });

    $("#submit-question-button").click(submitQuestion);
});