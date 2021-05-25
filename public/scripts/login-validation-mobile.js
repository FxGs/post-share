
// mobile
const loginSubmitButtonmobile = document.getElementById('login-submit-button-mobile');
const emailInputLoginmobile = document.getElementById('email-input-login-mobile');
const passwordInputLoginmobile = document.getElementById('password-input-login-mobile');

var emailValidatedLoginmobile = false ;
var passwordValidatedLoginmobile = false;

function validateEmailLoginmobile(value) {
  $("#passwrong-mobile").css("display", "none");
    const regexString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const loginEmailMessagemobile = document.getElementById('email-message-mobile');
    if (regexString.test(String(value).toLowerCase())) {
        emailInputLoginmobile.style.borderBottom = "2px solid #32CD32";

        loginEmailMessagemobile.style = 'display:none';
        emailValidatedLoginmobile = true;
        
    } else {
        emailInputLoginmobile.style.borderBottom = "1px solid red";
        
        loginEmailMessagemobile.style = 'display:block';
        emailValidatedLoginmobile = false;
    }
    loginSubmitCheckmobile();
}

function validatePasswordLoginmobile(value) {
  $("#passwrong-mobile").css("display", "none");
    const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // const loginPasswordMessagemobile = document.getElementById('password-message-mobile');
    if (regexString.test(String(value))) {
        passwordInputLoginmobile.style.borderBottom = "1px solid #32CD32";

        // loginPasswordMessagemobile.style = 'display:none;';

        passwordValidatedLoginmobile = true;

    } else {
        passwordInputLoginmobile.style.borderBottom = "1px solid red";

        // loginPasswordMessagemobile.style = 'display:block';
        passwordValidatedLoginmobile = false;
    }
    loginSubmitCheckmobile();
}

function loginSubmitCheckmobile(){
    if (emailValidatedLoginmobile && passwordValidatedLoginmobile) {
        loginSubmitButtonmobile.disabled = false;
        loginSubmitButtonmobile.removeAttribute("disabled");
    }  else {
        loginSubmitButtonmobile.disabled = true;
        loginSubmitButtonmobile.setAttribute("disabled", true);
    }
}

document.addEventListener('input', event => {
    // $("#email-input-login-mobile").css("border-bottom", "1px solid black");
    // $("#emailwrong-mobile").css("display", "none");
    // $("#password-input-login-mobile").css("border-bottom", "1px solid black");
    // $("#passwrong-mobile").css("display", "none");
    if (event.target.matches('#password-input-login-mobile')){
        validatePasswordLoginmobile(event.target.value);
    } else if (event.target.matches('#email-input-login-mobile')){
        validateEmailLoginmobile(event.target.value);
    }
}, false);

$("#login-d-form-mobile").submit(function (e) {
    var person = {
      email: $("#email-input-login-mobile").val(),
  
      password: $("#password-input-login-mobile").val(),
    };
    // console.log(person);
    $.ajax({
      type: "POST",
      url: "/user/login",
      data: JSON.stringify(person),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        if (data.message) {
        //   console.log("success");
          window.location.href = "/posts";
        } else {
        //   console.log(data);
          $("#email-input-login-mobile").val("");
          $("#email-input-login-mobile").css("border-bottom", "1px solid red");
          // $("#emailwrong-mobile").css("display", "block");
          $("#password-input-login-mobile").val("");
          $("#password-input-login-mobile").css("border-bottom", "1px solid red");
          $("#passwrong-mobile").css("display", "block");
        }
      },
      error: function (error) {
        alert(JSON.parse(error));
      },
    });
    e.preventDefault();
  });
  