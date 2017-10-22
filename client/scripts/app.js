var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  lastMessageId: 0,
  friends: {},
  messages: [],

  init: function() {
    // gets the username from whatever the person
    // submitted on entering the page
    app.username = window.location.search.substr(10);

    // caches jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // add event listeners
    app.$chats.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    // fetch previous messages
    app.fetch();

    // check for new messages
    setInterval(app.fetch, 3000);
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      success: function(data) {
        // clears messages input
        app.$message.val('');

        // trigger a fetch to update the messages
        app.fetch();

        // message in console to indicate a successful send
        console.log('Message sent.');
      },
      error: function(error) {
        console.log('Chatterbox: Failed to send message', error);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: 'order=-createdAt',
      success: function(data) {
        // doesn't do anything if there are no messages
        // to work with
        if (!data.results || !data.results.length) {
          return;
        }

        // store messages for caching later
        app.messages = data.results;

        // get the most recent message
        var mostRecentMessage = data.results[0];

        // only update the DOM if we have a new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // updates the UI with the fetched rooms
          app.renderRoomList(data.results);
          // updates the UI with the fetched messages
          app.renderMessages(data.results);
          // stores the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(error) {
        console.error('Chatterbox failed to fetch messages', error);
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessages: function(messages) {
    // clear existing messages to avoid duplicates
    app.clearMessages();

    // add all fetched messages that are in our current room
    var messagesInRoom = messages.filter(function(message) {
      return (message.roomname === app.roomname) || (app.roomname === 'lobby' && !message.roomname);
    });
    messagesInRoom.forEach(app.renderMessage);
  },

  renderMessage: function(message) {
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    // create a div to hold the chats
    var $chat = $('<div></div>').addClass('chat');

    // add in the mssage data using DOM methods to avoid XSS
    // store the username in the element's data attribute
    var $username = $('<span></span>').addClass('username');
    $username.text(message.username + ':');
    $username.attr('data-roomname', message.roomname);
    $username.attr('data-username', message.username);
    $username.appendTo($chat);

    // add the friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span></span>');
    $message.text(message.text).appendTo($chat);

    // add message to the UI
    app.$chats.append($chat);
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          // adds the room to the select menu
          app.renderRoom(roomname);

          // stores that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // select the menu option
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    // prevent XSS with DOM methods
    var $option = $('<option></option>').val(roomname).text(roomname);

    // add to select
    app.$roomSelect.append($option);
  },

  handleUsernameClick: function(event) {
    // get username from data attribute
    var username = $(event.target).data('username');

    if (username !== undefined) {
      // toggle friend
      app.friends[username] = !app.friends[username];

      // escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

      // add friend class to all that user's messages
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function(event) {
    // sets selectIndex to the index of whichever room has been selected
    // from the dropdown menu
    var selectIndex = app.$roomSelect.prop('selectedIndex');

    // new room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // set as current room
        app.roomname = roomname;
        // add the room to the menu
        app.renderRoom(roomname);
        // select the menu option
        app.$roomSelect.val(roomname)
      } 
    } else {
    // anything besides new room, get the dropdown's value
      app.roomname = app.$roomSelect.val()
    }
    // rerenders the messages
    app.renderMessages(app.messages);
  },

  handleSubmit: function(event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);

    // stop the form from submitting
    event.preventDefault();
  }
};
