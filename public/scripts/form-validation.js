const author = document.getElementById("author");
const title = document.getElementById("title");
const body = document.getElementById("body");

const newpostBtn = document.getElementById("newpost");

var authorValidated = false;
var bodyValidated = false;
var titleValidated = false; 

document.addEventListener('change', event => {
    if (event.target.matches('#author')) {
        validateauthor(event.target.value);
    } else if (event.target.matches('#title')) {
        validatetitle(event.target.value);
    } else if (event.target.matches('#body')) {
        validatebody(event.target.value);}
}, false);

function validateauthor(value){
    
    if(String(value) === ""){
        author.classList.remove("is-success");
        author.classList.add("is-danger");
        document.getElementById("authorSuccessIcon").style.display="none";
        document.getElementById("authorErrorIcon").style.display="block";
        document.getElementById("author_error").style.display="block";
        authorValidated= false;
    }
    else{
        author.classList.remove("is-danger");
        author.classList.add("is-success");
        document.getElementById("authorErrorIcon").style.display="none";
        document.getElementById("authorSuccessIcon").style.display="block";
        document.getElementById("author_error").style.display="none";
        authorValidated= true;
        
    }
    checkSubmit();
}

function validatetitle(value){
    
    if(String(value) === ""){
        title.classList.remove("is-success");
        title.classList.add("is-danger");
        document.getElementById("titleSuccessIcon").style.display="none";
        document.getElementById("titleErrorIcon").style.display="block";
        document.getElementById("title_error").style.display="block";
        titleValidated= false;
    }
    else{
        title.classList.remove("is-danger");
        title.classList.add("is-success");
        document.getElementById("titleErrorIcon").style.display="none";
        document.getElementById("titleSuccessIcon").style.display="block";
        document.getElementById("title_error").style.display="none";
        titleValidated= true;
        
    }
    checkSubmit();
}


function validatebody(value){
    
    if(String(value) === ""){
        body.classList.remove("is-success");
        body.classList.add("is-danger");
        document.getElementById("bodySuccessIcon").style.display="none";
        document.getElementById("bodyErrorIcon").style.display="block";
        document.getElementById("body_error").style.display="block";
        bodyValidated= false;
    }
    else{
        body.classList.remove("is-danger");
        body.classList.add("is-success");
        document.getElementById("bodyErrorIcon").style.display="none";
        document.getElementById("bodySuccessIcon").style.display="block";
        document.getElementById("body_error").style.display="none";
        bodyValidated= true;
        
    }
    checkSubmit();
}

function checkSubmit(){
    if(authorValidated && titleValidated && bodyValidated){
        newpostBtn.disabled=false;
        newpostBtn.removeAttribute('disabled');
    }
    else{
        newpostBtn.disabled=true;
        newpostBtn.setAttribute('disabled','true');
    }
}