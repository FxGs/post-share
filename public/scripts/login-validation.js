const loginSubmitButton = document.getElementById('login-submit-button');
const emailInputLogin = document.getElementById('email-input-login');
const passwordInputLogin = document.getElementById('password-input-login');

var emailValidatedLogin = false ;
var passwordValidatedLogin = false;

function validateEmailLogin(value) {
    const regexString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const loginEmailMessage = document.getElementById('email-message');
    if (regexString.test(String(value).toLowerCase())) {
        emailInputLogin.style.border = "1px solid #32CD32";

        loginEmailMessage.style = 'display:none';
        emailValidatedLogin = true;
        
    } else {
        emailInputLogin.style.border = "1px solid red";
        
        loginEmailMessage.style = 'display:block';
        emailValidatedLogin = false;
    }
    loginSubmitCheck();
}

function validatePasswordLogin(value) {
    const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const loginPasswordMessage = document.getElementById('password-message');
    if (regexString.test(String(value))) {
        passwordInputLogin.style.border = "1px solid #32CD32";

        loginPasswordMessage.style = 'display:none;';

        passwordValidatedLogin = true;

    } else {
        passwordInputLogin.style.border = "1px solid red";

        loginPasswordMessage.style = 'display:block';
        passwordValidatedLogin = false;
    }
    loginSubmitCheck();
}

function loginSubmitCheck(){
    if (emailValidatedLogin && passwordValidatedLogin) {
        loginSubmitButton.disabled = false;
        loginSubmitButton.removeAttribute("disabled");
    }  else {
        loginSubmitButton.disabled = true;
        loginSubmitButton.setAttribute("disabled", true);
    }
}

document.addEventListener('change', event => {
    if (event.target.matches('#password-input-login')){
        validatePasswordLogin(event.target.value);
    } else if (event.target.matches('#email-input-login')){
        validateEmailLogin(event.target.value);
    }
}, false);
