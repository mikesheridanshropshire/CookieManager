// cookiemanager.js
// A basic set of functions for cookie opt-out handling on shropshire.gov.uk
// Sets consent for three types of cookies
// SC_COOKIE_ESSENTIAL (essential functions)
// SC_COOKIE_GA (Analytics)
// SC_COOKIE_SI (Site Improve)
// M Sheridan 2019
// D Shepherd - adding functionality for 'Reject all' option 02/Aug/2021
// M Sheridan - refactored to minimise JQuery useage and improve support for older browsers May 22

// globals

var essentialcookies = true;
var gacookies = false;
var sicookies = false;

var strtoday = new Date();

var strcookies = ['SC_COOKIE_GA', 'SC_COOKIE_SI', 'SC_COOKIE_ESSENTIAL'];

    //sets or expires a single named cookie
    function setcookie(name, value, expires_y, expires_m, expires_d) {
            var cookiestring = name + "=" + value + ";path=/";
            
            if (expires_y) {
                var expires = new Date(expires_y, expires_m, expires_d);
                cookiestring += "; expires=" + expires.toGMTString();
            }

            document.cookie = cookiestring;

    }

    //sets all cookies to true when the user hits accept all button
    function setcookieacceptall(updatebuttons)
    {
    
        var strday = String(strtoday.getDate()).padStart(2, '0');
        var strmonth = String(strtoday.getMonth()).padStart(2, '0');
        var stryear = String(strtoday.getFullYear() + 1);

        setcookie("SC_COOKIE_GA", "true", stryear, strmonth, strday);
        setcookie("SC_COOKIE_SI", "true", stryear, strmonth, strday);
        setcookie("SC_COOKIE_ESSENTIAL", "true", stryear, strmonth, strday);
        setcookie("SC_COOKIE_CHECK", "true", stryear, strmonth, strday);

        if(updatebuttons == true) {
            setBoxes(strcookies);
        }

        hideNag('cw');

    }

    //sets all cookies to false when the user hits the reject all button
    function setcookierejectall()
    {
        
        var strday = String(strtoday.getDate());
        var strmonth = String(strtoday.getMonth());
        var stryear = String(strtoday.getFullYear() - 1);

        setcookie("SC_COOKIE_GA", "false", stryear, strmonth, strday);
        setcookie("SC_COOKIE_SI", "false", stryear, strmonth, strday);
        setcookie("SC_COOKIE_ESSENTIAL", "false", stryear, strmonth, strday);

        stryear = String(strtoday.getFullYear() + 1);        
        setcookie("SC_COOKIE_CHECK", "true", stryear, strmonth, strday);
        setBoxes(strcookies);

        hideNag('cw');

    }

    
    //test for existence and state of individual cookie 
    function ping(cookiename) {
        var iscookieset = document.cookie.split(';').filter((item) => item.includes(cookiename));
        
        if (iscookieset.toString().includes("true")) {
            return true;
        }
        else {
            return false;
        }
    }
        
    // checks to see if the user has previously hidden the nag to work out whether to display it or not
    function cookiecheck() {
            // if cookies are present hide the prompt
            if ((ping("SC_COOKIE_CHECK") === true)) {
                return true;
            }
            else {
                return false;
            }
    }

    function buttonOn(buttonname) {
        var button = document.getElementById(buttonname);
 
        button.classList.add("primary");
        button.classList.remove("secondary");
        button.classList.remove("buttonoff");
        button.innerHTML = "On";
    }

    function buttonOff(buttonname) {
        var button = document.getElementById(buttonname);
 
        button.classList.add("secondary");
        button.classList.add("buttonoff");
        button.classList.remove("primary");
        button.innerHTML = "Off";  
    }

    //toggles button states
    function togglebutton(buttonname, cookiestate) {

        if (cookiestate === true) {         
            buttonOff(buttonname);
        }
        else {
            buttonOn(buttonname);
        }
    }

    //sets global cookie variables based on cookiestate at pageload
    function setvars() {

        if (ping("SC_COOKIE_GA") === true) {
            gacookies = true;
        }
        if (ping("SC_COOKIE_SI") === true) {
            sicookies = true;
        }
        if (ping("SC_COOKIE_ESSENTIAL") === true) {
            essentialcookies = true;
        }
    }

    function setBoxes(cookies){
        
        cookies.forEach(checkboxes);

        function checkboxes(item, index) {
            var cookiename = item;
            
            if(document.getElementById(cookiename) != undefined){
                if (ping(cookiename) === true) {
                    buttonOn(cookiename);
                }
                else {
                    buttonOff(cookiename);
                }
            }

        }
    }

    function buttonclick(cookie) {
        var strday = String(strtoday.getDate()).padStart(2, '0');
        var strmonth = String(strtoday.getMonth()).padStart(2, '0');

        var cookiestate = ping(cookie);
        if (cookiestate === true) {
            var stryear = String(strtoday.getFullYear() - 1);
            togglebutton(cookie, true);
            setcookie(cookie, "true");
        }
        else {
            var stryear = String(strtoday.getFullYear() + 1);
            togglebutton(cookie, false);
            setcookie(cookie, "true", stryear, strmonth, strday);
            setcookie("SC_COOKIE_CHECK", "true", stryear, strmonth, strday);
        }

        setcookie(cookie, "true", stryear, strmonth, strday);
    }

    // Generic function for hiding the nag
    function hideNag(el) {   
        var elementToHide = document.getElementById(el);
        elementToHide.style.display = "none";
    }

    function showNag(el) {   
        var elementToHide = document.getElementById(el);
        elementToHide.style.display = "block";
    }

    $(document).ready (function() {

            if (cookiecheck() != true) {
                showNag('cw') };

            // Sets essential cookies to true by default for the current session
            if ((ping("SC_COOKIE_CHECK")) && (ping("SC_COOKIE_ESSENTIAL") === false)) {
                setcookie("SC_COOKIE_ESSENTIAL", true);
            };

            setvars(strcookies);
        }
    )
