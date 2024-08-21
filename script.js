


// Define the hidePopupOverlay function in the global scope
function hidePopupOverlay() {
    $('#popup-overlay').css('display', 'none');
    $('.form-container').show();
}

$(document).ready(function() {
    // Call the hidePopupOverlay function whenever needed
    // For example, when a button with id="close-popup" is clicked
    $('#close-popup').click(function() {
        hidePopupOverlay();
    });
});


// Define the startCountdown function globally
function startCountdown($resultElement) {
    var countdown = 3; // Set countdown duration
    var countdownElement = $("<div id='countdown'></div>");

    // Check if $resultElement is defined and not null
    if ($resultElement && $resultElement.length > 0) {
        $resultElement.after(countdownElement);
    } else {
        // If $resultElement is undefined or null, append countdown element to body
        $("body").append(countdownElement);
    }

    // Set font size and margin top for countdown element
    countdownElement.css({
        "font-size": "10px", // Adjust font size for smaller screens
        "margin-top": "10px" // Adjust margin top as needed
    });

    var countdownInterval = setInterval(function() {
        countdown--;
        countdownElement.text("Redirecting in " + countdown + " seconds...");

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            // Hide the popup overlay after countdown ends
            $("#popup-overlay").css("display", "none");
        }
    }, 1000);
}

$(document).ready(function(){
    ajaxMailChimpForm($("#subscribe-form"), $("#subscribe-result"));

    // Turn the given MailChimp form into an ajax version of it.
    // If resultElement is given, the subscribe result is set as html to
    // that element.
    function ajaxMailChimpForm($form, $resultElement){
        // Hijack the submission. We'll submit the form manually.
        $form.submit(function(e) {
            e.preventDefault();

            if (!isValidEmail($form)) {
                var error =  "A valid email address must be provided.";
                $resultElement.html(error);
                $resultElement.css("color", "red");
            } else {
                $resultElement.css("color", "black");
                $resultElement.html("Subscribing...");
                if ($(window).width() <= 425) {
                    $resultElement.css("font-size", "10px"); // Adjust font size for smaller screens
                }
                submitSubscribeForm($form, $resultElement);
            }
        });
    }

    // Validate the email address in the form
    function isValidEmail($form) {
        // If email is empty, show error message.
        // contains just one @
        var email = $form.find("input[type='email']").val();
        if (!email || !email.length) {
            return false;
        } else if (email.indexOf("@") == -1) {
            return false;
        }

        return true;
    }

    // Submit the form with an ajax/jsonp request.
    // Based on http://stackoverflow.com/a/15120409/215821
    function submitSubscribeForm($form, $resultElement) {
        $.ajax({
            type: "GET",
            url: $form.attr("action"),
            data: $form.serialize(),
            cache: false,
            dataType: "jsonp",
            jsonp: "c", // trigger MailChimp to return a JSONP response
            contentType: "application/json; charset=utf-8",

            error: function(error){
                // According to jquery docs, this is never called for cross-domain JSONP requests
            },

            success: function(data){
                if (data.result != "success") {
                    var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                    $resultElement.css("color", "red");

                    if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                        message = "You're already subscribed. Thank you.";
                        $resultElement.css("color", "black");
                    }

                    $resultElement.html(message);

                } else {
                    $resultElement.css("color", "black");
                    $resultElement.html("Thank You For Subscribing!");
                      // Check screen width and set font size accordingly
    if ($(window).width() <= 425) {
        $resultElement.css("font-size", "10px"); // Adjust font size for smaller screens
    }
                    $form.hide();
                   /* setCookie("subscriptionFormSubmitted", "true", 30); // Cookie expires in 30 days */

                    // Log the value of the cookie
                    /*console.log("Cookie value after successful subscription:", getCookie("subscriptionFormSubmitted")); */

                    // Start countdown after 2 seconds
                    setTimeout(function() {
                        startCountdown($resultElement);
                    }, 2000);
                }
            }
        });
    }
});


$(document).ready(function(){
  ajaxMailChimpForm($("#subscribe-form1"), $("#subscribe-result1"));

  // Turn the given MailChimp form into an ajax version of it.
  // If resultElement is given, the subscribe result is set as html to
  // that element.
  function ajaxMailChimpForm($form, $resultElement){

      // Hijack the submission. We'll submit the form manually.
      $form.submit(function(e) {
          e.preventDefault();

          if (!isValidEmail($form)) {
              var error =  "A valid email address must be provided.";
              $resultElement.html(error);
              $resultElement.css("color", "red");
          } else {
              $resultElement.css("color", "black");
              $resultElement.html("Subscribing...");
              submitSubscribeForm($form, $resultElement);
          }
      });
  }

  // Validate the email address in the form
  function isValidEmail($form) {
      // If email is empty, show error message.
      // contains just one @
      var email = $form.find("input[type='email']").val();
      if (!email || !email.length) {
          return false;
      } else if (email.indexOf("@") == -1) {
          return false;
      }

      return true;
  }

  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form, $resultElement) {
      $.ajax({
          type: "GET",
          url: $form.attr("action"),
          data: $form.serialize(),
          cache: false,
          dataType: "jsonp",
          jsonp: "c", // trigger MailChimp to return a JSONP response
          contentType: "application/json; charset=utf-8",

          error: function(error){
              // According to jquery docs, this is never called for cross-domain JSONP requests
          },

          success: function(data){
              if (data.result != "success") {
                  var message = data.msg || "Sorry. Unable to subscribe. Please try again later.";
                  $resultElement.css("color", "red");

                  if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                      message = "You're already subscribed. Thank you.";
                      $resultElement.css("color", "black");
                  }

                  $resultElement.html(message);

              } else {
                  $resultElement.css("color", "black");
                  $resultElement.html("Thank You For Subscribing");
                  $form.hide();
                  setCookie("subscriptionFormSubmitted", "true", 30); // Cookie expires in 30 days

                      // Log the value of the cookie
                      console.log("Cookie value after successful subscription:", getCookie("subscriptionFormSubmitted"));
              }
          }
      });
  }

});



// Function to set a cookie with a specified name, value, and expiration date
function setCookie(cookieName, cookieValue, expirationDays) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Function to get the value of a cookie by its name
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Function to check if a cookie exists and has a specified value
function checkCookie(cookieName, expectedValue) {
    var cookieValue = getCookie(cookieName);
    return cookieValue === expectedValue;
}

// Function to control the visibility of elements based on cookie value
function manageSubscriptionFormVisibility() {
    if (checkCookie("subscriptionFormSubmitted", "true")) {
        $('#popup-overlay').css('display', 'none');
        $('#subscribe-form1').hide();
        $('.form-container').hide();
        $('#subscribe-result1').show();
    } else {
        $('#popup-overlay').css('display', 'block');
    }
}


$(document).ready(function() {
    // Check the cookie when the page loads
    manageSubscriptionFormVisibility();
});



function toggleMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.dropdown-menu');
    var content = document.querySelector('.content-row');
    var section1 = document.querySelector('.section1');
    var backHomeLink = document.querySelector('.back-home-link');
    var coursePage = document.querySelector('.course-page');
    var recommendedBooks = document.querySelector('.recommended-books');
    var courseContainer = document.querySelector('.course-container');
    var contactPage = document.querySelector('.contact-page'); // Add this line
    var contactFooter = document.querySelector('.contact-footer');
    var aboutPage = document.querySelector('.about-container');

    var screenWidth = window.innerWidth; // Get the current screen width

    console.log('menuToggle:', menuToggle);
    console.log('menu:', menu);
    console.log('content:', content);
    console.log('section1:', section1);
    console.log('screenWidth:', screenWidth);

    // Toggle the menu-open class on menu and content
    if (menu) {
        menu.classList.toggle('menu-open');
    }

    if (content) {
        content.classList.toggle('menu-open');
    }

    // Slide content down when menu is opened, slide up when closed
    if (menu && menu.classList.contains('menu-open')) {
        // Move down the back-home-link, course-page, and recommended-books elements
        if (backHomeLink) {
            backHomeLink.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            backHomeLink.style.transform = 'translateY(230px)'; // Adjust translateY value as needed
        }
        if (coursePage) {
            coursePage.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            coursePage.style.transform = 'translateY(230px)';
        }
        if (recommendedBooks) {
            recommendedBooks.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            recommendedBooks.style.transform = 'translateY(230px)';
        }

        if (contactPage) {
            contactPage.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            contactPage.style.transform = 'translateY(230px)';
            contactFooter.style.transition = 'transform 0.5s ease-in-out';
            contactFooter.style.transform = 'translateY(230px)';

        }

        if (aboutPage) {
            aboutPage.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            aboutPage.style.transform = 'translateY(230px)';

        }
        // Move content down for screen width <= 425px
        if (content && screenWidth <= 425) {
            content.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            content.style.transform = 'translateY(300px)'; // Adjust translation for smaller screens
            section1.style.paddingBottom = '400px';
        } else if (content) {
            content.style.transition = ''; // Remove transition
            content.style.transform = ''; // Reset translation
            section1.style.paddingBottom = '100px';
        }

        // Slide down course-container smoothly for screen width <= 425px
        if (courseContainer && screenWidth <= 425) {
            courseContainer.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            courseContainer.style.transform = 'translateY(280px)'; // Adjust translation
        } else if (courseContainer) {
            courseContainer.style.transition = ''; // Remove transition
            courseContainer.style.transform = ''; // Reset translation
        }
    } else {
        // Reset transformations when menu is closed
        if (backHomeLink) {
            backHomeLink.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            backHomeLink.style.transform = 'translateY(0)'; // Reset translateY
        }
        if (coursePage) {
            coursePage.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            coursePage.style.transform = 'translateY(0)'; // Reset translateY
        }
        if (recommendedBooks) {
            recommendedBooks.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            recommendedBooks.style.transform = 'translateY(0)'; // Reset translateY
        }

        if (contactPage) {
            contactPage.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            contactPage.style.transform = 'translateY(0)'; // Reset translateY
            contactFooter.style.transition = 'transform 0.5s ease-in-out';
            contactFooter.style.transform = 'translateY(0px)';
        }

        if (aboutPage) {
            aboutPage.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            aboutPage.style.transform = 'translateY(0)'; // Reset translateY
        }
        // Reset content position
        if (content) {
            content.style.transition = ''; // Remove transition
            content.style.transform = ''; // Reset translateY
            section1.style.transition = 'padding-bottom 0.5s ease-in-out'; // Add transition
            section1.style.paddingBottom = '0'; // Reset padding
        }
        // Slide up course-container smoothly when menu is closed for screen width <= 425px
        if (courseContainer && screenWidth <= 425) {
            courseContainer.style.transition = 'transform 0.5s ease-in-out'; // Add transition
            courseContainer.style.transform = 'translateY(0)'; // Reset translation
        } else if (courseContainer) {
            courseContainer.style.transition = ''; // Remove transition
            courseContainer.style.transform = ''; // Reset translation
        }
    }

    // Toggle the hamburger icon animation
    if (menuToggle) {
        menuToggle.classList.toggle('menu-open');
    }
}


