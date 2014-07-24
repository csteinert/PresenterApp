// JavaScript source code
var myDataRef = new Firebase('https://atndemo1.firebaseio.com/');

$(document).ready(function () {
    $.getJSON('Questions.json', function (json) {
        $.each(json, function () {
            $("#section-questions").append("<button id='question" + this.id + "' data-id=" + this.id + ">" + this.id + " - " + this.question + "</button>");
            $('#question' + this.id).click(function () {
                //alert($(this).data("id"));
            });
            $("#section-question-info").append("<article>" + this.question + "</article>");
        });
    });
    
    
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