const loginSubmitButton = document.getElementById("login-submit-button");
const emailInputLogin = document.getElementById("email-input-login");
const passwordInputLogin = document.getElementById("password-input-login");

var emailValidatedLogin = false;
var passwordValidatedLogin = false;

function validateEmailLogin(value) {
  const regexString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const loginEmailMessage = document.getElementById("email-message");
  if (regexString.test(String(value).toLowerCase())) {
    emailInputLogin.style.borderBottom = "1px solid #32CD32";

    loginEmailMessage.style = "display:none";
    emailValidatedLogin = true;
  } else {
    emailInputLogin.style.borderBottom = "1px solid red";

    loginEmailMessage.style = "display:block";
    emailValidatedLogin = false;
  }
  loginSubmitCheck();
}

function validatePasswordLogin(value) {
  const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  // const loginPasswordMessage = document.getElementById('password-message');
  if (regexString.test(String(value))) {
    passwordInputLogin.style.borderBottom = "1px solid #32CD32";

    // loginPasswordMessage.style = 'display:none;';

    passwordValidatedLogin = true;
  } else {
    passwordInputLogin.style.borderBottom = "1px solid red";

    // loginPasswordMessage.style = 'display:block';
    passwordValidatedLogin = false;
  }
  loginSubmitCheck();
}

function loginSubmitCheck() {
  if (emailValidatedLogin && passwordValidatedLogin) {
    loginSubmitButton.disabled = false;
    loginSubmitButton.removeAttribute("disabled");
  } else {
    loginSubmitButton.disabled = true;
    loginSubmitButton.setAttribute("disabled", true);
  }
}

document.addEventListener(
  "input",
  (event) => {
    if (event.target.matches("#password-input-login")) {
      $("#password-input-login").css("border-bottom", "1px solid black");
      $("#emailwrong").css("display", "none");
      $("#passwrong").css("display", "none");
      validatePasswordLogin(event.target.value);
    } else if (event.target.matches("#email-input-login")) {
      $("#email-input-login").css("border-bottom", "1px solid black");
      $("#passwrong").css("display", "none");
      $("#emailwrong").css("display", "none");
      validateEmailLogin(event.target.value);
    }
  },
  false
);

$("#login-d-form").submit(function (e) {
  var person = {
    email: $("#email-input-login").val(),

    password: $("#password-input-login").val(),
  };
  console.log(person);
  $.ajax({
    type: "POST",
    url: "/user/login",
    data: JSON.stringify(person),
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      if (data.message) {
        console.log("success");
        window.location.href = "/posts";
      } else {
        console.log(data);
        $("#email-input-login").val("");
        $("#email-input-login").css("border-bottom", "1px solid red");
        $("#emailwrong").css("display", "block");
        $("#password-input-login").val("");
        $("#password-input-login").css("border-bottom", "1px solid red");
        $("#passwrong").css("display", "block");
      }
    },
    error: function (error) {
      alert(JSON.parse(error));
    },
  });
  e.preventDefault();
});
