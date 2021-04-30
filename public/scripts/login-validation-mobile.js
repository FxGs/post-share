
// mobile
const loginSubmitButtonmobile = document.getElementById('login-submit-button-mobile');
const emailInputLoginmobile = document.getElementById('email-input-login-mobile');
const passwordInputLoginmobile = document.getElementById('password-input-login-mobile');

var emailValidatedLoginmobile = false ;
var passwordValidatedLoginmobile = false;

function validateEmailLoginmobile(value) {
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
    if (event.target.matches('#password-input-login-mobile')){
        validatePasswordLoginmobile(event.target.value);
    } else if (event.target.matches('#email-input-login-mobile')){
        validateEmailLoginmobile(event.target.value);
    }
}, false);