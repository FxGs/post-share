
$(document).ready(function(){
    var $loginMsg = $('.loginMsg'),
    $login = $('.login'),
    $signupMsg = $('.signupMsg'),
    $signup = $('.signup'),
    $frontbox = $('.frontbox');
  
  $('#switch1').on('click', function() {
    $loginMsg.toggleClass("visibility");
    $frontbox.addClass("moving");
    $signupMsg.toggleClass("visibility");
  
    $signup.toggleClass('hide');
    $login.toggleClass('hide');
    
    $('#switch1').prop("disabled", true);
    $('#switch2').prop("disabled", false);
  })
  
  $('#switch2').on('click', function() {
    $loginMsg.toggleClass("visibility");
    $frontbox.removeClass("moving");
    $signupMsg.toggleClass("visibility");
  
    $signup.toggleClass('hide');
    $login.toggleClass('hide');

    $('#switch2').prop("disabled", true);
    $('#switch1').prop("disabled", false);
  })

 });