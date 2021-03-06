// mobile
const signupSubmitButtonMobile = document.getElementById('signup-submit-button-mobile');
const usernameInputMobile = document.getElementById('username-input-mobile');
const emailInputMobile = document.getElementById('email-input-mobile');
const passwordInputMobile = document.getElementById('password-input-mobile');
const passwordConfirmInputMobile = document.getElementById('password-confirm-input-mobile');

var usernameValidatedMobile = false;
var emailValidatedMobile = false;
var passwordValidatedMobile = false;
var passwordMobile;
var confirmPasswordMobile;
var passwordConfirmedMobile = false;
var v = false;

function validateUserNameMobile(value) {
    const regexString = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // const usernameSuccessIconMobile = document.getElementById('username-successIcon-mobile');
    // const usernameErrorIconMobile = document.getElementById('username-errorIcon-mobile');
    // const usernameMessageMobile = document.getElementById('username-message-mobile');
    if (regexString.test(String(value.trim()))) {
        usernameInputMobile.style.borderBottom = "1px solid #32CD32";

        // usernameErrorIconMobile.style.display = "none";
        // usernameSuccessIconMobile.style.display = "block";  

        // usernameMessageMobile.style = 'display:none;';
        usernameValidatedMobile = true;
    } else {
        usernameInputMobile.style.borderBottom = "1px solid red";

        // usernameSuccessIconMobile.style.display = "none";
        // usernameErrorIconMobile.style.display = "block";

        // usernameMessageMobile.style = 'display:block;';
        usernameValidatedMobile = false;
    }
    signupsubmitCheckMobile();
}


function validateEmailMobile(value) {
    const regexString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // const emailSuccessIconMobile = document.getElementById('email-successIcon-mobile');
    // const emailErrorIconMobile = document.getElementById('email-errorIcon-mobile');
    const emailMessageMobile = document.getElementById('email-signup-message-mobile');
    if (regexString.test(String(value.trim()).toLowerCase())) {
        emailInputMobile.style.borderBottom = "1px solid #32CD32";

        // emailErrorIconMobile.style.display = "none";
        // emailSuccessIconMobile.style.display = "block";

        emailMessageMobile.style = 'display:none';
        emailValidatedMobile = true;
        
    } else {
        emailInputMobile.style.borderBottom = "1px solid red";

        // emailSuccessIconMobile.style.display = "none";
        // emailErrorIconMobile.style.display = "block";
        
        emailMessageMobile.style = 'display:block';
        emailValidatedMobile = false;
    }
    signupsubmitCheckMobile();
}

function validatePasswordMobile(value) {
    const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const passwordConfirmMessageMobile = document.getElementById('password-confirm-message-mobile');
    // const passwordMessageMobile = document.getElementById('password-signup-message-mobile');
    if (regexString.test(String(value))) {
        passwordInputMobile.style.borderBottom = "1px solid #32CD32";

        // passwordMessageMobile.style = 'display:none;';

        passwordValidatedMobile = true;
        // passwordMobile = value;

    } else {
        passwordInputMobile.style.borderBottom = "1px solid red";

        // passwordMessageMobile.style = 'display:block';
        passwordValidatedMobile = false;
    }
    passwordMobile = value;
    if(v === true){
        if (confirmPasswordMobile === value) {
            passwordConfirmInputMobile.style.borderBottom = "1px solid #32CD32";
    
            passwordConfirmMessageMobile.style = 'display:none';
    
            if (passwordValidatedMobile)
                passwordConfirmedMobile = true;
        } else {
            passwordConfirmInputMobile.style.borderBottom = "1px solid red";
    
            passwordConfirmMessageMobile.style = 'display:block';
    
            passwordConfirmedMobile = false;
        }
        if(confirmPasswordMobile === ""){
            passwordConfirmInputMobile.style.borderBottom = "1px solid red";
        }
    }
    signupsubmitCheckMobile();
}

function checkConfirmMobile(value) {

    const passwordConfirmMessageMobile = document.getElementById('password-confirm-message-mobile');
    if (passwordMobile === value) {
        passwordConfirmInputMobile.style.borderBottom = "1px solid #32CD32";

        passwordConfirmMessageMobile.style = 'display:none';

        if (passwordValidatedMobile)
            passwordConfirmedMobile = true;
    } else {
        passwordConfirmInputMobile.style.borderBottom = "1px solid red";

        passwordConfirmMessageMobile.style = 'display:block';

        passwordConfirmedMobile = false;
    }
    confirmPasswordMobile = value;
    if(confirmPasswordMobile === ""){
        passwordConfirmInputMobile.style.borderBottom = "1px solid red";
        passwordConfirmedMobile = false;
    }
    v = true;
    signupsubmitCheckMobile();
}

function signupsubmitCheckMobile() {
    // console.log(usernameValidatedMobile + " " + emailValidatedMobile + " " +passwordValidatedMobile)
    if (usernameValidatedMobile && emailValidatedMobile && passwordConfirmedMobile && passwordValidatedMobile) {
        signupSubmitButtonMobile.disabled = false;
        signupSubmitButtonMobile.removeAttribute("disabled");
    } else {
        signupSubmitButtonMobile.disabled = true;
        signupSubmitButtonMobile.setAttribute("disabled",true);
    }
}

document.addEventListener('input', event => {
    if (event.target.matches('#email-input-mobile')) {
        validateEmailMobile(event.target.value);
    } else if (event.target.matches('#password-input-mobile')) {
        validatePasswordMobile(event.target.value);
    } else if (event.target.matches('#username-input-mobile')) {
        validateUserNameMobile(event.target.value);
    } else if (event.target.matches('#password-confirm-input-mobile')) {
        checkConfirmMobile(event.target.value);
    }
}, false);
