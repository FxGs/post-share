$(document).ready(function () {
    $("#posted").on("click", function () {
        // alert("somen domo");
        $("#liked").removeClass("is-active");
        $("#posted").addClass("is-active");
        $("#liked-div").hide();
        $("#posted-div").show();
    });
    $("#liked").on("click", function () {
        // alert("somen aniki");
        $("#posted").removeClass("is-active");
        $("#liked").addClass("is-active");
        $("#posted-div").hide();
        $("#liked-div").show();
    });
    // $("#cardImage1").hover(function(){
    //     alert("somen aniki");
    //     // $(this).css("background-color", "yellow");
    //     // }, function(){
    //     // $(this).css("background-color", "pink");
    //   });
});