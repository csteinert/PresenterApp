// JavaScript source code
var myDataRef = new Firebase('https://atndemo1.firebaseio.com/');

$(document).ready(function () {
    $.getJSON('Questions.json', function (json) {
        var myDataRef = new Firebase('https://atndemo1.firebaseio.com/AudienceQuestions/');
        var selectedQuestionRef = new Firebase('https://atndemo1.firebaseio.com/SelectedQuestion/');
        $.each(json, function () {
            $("#section-questions").append("<button id='question" + this.id + "' data-id=" + this.id + ">" + this.id + ".  " + this.question + "</button>");
            $('#question' + this.id).click(function () {
                selectedQuestionRef.remove();
                selectedQuestionRef.push({ id: this.id });
            });
            $("#section-question-info").append(QuestionInfoTemplate(this));
        });

        $("#button-blank").click(function() {
            selectedQuestionRef.remove();
            selectedQuestionRef.push({ id: "blank" });
        });

        $("#button-qa").click(function () {
            selectedQuestionRef.remove();
            selectedQuestionRef.push({ id: "qa" });
        });

        $('#messageInput').keypress(function (e) {
            if (e.keyCode == 13) {
                var name = $('#nameInput').val();
                var text = $('#messageInput').val();
                myDataRef.push({ name: name, text: text });
                $('#messageInput').val('');
            }
        });
        myDataRef.on('child_added', function (snapshot) {
            var message = snapshot.val();
            var removeKey = snapshot.kc.path.n;
            displayChatMessage(message.name, message.text, removeKey);
        });
        function displayChatMessage(name, text, removeKey) {
            $('#messagesDiv').append('<article id="article' + removeKey + '"><p id="message' + removeKey + '">' + '<strong>' + name + ' asks:</strong>  ' + text + '</p></article>');
            $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
            $('#message' + removeKey).click(function () {
                var votesRef = new Firebase("https://atndemo1.firebaseio.com/AudienceQuestions/" + removeKey);
                votesRef.remove();
                $("#article" + removeKey).remove();
            });
        };
    });

    function QuestionInfoTemplate(questionInfo) {
        var answersInfo = "";
        $.each(questionInfo.answers, function () {
            answersInfo += "<li>" + this + "</li>"
        });
        return "<article><h3>"
            + questionInfo.question
            + "</h3>"
            + "<ol>"
            + answersInfo
            + "</ol>"
            + "</article>";
    }

});

//$('#messageInput').keypress(function (e) {
//    if (e.keyCode == 13) {
//        var name = $('#nameInput').val();
//        var text = $('#messageInput').val();
//        myDataRef.push({ name: name, text: text });
//        $('#messageInput').val('');
//    }
//});
//myDataRef.on('child_added', function (snapshot) {
//    var message = snapshot.val();
//    displayChatMessage(message.name, message.text);
//});
//function displayChatMessage(name, text) {
//    $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messagesDiv'));
//    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
//};