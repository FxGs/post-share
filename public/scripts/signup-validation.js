const emailMessage = document.getElementById('email-message');
const passwordMessage = document.getElementById('password-message');
const passwordConfirmMessage = document.getElementById('password-confirm-message');
const usernameMessage = document.getElementById('username-message');
const submitButton = document.getElementById('submit-button');
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const passwordConfirmInput = document.getElementById('password-confirm-input');

var usernameValidated = false;
var emailValidated = false;
var passwordValidated = false;
var password;
var passwordConfirmed = false;

function validateEmail(value) {
    const regexString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const emailIcon = document.getElementById('email-icon');
    if (regexString.test(String(value).toLowerCase())) {
        emailIcon.classList.remove('fa-exclamation-triangle');
        emailIcon.classList.add('fa-check');

        emailInput.classList.remove('is-danger');
        emailInput.classList.add('is-success');

        emailMessage.style = 'display:none';
        emailValidated = true;
        
    } else {
        emailIcon.classList.add('fa-exclamation-triangle');
        emailIcon.classList.remove('fa-check');

        emailInput.classList.add('is-danger');
        emailInput.classList.remove('is-success');

        emailMessage.style = 'display:block';
        emailValidated = false;
    }
    submitCheck();
}

function validatePassword(value) {
    const regexString = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (regexString.test(String(value))) {
        passwordInput.classList.remove('is-danger');
        passwordInput.classList.add('is-success');

        passwordMessage.style = 'display:none;';

        passwordValidated = true;
        password = value;

    } else {
        passwordInput.classList.remove('is-success');
        passwordInput.classList.add('is-danger');

        passwordMessage.style = 'display:block';
        passwordValidated = false;
    }
    submitCheck();
}

function checkConfirm(value) {
    if (password === value) {
        passwordConfirmInput.classList.remove('is-danger');
        passwordConfirmInput.classList.add('is-success');

        passwordConfirmMessage.style = 'display:none';

        if (passwordValidated)
            passwordConfirmed = true;
    } else {
        passwordConfirmInput.classList.remove('is-success');
        passwordConfirmInput.classList.add('is-danger');

        passwordConfirmMessage.style = 'display:block';

        passwordConfirmed = false;
    }
    submitCheck();
}

function validateUserName(value) {
    const regexString = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (regexString.test(String(value))) {
        usernameInput.classList.remove('is-danger');
        usernameInput.classList.add('is-success');

        usernameMessage.style = 'display:none;';
        usernameValidated = true;
    } else {
        usernameInput.classList.remove('is-success');
        usernameInput.classList.add('is-danger');

        usernameMessage.style = 'display:block;';
        usernameValidated = false;
    }
    submitCheck();
}

function submitCheck() {
    if (emailValidated && passwordConfirmed && passwordValidated) {
        submitButton.disabled = false;
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.disabled = true;
        submitButton.setAttribute("disabled",true);
    }
}

document.addEventListener('change', event => {
    if (event.target.matches('.email-input')) {
        validateEmail(event.target.value);
    } else if (event.target.matches('.password-input')) {
        validatePassword(event.target.value);
    } else if (event.target.matches('.username-input')) {
        validateUserName(event.target.value);
    } else if (event.target.matches('.password-confirm-input')) {
        checkConfirm(event.target.value);
    }
}, false);