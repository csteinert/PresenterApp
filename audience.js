$(document).ready(function () {
    var myDataRef = new Firebase('https://atndemo1.firebaseio.com/SelectedSlide/');
    myDataRef.on('child_added', function (snapshot) {
        var message = snapshot.val();
        updateQuestion(message.id);
    });
    function updateQuestion(id) {
        if (id != 'blank' && id != 'qa')
        {
            $.getJSON('Questions.json', function (json) {
                var selectedQuestion;
                $.each(json, function () {
                    var currentQuestion = this;
                    if (currentQuestion.id == id)
                    {
                        var answersInfo = "";
                        $.each(currentQuestion.answers, function () {
                            answersInfo += "<li>" + this + "</li>"
                        });
                        var questionHtml = "<article><h3>" +
                            currentQuestion.question +
                            "</h3>" +
                            "<ol>" +
                            answersInfo +
                            "</ol>"
                            "</article>";
                        $("#section-selected-question").html(questionHtml);
                    }
                });
            });
        }
    };
});