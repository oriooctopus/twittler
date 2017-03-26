var smallFontSize = $('main').css('font-size');
var largeFontSize = '27px'; // WHEN ADJUSTING ALSO ADJUST THE CALCULATED HEIGHTS FOR TWEETS IN THE CSS FILE!!!!!!!!!!
var filterValue = 'blur("0px")';

function setEqualToScreenHeight(item) {
  var height = window.innerHeight;
  $(item).height(height);
}

function generateTweets() {
  $(document).ready(function(){
    var $tweetsContainer = $('#tweetsContainer');
    $tweetsContainer.html('');
    var index = 10;
    while(index >= 0){
      var tweet = streams.home[index];
      var $tweet = $('<div class="tweets"></div>');  
      var readableDate = 'Tweeted on ' + moment.unix(Date.parse(tweet.created_at) / 1000).format("dddd MMMM DD, YYYY");
      var $timeStamp = $('<h5>' + '- ' + readableDate + '</h5>');
      
      $tweet.html('<a class="user">@' + tweet.user + '</a>: ' + tweet.message);
      $timeStamp.appendTo($tweet);
      $tweet.appendTo($tweetsContainer);
      
      changeTweetStyles(10 - index, 3);
      index -= 1;
    }
  });
} 

function changeTweetStyles(i, main) {
  var list = $('.tweets');
    
  if (i === 3 || i === 5) {
    $(list[i]).css('font-size', smallFontSize.substring(0, smallFontSize.length - 2) * .9);
    $(list[i]).css('width', '30%');
  } else if (i === 2 || i === 6) {
    $(list[i]).css('font-size', smallFontSize.substring(0, smallFontSize.length - 2) * .8);
    $(list[i]).css('width', '27%');
  } else if (i === 1 || i === 7) {
    $(list[i]).css('font-size', smallFontSize.substring(0, smallFontSize.length - 2) * .7);
    $(list[i]).css('width', '24%');
  } else if (i === 0 || i === 8) {
    $(list[i]).css('font-size', smallFontSize.substring(0, smallFontSize.length - 2) * .6);
    $(list[i]).css('width', '21%');
  } else if (i === 9) {
    $(list[i]).css('font-size', smallFontSize.substring(0, smallFontSize.length - 2) * .5);
    $(list[i]).css('width', '18%');
  }
  
  if (i === main - 2) {
    $(list[i]).css('height', '11.1111111%');
  }
  if (i === main - 1) {
    setTimeout(function() {
      $('.tweets:nth-child(' + (main) + ') h5').css('display', 'none');
    }, 350)
    $('.tweets:nth-child(' + (main) + ') h5').css('opacity', 0);
    $(list[i]).css('overflow', 'hidden');
    $(list[i])
      .css({
         'filter'         : 'blur(2px)',
         '-webkit-filter' : 'blur(2px)',
         '-moz-filter'    : 'blur(2px)',
         '-o-filter'      : 'blur(2px)',
         '-ms-filter'     : 'blur(2px)'
      });
    $(list[i]).css('height', '8.111%');
  } else if (i === main) {
    $('.tweets:nth-child(' + (main + 1) + ') h5').css('display', 'block');
    $('.tweets:nth-child(' + (main + 1) + ') h5').css('opacity', 1);
    $(list[i]).css('font-size', largeFontSize);
    $(list[i]).css('width', '90%');
    $(list[i]).css('overflow', 'inherit');
    $(list[i]).css('height', '14%');
    $(list[i])
      .css({
         'filter'         : 'blur(0px)',
         '-webkit-filter' : 'blur(0px)',
         '-moz-filter'    : 'blur(0px)',
         '-o-filter'      : 'blur(0px)',
         '-ms-filter'     : 'blur(0px)'
      });
  }
}


function rotateTweets() {
  streams.home.push(streams.home.pop());
  
  var newTweet = streams.home[streams.home.length - 1];
  var $newElement = $('<div class="tweets"></div>');
  $newElement.html('@' + newTweet.user + ': ' + newTweet.message);
  var $timeStamp = $('<h5>' + '- ' + newTweet.created_at + '</h5>');
  $timeStamp.appendTo($newElement);
  $newElement.appendTo($('#tweetsContainer'));
  
  var animationLength = 500;
  var mainElement = $('.tweets:nth-child(6)');
  
  for (var i=0; i <= 9; i++) {
    changeTweetStyles(i, 4); 
  }  
  
  $('#tweetsContainer').animate({
    top: 0,
  }, animationLength, function() {
    var lostHeight = $('.tweets:first-child').height();
    $('.tweets:first-child').remove();
    $('#tweetsContainer').css('top', lostHeight);
  }); 
}

function generateUserSpecificTweets(target, user) {
  var selectedTweets = [];
  streams.home.forEach(function(element) {
    if (element.user === user) {
      selectedTweets.push(element);
    }
  });
  
  return selectedTweets;
}

function editModal(selectedTweets, user) {
  $('.modal-header h2').text('@' + user);
  $('.modal-body ul').html('');
  selectedTweets.forEach(function(element) {
    var message = element.message.trim();
    $('.modal-body ul').append('<li>' + message + '</li>');
  });
}

function displayModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'block';
  
  $('.close').on('click', function() {
    $('#myModal').css('display', 'none');
  });
  
  $(window).on('click', function(event) {
    if (event.target == modal) {
      $('#myModal').css('display', 'none');
    }
  });
}

generateTweets();
setEqualToScreenHeight('body');
setEqualToScreenHeight('main');


setInterval(function() {
  rotateTweets();
}, 5000);

$(document.body).on('click', '.tweets .user', function(e) {
  var user = $(e.target).text().substring(1);
  var selectedTweets = generateUserSpecificTweets(e.target, user);
  
  editModal(selectedTweets, user);
  displayModal();
});