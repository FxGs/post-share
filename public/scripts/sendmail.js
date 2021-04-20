function sendMail() {
  var tempparams = {
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("text").value,
    user: document.getElementById("username").value,
  };
  console.log(tempparams);

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
        window.stop();
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
}
