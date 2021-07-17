$(document).ready(function () {
    $("#liked-div").hide();
    var $grid = $('.grid1').isotope({
        // options
        itemSelector: '.grid-item',
        percentPosition: true,
        
        masonry: {
          // set to the element
          columnWidth: '.grid-sizer',
          gutter: 5
        }
      });
      $grid.imagesLoaded().progress( function() {
        $grid.isotope('layout');
      });
    $("#posted").on("click", function () {
        // alert("somen domo");
        $("#liked").removeClass("is-active");
        $("#posted").addClass("is-active");
        $("#liked-div").hide();
        $("#posted-div").show();
        var $grid = $('.grid1').isotope({
            // options
            itemSelector: '.grid-item',
            percentPosition: true,
            
            masonry: {
              // set to the element
              columnWidth: '.grid-sizer',
              gutter: 5
            }
          });
          $grid.imagesLoaded().progress( function() {
            $grid.isotope('layout');
          });
    });
    $("#liked").on("click", function () {
        // alert("somen aniki");
        $("#posted").removeClass("is-active");
        $("#liked").addClass("is-active");
        $("#posted-div").hide();
        $("#liked-div").show();
        var $grid2 = $('.grid2').isotope({
            // options
            itemSelector: '.grid-item2',
            percentPosition: true,
          
            masonry: {
              // set to the element
              columnWidth: '.grid-sizer2',
              gutter: 5
            }
          });
         $grid2.imagesLoaded().progress( function() {
         $grid2.isotope('layout');
         });
    });
    // $("#cardImage1").hover(function(){
    //     alert("somen aniki");
    //     // $(this).css("background-color", "yellow");
    //     // }, function(){
    //     // $(this).css("background-color", "pink");
    //   });
});