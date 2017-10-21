// YOUR CODE HERE:
//    Server: http://parse.sfm8.hackreactor.com/
//    App ID: 72b8e073a4abde10221ce95f38ed1c63bd7f3d6b
//    API Key: cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a

//METHODS:

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
  return {
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    contentType: 'application/json',
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  };
};

  // var message = {
  //   username: 'user',
  //   text: 'hey',
  //   roomname: 'testRoom'
  // };

app.send = function(message) {
  var result = app.init();
  result.type = 'POST';
  result.data = message;
  result.success = function (data) {
    console.log('chatterbox: Message sent');
  };
  return $.ajax(result);
};

app.fetch = function() {
  var request = app.init();
  request.type = 'GET';
  request.data = 'order=-createdAt';
  request.success = function(data) { 
    var messages = data.results;
    for (var i = 0; i < messages.length; i++) {
      app.renderMessage(messages[i]);
    }
  };
  return $.ajax(request);
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  //will need to escape username, roomname, and text
  var username = message.username;
  var roomname = message.roomname;
  var objectId = message.objectId;
  var text = message.text;
  var time = message.createdAt;
  
  var $chatContainer = $('<div></div>').addClass('chatContainer').addClass(roomname);
  var $chat = $('<ul></ul>').addClass(username).data('objectID', objectId);
  var $user = $(`<li>${username}</li>`).addClass('user');
  var $text = $(`<li>${text}</li>`).addClass('text');
  var $time = $(`<li>${time}</li>`).addClass('time');
  $user.appendTo($chat);
  $text.appendTo($chat);
  $time.appendTo($chat);
  $chat.appendTo($chatContainer);
  $chatContainer.appendTo($('#chats'));
};

app.renderRoom = function(room) {};

//jQuery

$(document).ready(function () {
  var $chats = $('#chats');

  

});