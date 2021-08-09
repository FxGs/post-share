const signupSubmitButton = document.getElementById("signup-submit-button");
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const passwordConfirmInput = document.getElementById("password-confirm-input");

var usernameValidated = false;
var emailValidated = false;
var passwordValidated = false;
var password;
var confirmPassword;
var passwordConfirmed = false;
var v = false;

function validateUserName(value) {
  const regexString = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  // const usernameSuccessIcon = document.getElementById('username-successIcon');
  // const usernameErrorIcon = document.getElementById('username-errorIcon');
  // const usernameMessage = document.getElementById('username-message');
  if (regexString.test(String(value.trim()))) {
    usernameInput.style.borderBottom = "1px solid #32CD32";

    // usernameErrorIcon.style.display = "none";
    // usernameSuccessIcon.style.display = "block";

    // usernameMessage.style = 'display:none;';
    usernameValidated = true;
  } else {
    usernameInput.style.borderBottom = "1px solid red";

    // usernameSuccessIcon.style.display = "none";
    // usernameErrorIcon.style.display = "block";

    // usernameMessage.style = 'display:block;';
    usernameValidated = false;
  }
  signupsubmitCheck();
}

function validateEmail(value) {
  const regexString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // const emailSuccessIcon = document.getElementById('email-successIcon');
  // const emailErrorIcon = document.getElementById('email-errorIcon');
  const emailMessage = document.getElementById("email-signup-message");
  if (regexString.test(String(value.trim()).toLowerCase())) {
    emailInput.style.borderBottom = "1px solid #32CD32";

    // emailErrorIcon.style.display = "none";
    // emailSuccessIcon.style.display = "block";

    emailMessage.style = "display:none";
    emailValidated = true;
  } else {
    emailInput.style.borderBottom = "1px solid red";

    // emailSuccessIcon.style.display = "none";
    // emailErrorIcon.style.display = "block";

    emailMessage.style = "display:block";
    emailValidated = false;
  }
  signupsubmitCheck();
}

function validatePassword(value) {
  const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  // const passwordMessage = document.getElementById('password-signup-message');
  const passwordConfirmMessage = document.getElementById(
    "password-confirm-message"
  );
  if (regexString.test(String(value))) {
    passwordInput.style.borderBottom = "1px solid #32CD32";

    // passwordMessage.style = 'display:none;';

    passwordValidated = true;
    // password = value;
  } else {
    passwordInput.style.borderBottom = "1px solid red";

    // passwordMessage.style = 'display:block';
    passwordValidated = false;
  }
  password = value;
  if (v === true ) {
    // console.log(confirmPassword);
    if (confirmPassword === value) {
      passwordConfirmInput.style.borderBottom = "1px solid #32CD32";

      passwordConfirmMessage.style = "display:none";

      if (passwordValidated) passwordConfirmed = true;
    } else {
      passwordConfirmInput.style.borderBottom = "1px solid red";

      passwordConfirmMessage.style = "display:block";

      passwordConfirmed = false;
    }
    if(confirmPassword === ""){
      passwordConfirmInput.style.borderBottom = "1px solid red";
    }
  }
  signupsubmitCheck();
}

function checkConfirm(value) {
  const passwordConfirmMessage = document.getElementById(
    "password-confirm-message"
  );
  if (password === value) {
    passwordConfirmInput.style.borderBottom = "1px solid #32CD32";

    passwordConfirmMessage.style = "display:none";

    if (passwordValidated) passwordConfirmed = true;
  } else {
    passwordConfirmInput.style.borderBottom = "1px solid red";

    passwordConfirmMessage.style = "display:block";

    passwordConfirmed = false;
  }

  confirmPassword = value;
  if(confirmPassword === ""){
    passwordConfirmInput.style.borderBottom = "1px solid red";
    passwordConfirmed = false;
  }
  v = true;
  signupsubmitCheck();
}

function signupsubmitCheck() {
  if (
    usernameValidated &&
    emailValidated &&
    passwordConfirmed &&
    passwordValidated
  ) {
    signupSubmitButton.disabled = false;
    signupSubmitButton.removeAttribute("disabled");
  } else {
    signupSubmitButton.disabled = true;
    signupSubmitButton.setAttribute("disabled", true);
  }
}

document.addEventListener(
  "input",
  (event) => {
    if (event.target.matches("#email-input")) {
      validateEmail(event.target.value);
    } else if (event.target.matches("#password-input")) {
      validatePassword(event.target.value);
    } else if (event.target.matches("#username-input")) {
      validateUserName(event.target.value);
    } else if (event.target.matches("#password-confirm-input")) {
      checkConfirm(event.target.value);
    }
  },
  false
);
