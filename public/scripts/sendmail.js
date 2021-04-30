function sendMail() {
  var tempparams = {
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("text").value,
    user: document.getElementById("username").value,
  };
  console.log(tempparams);

  if (tempparams.subject && tempparams.message) {
    emailjs
      .send(
        "service_9i3rmlw",
        "template_iu96bb5",
        tempparams,
        "user_zSxmWWN1byJXXtU2VcbaH"
      )
      .then(
        function (res) {
          console.log("success", res.status);
          $("#contact-nf").css("display", "block");
          resetform();
          window.stop();
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  }
}

function resetform() {
  const sub = document.getElementById("subject");
  const text = document.getElementById("text");

  sub.value = "";
  text.value = "";

  const btn = document.getElementById("mail-btn");
  btn.setAttribute("disabled", true);

  var mssgvalidated = false;
  var subvalidated = false;

  sub.addEventListener("change", function () {
    if (sub.value !== "") {
      subvalidated = true;
    } else {
      subvalidated = false;
    }
    checkbtn();
  });

  text.addEventListener("change", function () {
    if (text.value !== "") {
      mssgvalidated = true;
    } else {
      mssgvalidated = false;
    }
    checkbtn();
  });

  function checkbtn() {
    if (subvalidated && mssgvalidated) {
      btn.setAttribute("disabled", false);
    } else {
      btn.setAttribute("disabled", true);
    }
  }
}
