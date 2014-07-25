// JavaScript source code
var myDataRef = new Firebase('https://atndemo1.firebaseio.com/');

$(document).ready(function () {
    $.getJSON('Questions.json', function (json) {
        var myDataRef = new Firebase('https://atndemo1.firebaseio.com/AudienceQuestions/');
        var selectedQuestionRef = new Firebase('https://atndemo1.firebaseio.com/SelectedQuestion/');
        $.each(json, function () {
            $("#section-questions").append("<button class='question-button' id='question" + this.id + "' data-id=" + this.id + ">" + this.id + ".  " + this.question + "</button>");
            $('#question' + this.id).click(function () {
                selectedQuestionRef.remove();
                selectedQuestionRef.push({ id: $(this).data("id") });
                SelectButton(this);
            });
            $("#section-question-info").append(QuestionInfoTemplate(this));
        });

        $("#button-blank").click(function() {
            selectedQuestionRef.remove();
            selectedQuestionRef.push({ id: "blank" });
            SelectButton(this);
        });

        $("#button-qa").click(function () {
            selectedQuestionRef.remove();
            selectedQuestionRef.push({ id: "qa" });
            SelectButton(this);
        });

		
		
		
		
		
		
		
		//$(".question-button").click(function(){
		//	alert("Foo");
		//	selectedQuestionRef.push({ whichEvent: 'Foo', text: 'Just some text about nothing'});
		//});
		
		//selectedQuestionRef.on('child_added', function(snapshot) {
		//	//We'll fill this in later.
		//});
		
		
		
		
		
		
		
		
		
		
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

    function SelectButton(selector){
        $(".question-button").removeClass('current-slide');
        $(selector).addClass('current-slide');
    }

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