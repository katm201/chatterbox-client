// YOUR CODE HERE:
//    Server: http://parse.sfm8.hackreactor.com/
//    App ID: 72b8e073a4abde10221ce95f38ed1c63bd7f3d6b
//    API Key: cf1ce23a61e2a40702c347b7dc1e0af8c28f6c7a

//METHODS:

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  _rooms: {}
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
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      var messages = data.results;
      for (var i = 0; i < messages.length; i++) {
        app.renderMessage(messages[i]);
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  //will need to escape username, roomname, and text
  var username = DOMPurify.sanitize(message.username);
  var roomname = DOMPurify.sanitize(message.roomname);
  var objectId = message.objectId;
  var text = DOMPurify.sanitize(message.text);
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

  if (!(app._rooms.hasOwnProperty(roomname))) {
    var $room = $(`<option>${roomname}</option>`);
    $room.appendTo($('select'));
    app._rooms[roomname] = roomname;
  }
};



app.renderRoom = function(room) {
  //rendering a specific room from the dropdown
};

app.handleSubmit = function (argument) {
  // body...
};

//jQuery

$(document).ready(function () {
  app.fetch();
  
  $('button').on('click', function(event) {

    var $textarea = $('textarea');
    var messageText = $textarea.val();
    var room = $('#room :selected').val();

    $textarea.val('');

    var unformattedName = window.location.search;
    var index = unformattedName.indexOf('=') + 1;
    var formattedName = unformattedName.slice(index);

    var message = {
      username: formattedName,
      text: messageText,
      roomname: room
    };

    app.send(message);
    app.clearMessages();
    app.fetch();
  
  });

  //event handler to add room name
  

});