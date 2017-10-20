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
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
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
  return $.ajax(result);
};

app.fetch = function(message) {
  var request = app.init();
  request.type = 'GET';
  request.data = 'order=-createdAt';
  var result = $.ajax(request);
  return result;
};

//jQuery

$(document).ready(function () {
  var $chats = $('#chats');

  // $.ajax({
  //     // This is the url you should use to communicate with the parse API server.
  //   url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  //   type: 'GET',
  //   data: 'order=-createdAt',
  //   success: function (data) {
  //     console.log(data);
  //     var messages = data.results;
  //     for (var i = 0; i < messages.length; i++) {
  //       var userName = messages[i].username;
  //       var roomName = messages[i].roomname;
  //       var text = messages[i].text;
  //       var createdTime = messages[i].createdAt;

  //       var $message = $('<div></div>');
  //       $message.addClass('message');
        
  //       $message.text(`username: ${userName} 
  //       roomname: ${roomName} 
  //       message:'${text}' 
  //       created: ${createdTime}`);
        
  //       $message.appendTo($msgContainer);
  //     }
  //   },
  //   error: function (data) {
  //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //     console.error('chatterbox: Failed to send message', data);
  //   }
  // });

});

//POST

// var message = {
//     username: 'TESTINGGGGG',
//     text: 'hellooooooooooooo',
//     roomname: '8th FLoor'
//   };
// $.ajax({
//     // This is the url you should use to communicate with the parse API server.
//     url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message', data);
//     }
//   });