/*
 *              Standard functions
 */


let processRunning = function() {

    // Show Toast
    let tId = newToast(false, '<img src="/svg/admin/warning-triangle-light.svg" width="20" height="20" class="rounded me-2" alt="">Ein anderer Prozess läuft gerade! Probieren Sie es in einigen Sekunden erneut.', '', '', '', 'bg-danger', 'text-light')
    $('#' + tId).toast({ delay: 5000 });
    $('#' + tId).toast('show');
    setTimeout(() => { $('#' + tId).remove(); }, 7000);

}


let sending = false;


let linkToSetting = function(elementID) {

    // Try to get Element
    let e = document.getElementById(elementID);
    if (e == null) return;


    // Get Parent Form
    let pe = e.parentElement;
    let stoppedDueToContentElem = false;

    while (!pe.classList.contains('form')) {

        pe = pe.parentElement;

        if (pe.classList.contains('content')) {

            stoppedDueToContentElem = true;
            break;

        }

    }


    // Start Background Animation
    e.style.outlineColor = "#fff";
    e.style.transition = "ease-in-out 0.7s outline-color";
    e.style.outlineColor = "hsl(45deg 100% 85%)";
    e.style.outlineWidth = "5px";
    e.style.outlineStyle = "solid";
    e.style.outlineOffset = "2px";
    e.style.borderRadius = "4px";

    e.dataset.as = 1;

    let intervalID = setInterval(function() {

        if (e.dataset.as == 0) {

            e.style.outlineColor = "hsl(45deg 100% 85%)";
            e.dataset.as = 1;

        } else {
            e.style.outlineColor = "hsl(45deg 100% 100%)";
            e.dataset.as = 0;
        }

    }, 750)
    
    
    // Automatically stop Background Animation after 3 Seconds
    let timeoutID = setTimeout(function() {

        clearInterval(intervalID);
        e.removeAttribute('data-as');
        e.style.outlineColor = "";
        e.style.transition = "";
        e.style.outlineWidth = "";
        e.style.outlineStyle = "";
        e.style.outlineOffset = "";
        e.style.borderRadius = "";

    }, 3000);


    // Stop Background Animation on Click
    e.addEventListener("click", function() {

        clearTimeout(timeoutID);
        clearInterval(intervalID);
        e.removeAttribute('data-as');
        e.style.outlineColor = "";
        e.style.transition = "";
        e.style.outlineWidth = "";
        e.style.outlineStyle = "";
        e.style.outlineOffset = "";
        e.style.borderRadius = "";

    });


    // Check if Form was found
    if (stoppedDueToContentElem) {

        clearTimeout(timeoutID);
        return;

    }


    // Scroll into View
    const yOffset = -85;
    const y = pe.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});

}







/*
 *              Add Admin Email
 */


const adminAddEmailInputFunc = function() {

    // Get Element
    let input = $('#add-email-address-input');
    let button = $('#add-email-address-submit-button');


    // Create Regex
    let exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    // Value length
    if (input.val().length > 6 && exp.test(input.val())) {
        
        // Button Attrs
        button.removeAttr('disabled');


        // Input Attrs
        input.addClass('is-valid');
        input.removeClass('is-invalid');

    } else if (input.val().length == 0) {

        // Button Attrs
        button.attr('disabled', '');


        // Input Attrs
        input.removeClass('is-valid');
        input.removeClass('is-invalid');

    } else {
        
        // Button Attrs
        button.attr('disabled', '');


        // Input Attrs
        input.removeClass('is-valid');
        input.addClass('is-invalid');

    }
}


$('#add-email-address-input').on('change', adminAddEmailInputFunc);
$('#add-email-address-input').on('input', adminAddEmailInputFunc);


$('#add-email-address-input').on('keydown', (e) => {
    if (e.keyCode == 13) {
        addAddress();
    }
})


let addAddress = function() {

    console.log('add');


    // Prevent double sending
    if (sending == true) return processRunning();


    sending = true;


    // Get Element
    let input = $('#add-email-address-input');
    let button = $('#add-email-address-submit-button');


    // Create Regex
    let exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    
    // Check Value
    if (input.val().length < 7 || !exp.test(input.val())) return;


    // Button Attrs
    button.addClass('active');
    button.css('pointerEvents', 'none');
    $('#add-email-address-submit-button #first').css('display', 'none');
    $('#add-email-address-submit-button #second').css('display', 'inline-block');


    // Input Attrs
    input.attr('readonly', '');


    // Create Value String
    let valString = 'address=' + input.val();


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/add-admin-email-address", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Get Element
        let input = $('#add-email-address-input');
        let button = $('#add-email-address-submit-button');

        
        // Check return
        if (r.responseText == 'added') {
            
            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            button.attr('disabled', '');
            $('#add-email-address-submit-button #first').css('display', 'inline-block');
            $('#add-email-address-submit-button #second').css('display', 'none');


            // Show Toast
            let tId = newToast(true, 'Die Email Adresse wurde hinzugefügt!', '/svg/admin/database-solid.svg', 'Datenbank', 'Vor 1 Sekunde', 'bg-light', 'text-dark')
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 20000);

            
            // Get ID for new Entry
            let id = 0;
            if (typeof document.querySelector('.viewer__item') != "undefined") {
                let lastCurrentItem = $('.viewer__item')[$('.viewer__item').length - 1];
                id = parseInt(lastCurrentItem.getAttribute('id').replace('viewer-item-','')) + 1;
                console.log(1);
            }


            // Add to list
            let newEntry = '<div id="viewer-item-' + id + '" class="viewer__item pt-2 pb-2 d-flex justify-content-between"><h6>' + input.val() + '</h6><button onclick="deleteAddress(\'' + input.val() + '\', ' + id + ')" id="delete-button-' + id + '" class="btn btn-sm" style="box-shadow: none!important; height: 24px; line-height: .7rem;"><span style="font-size: 1.3rem;"><div id="first" style="display: inline-block;">×</div><div id="second" style="display: none"><div class="spinner-border text-primary spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div></div></span></button></div>';
            let current = $('.email-viewer').html();
            $('.email-viewer').html(current + newEntry);


            // Input Attrs
            input.removeAttr('readonly');
            input.removeClass('is-valid');
            input.removeClass('is-invalid');
            input.val('');

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        } else if (r.responseText == 'address') {

            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            button.attr('disabled', '');
            $('#add-email-address-submit-button #first').css('display', 'inline-block');
            $('#add-email-address-submit-button #second').css('display', 'none');


            // Input Attrs
            input.removeAttr('readonly');
            input.removeClass('is-valid');
            input.addClass('is-invalid');


            // Change Feedback
            $('#add-email-address-invalid-feedback').html('Diese Email Adresse existiert nicht!');

        } else if (r.responseText == 'exists') {

            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            button.attr('disabled', '');
            $('#add-email-address-submit-button #first').css('display', 'inline-block');
            $('#add-email-address-submit-button #second').css('display', 'none');


            // Input Attrs
            input.removeAttr('readonly');
            input.removeClass('is-valid');
            input.removeClass('is-invalid');
            input.val('');


            // Show Toast
            let tId = newToast(false, 'Diese Email Adresse existiert bereits!', '', '', '', 'bg-danger', 'text-light')
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 20000);

        }


        sending = false;

    };

    r.send(valString);
}



/*
 *              Delete Admin Email
 */


let deleteAddress = function(address, id) {
    
    // Check Value
    if (address.length < 7) return;


    // Prevent double sending
    if (sending == true) return processRunning();


    sending = true;


    // Check if ID exists
    if (document.querySelector('#delete-button-' + id) == null) return;


    // Button Attrs
    $('#delete-button-' + id).css('pointerEvents', 'none');
    $('#delete-button-' + id + ' #first').css('display', 'none');
    $('#delete-button-' + id + ' #second').css('display', 'inline-block');


    // Create Value String
    let valString = 'address=' + address;


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/delete-admin-email-address", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Check return
        if (r.responseText == 'deleted') {

            // Show Toast
            let tId = newToast(true, 'Die Email Adresse wurde entfernt!', '/svg/admin/database-solid.svg', 'Datenbank', 'Vor 1 Sekunde', 'bg-light', 'text-dark')
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show')
            setTimeout(() => { $('#' + tId).remove(); }, 20000);


            // Remove Elem
            $('#viewer-item-' + id).remove();
            
        } else if (r.responseText == 'address') {

            // Button Attrs
            $('#delete-button-' + id).css('pointerEvents', 'all');


            // Show Toast
            let tId = newToast(false, 'Es gab einen Fehler beim entfernen der Email Adresse!', '', '', '', 'bg-danger', 'text-light')
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 20000);

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        } else if (r.responseText == 'last') {

            // Button Attrs
            $('#delete-button-' + id).css('pointerEvents', 'all');
            $('#delete-button-' + id + ' #first').css('display', 'inline-block');
            $('#delete-button-' + id + ' #second').css('display', 'none');


            // Show Toast
            let tId = newToast(false, 'Es muss mindestens eine Email Adresse vorhanden sein!', '', '', '', 'bg-danger', 'text-light')
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 20000);

        }

        sending = false;
    };

    r.send(valString);

}





/*
 *              Change Email Interval
 */


let currentInterval = ((parseInt($('#change-email-interval-hour-input').val()) * 60 * 60) + (parseInt($('#change-email-interval-minute-input').val()) * 60));


let changeEmailInterval = function() {
    
    // Prevent double sending
    if (sending == true) return processRunning();


    sending = true;


    // Get Elems
    let button = $('#change-email-interval-submit-button');
    let hourElem = $('#change-email-interval-hour-input');
    let minuteElem = $('#change-email-interval-minute-input');


    // Check Values
    let exp = /[^0-9]/;
    if (exp.test(hourElem.val()) || exp.test(minuteElem.val()) || hourElem.val().length < 1 || minuteElem.val().length < 1) {
        
        // Show Toast
        let tId = newToast(false, 'Interner Fehler!', '', '', '', 'bg-danger', 'text-light')
        $('#' + tId).toast({ delay: 15000 });
        $('#' + tId).toast('show')
        setTimeout(() => { $('#' + tId).remove(); }, 20000);
        return sending = false;

    }


    // Calculate Input Time
    let time = ((hourElem.val() * 60 * 60) + (minuteElem.val() * 60));


    // Check if Input Time is same as Current Interval
    if (time == currentInterval) {

        // Show Toast
        let tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Das Email Form Interval wurde geändert!', '', '', '', 'bg-success', 'text-light');
        $('#' + tId).toast({ delay: 15000 });
        $('#' + tId).toast('show');
        setTimeout(() => { $('#' + tId).remove(); }, 20000);
        return sending = false;

    }


    // Button Attrs
    button.css('pointerEvents', 'none');
    button.addClass('active');
    $('#change-email-interval-submit-button #first').css('display', 'none');
    $('#change-email-interval-submit-button #second').css('display', 'inline-block');


    // Input Attrs
    hourElem.attr('readonly', '');
    minuteElem.attr('readonly', '');


    // Create Value String
    let valString = 't=' + time;


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/change-email-form-interval", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Check return
        if (r.responseText == 'changed') {

            // Show Toast
            let tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Das Email Form Interval wurde geändert!', '', '', '', 'bg-success', 'text-light');
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 20000);


            // Reset Current Interval Value
            currentInterval = time;


            // Button Attrs
            button.css('pointerEvents', 'all');
            button.removeClass('active');
            $('#change-email-interval-submit-button #first').css('display', 'inline-block');
            $('#change-email-interval-submit-button #second').css('display', 'none');


            // Input Attrs
            hourElem.removeAttr('readonly', '');
            minuteElem.removeAttr('readonly', '');
            
        } else if (r.responseText == 'value') {

            // Button Attrs
            $('#delete-button-' + id).css('pointerEvents', 'all');


            // Show Toast
            let tId = newToast(false, 'Es gab einen Fehler beim entfernen der Email Adresse!', '', '', '', 'bg-danger', 'text-light')
            $('#' + tId).toast({ delay: 15000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 20000);


            // Button Attrs
            button.css('pointerEvents', 'all');
            button.removeClass('active');
            $('#change-email-interval-submit-button #first').css('display', 'inline-block');
            $('#change-email-interval-submit-button #second').css('display', 'none');


            // Input Attrs
            hourElem.removeAttr('readonly', '');
            minuteElem.removeAttr('readonly', '');


            // Calculate Hours and Minutes
            let h = Math.floor(currentInterval / 60)
            let m = Math.floor(currentInterval % 60)


            // Input Value
            hourElem.val(h);
            minuteElem.val(m);

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        }

        sending = false;
    };

    r.send(valString);

}






/*
 *              Change Email Form Active State
 */


// Checkbox Listener
let changeEmailFormActiveStateFunc = function() {

    // Get Elements
    let box = $('#email-form-active-state-checkbox');
    let spinner = $('#email-form-active-state-loading-spinner');


    // Checkbox Attrs
    box.css('pointerEvents', 'none');


    // Show Spinner
    spinner.css('display', 'inline-block');



    // Get State
    let state = box.is(':checked');


    // Check if State exists
    if (state != true && state != false) return window.location.replace("/admin/?toasts=" + encodeURI('[{header:false,bodyHtml:\'Es ist ein Fehler aufgetreten!\',svg:\'\',from:\'\',time:\'\',bg:\'bg-danger\',text:\'text-light\',delay: 10000,set:\'' + Date.now() + '\'}]'));


    // Create Value String
    let valString = 's=' + state;


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/change-email-form-active-state", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Check return
        if (r.responseText == 'true' || r.responseText == 'false') {

            // Declare Toast Id
            let tId = 0;


            // Show Toast
            if (r.responseText == 'true') {
                tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Das Email Form wurde aktiviert!', '', '', '', 'bg-success', 'text-light');
            } else {
                tId = newToast(false, '<img src="/svg/admin/warning-triangle-dark.svg" width="20" height="20" class="rounded me-2" alt=""> Das Email Form wurde deaktiviert!', '', '', '', 'bg-warning', 'text-dark');
            }
            
            $('#' + tId).toast({ delay: 5000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 8000);


            // Checkbox Attrs
            box.css('pointerEvents', 'all');


            // Hide Spinner
            spinner.css('display', 'none');
            
            
        } else if (r.responseText == 'value') {

            // Reload and show Error
            return window.location.replace("/admin/?toasts=" + encodeURI('[{header:false,bodyHtml:\'Es ist ein Fehler aufgetreten!\',svg:\'\',from:\'\',time:\'\',bg:\'bg-danger\',text:\'text-light\',delay: 10000,set:\'' + Date.now() + '\'}]'));

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        }

        sending = false;
    };

    r.send(valString);

}









/*
 *              Change official Admin Email
 */


let currentOfficialEmailAddress = $('#change-official-email-address-input').val();


const adminChangeOfficialEmailInputFunc = function() {

    // Get Element
    let input = $('#change-official-email-address-input');
    let button = $('#change-official-email-address-submit-button');


    // Create Regex
    let exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    // Value length
    if (input.val().length > 6 && exp.test(input.val())) {
        
        // Button Attrs
        button.removeAttr('disabled');


        // Input Attrs
        input.removeClass('is-invalid');

    } else if (input.val().length == 0) {

        // Button Attrs
        button.attr('disabled', '');


        // Input Attrs
        input.removeClass('is-invalid');

    } else {
        
        // Button Attrs
        button.attr('disabled', '');


        // Input Attrs
        input.addClass('is-invalid');

    }
}


$('#change-official-email-address-input').on('change', adminChangeOfficialEmailInputFunc);
$('#change-official-email-address-input').on('input', adminChangeOfficialEmailInputFunc);


$('#change-official-email-address-input').on('keydown', (e) => {
    if (e.keyCode == 13) {
        changeOfficialAddress();
    }
})


let changeOfficialAddress = function() {

    // Prevent double sending
    if (sending == true) return processRunning();


    sending = true;


    // Get Elements
    let input = $('#change-official-email-address-input');
    let button = $('#change-official-email-address-submit-button');


    // Create Regex
    let exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    
    // Check Value
    if (input.val().length < 7 || !exp.test(input.val())) return;


    // Button Attrs
    button.addClass('active');
    button.css('pointerEvents', 'none');
    $('#change-official-email-address-submit-button #first').css('display', 'none');
    $('#change-official-email-address-submit-button #second').css('display', 'inline-block');


    // Input Attrs
    input.attr('readonly', '');


    // Create Value String
    let valString = 'address=' + input.val();


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/change-official-email-address", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Get Element
        let input = $('#change-official-email-address-input');
        let button = $('#change-official-email-address-submit-button');

        
        // Check return
        if (r.responseText == 'changed') {
            
            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            $('#change-official-email-address-submit-button #first').css('display', 'inline-block');
            $('#change-official-email-address-submit-button #second').css('display', 'none');


            // Show Toast
            let tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Die offizielle Email Adresse wurde geändert!', '', '', '', 'bg-success', 'text-light');
            $('#' + tId).toast({ delay: 10000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 13000);


            // Input Attrs
            input.removeAttr('readonly');
            input.removeClass('is-valid');
            input.removeClass('is-invalid');
            input.attr('placeholder', input.val());

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        } else if (r.responseText == 'address') {

            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            $('#change-official-email-address-submit-button #first').css('display', 'inline-block');
            $('#change-official-email-address-submit-button #second').css('display', 'none');


            // Input Attrs
            input.removeAttr('readonly');
            input.removeClass('is-valid');
            input.addClass('is-invalid');

        }


        sending = false;

    };

    r.send(valString);
}











/*
 *              Show and Hide Official Email Address
 */


// Checkbox Listener
let changeShowOfficialEmailAddressFunc = function() {

    // Get Elements
    let box = $('#show-official-email-address-checkbox');
    let spinner = $('#show-official-email-address-loading-spinner');


    // Checkbox Attrs
    box.css('pointerEvents', 'none');


    // Show Spinner
    spinner.css('display', 'inline-block');



    // Get State
    let state = box.is(':checked');


    // Check if State exists
    if (state != true && state != false) return window.location.replace("/admin/?toasts=" + encodeURI('[{header:false,bodyHtml:\'Es ist ein Fehler aufgetreten!\',svg:\'\',from:\'\',time:\'\',bg:\'bg-danger\',text:\'text-light\',delay: 10000,set:\'' + Date.now() + '\'}]'));


    // Create Value String
    let valString = 's=' + state;


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/change-show-official-email", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Check return
        if (r.responseText == 'true' || r.responseText == 'false') {

            // Declare Toast Id
            let tId = 0;


            // Show Toast
            if (r.responseText == 'true') {
                tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Die offizielle Email Adresse wird wieder angezeigt!', '', '', '', 'bg-success', 'text-light');
            } else {
                tId = newToast(false, '<img src="/svg/admin/warning-triangle-dark.svg" width="20" height="20" class="rounded me-2" alt=""> Die offizielle Email Adresse wird nicht mehr angezeigt!', '', '', '', 'bg-warning', 'text-dark');
            }
            
            $('#' + tId).toast({ delay: 5000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 8000);


            // Checkbox Attrs
            box.css('pointerEvents', 'all');


            // Hide Spinner
            spinner.css('display', 'none');
            
            
        } else if (r.responseText == 'value') {

            // Reload and show Error
            return window.location.replace("/admin/?toasts=" + encodeURI('[{header:false,bodyHtml:\'Es ist ein Fehler aufgetreten!\',svg:\'\',from:\'\',time:\'\',bg:\'bg-danger\',text:\'text-light\',delay: 10000,set:\'' + Date.now() + '\'}]'));

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        }

        sending = false;
    };

    r.send(valString);

}










/*
 *              Change Opening Times
 */

let changeOpeningTimesInputFunc = function(elemId) {

    // Check if ElementID Variable exists
    if (elemId == null) return false;


    // Get Elem
    let elem = $('#' + elemId)


    // Check if Elem is found
    if (typeof elem != 'object') return false;


    // Create Regex
    let exp = /^(([0-9]{1,2}):([0-9]{2})|([0-9]{1,2})) \- (([0-9]{1,2}):([0-9]{2})|([0-9]{2}))$/;


    // Check Value
    if (typeof elem.val() == 'undefined' || !exp.test(elem.val())) {
        elem.addClass('is-invalid');
        return false;
    }


    // Value is valid
    elem.removeClass('is-invalid');
    return true;
}


let changeOpeningTimes = function() {

    // Prevent double sending
    if (sending == true) return processRunning();


    sending = true;


    // Get Elements
    let button = $('#change-opening-times-submit-button');
    let moElem = $('#mo-opening-time-input');
    let diElem = $('#di-opening-time-input');
    let miElem = $('#mi-opening-time-input');
    let doElem = $('#do-opening-time-input');
    let frElem = $('#fr-opening-time-input');
    let saElem = $('#sa-opening-time-input');

    
    // Check Values
    if (!changeOpeningTimesInputFunc('mo-opening-time-input') || !changeOpeningTimesInputFunc('di-opening-time-input') || !changeOpeningTimesInputFunc('mi-opening-time-input') || !changeOpeningTimesInputFunc('do-opening-time-input') || !changeOpeningTimesInputFunc('fr-opening-time-input') || !changeOpeningTimesInputFunc('sa-opening-time-input')) return sedning = false, console.log("Hallo");


    // Button Attrs
    button.addClass('active');
    button.css('pointerEvents', 'none');
    $('#change-opening-times-submit-button #first').css('display', 'none');
    $('#change-opening-times-submit-button #second').css('display', 'inline-block');


    // Input Attrs
    moElem.attr('readonly', '');
    diElem.attr('readonly', '');
    miElem.attr('readonly', '');
    doElem.attr('readonly', '');
    frElem.attr('readonly', '');
    saElem.attr('readonly', '');


    // Create Value String
    let valString = '';
    valString += 'mo=' + moElem.val() + '&di=' + diElem.val() + '&mi=' + miElem.val() + '&do=' + doElem.val() + '&fr=' + frElem.val() + '&sa=' + saElem.val();


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/change-opening-times", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        // Get Element
        let button = $('#change-opening-times-submit-button');
        let moElem = $('#mo-opening-time-input');
        let diElem = $('#di-opening-time-input');
        let miElem = $('#mi-opening-time-input');
        let doElem = $('#do-opening-time-input');
        let frElem = $('#fr-opening-time-input');
        let saElem = $('#sa-opening-time-input');

        
        // Check return
        if (r.responseText == 'changed') {
            
            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            $('#change-opening-times-submit-button #first').css('display', 'inline-block');
            $('#change-opening-times-submit-button #second').css('display', 'none');


            // Show Toast
            let tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Die Öffnungszeiten wurden geändert!', '', '', '', 'bg-success', 'text-light');
            $('#' + tId).toast({ delay: 10000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 13000);


            // Input Attrs
            moElem.removeAttr('readonly');
            diElem.removeAttr('readonly');
            miElem.removeAttr('readonly');
            doElem.removeAttr('readonly');
            frElem.removeAttr('readonly');
            saElem.removeAttr('readonly');

        } else if (r.responseText == 'notloggedin') {

            // Reload Page
            location.reload();

        } else if (r.responseText.split('!')[0] == 'values') {

            // Button Attrs
            button.removeClass('active');
            button.css('pointerEvents', 'all');
            $('#change-opening-times-submit-button #first').css('display', 'inline-block');
            $('#change-opening-times-submit-button #second').css('display', 'none');


            // Input Attrs
            moElem.removeAttr('readonly');
            diElem.removeAttr('readonly');
            miElem.removeAttr('readonly');
            doElem.removeAttr('readonly');
            frElem.removeAttr('readonly');
            saElem.removeAttr('readonly');

            
            // Add Errors to Input
            if (r.responseText.includes('?mo')) moElem.addClass('is-invalid');
            if (r.responseText.includes('?di')) diElem.addClass('is-invalid');
            if (r.responseText.includes('?mi')) miElem.addClass('is-invalid');
            if (r.responseText.includes('?do')) doElem.addClass('is-invalid');
            if (r.responseText.includes('?fr')) frElem.addClass('is-invalid');
            if (r.responseText.includes('?sa')) saElem.addClass('is-invalid');

        }


        sending = false;

    };

    console.log(valString);
    r.send(valString);
}

















/*
 *              Change Opening Times
 */

let changeBootstrapStateRadioChanged = function() {

    // Prevent double sending
    if (sending == true) return processRunning();


    sending = true;


    // Get Value to upload
    let v = document.querySelector('input[name="change-bootstrap-state-radio"]:checked').value;


    // Disable Radios
    document.querySelector("#change-bootstrap-state-radio-online").toggleAttribute("disabled", true);
    document.querySelector("#change-bootstrap-state-radio-offline").toggleAttribute("disabled", true);


    // AJAX
    var r = new XMLHttpRequest();
    r.open("POST", "/admin/change-bootstrap-source", true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;


        console.log(r.responseText);


        if (r.responseText == "value") {
            
            // Reload Site and show Error
            return window.location.replace("/admin/?toasts=" + encodeURI('[{header:false,bodyHtml:\'Es ist ein Fehler aufgetreten! Versuchen Sie es nochmal\',svg:\'\',from:\'\',time:\'\',bg:\'bg-danger\',text:\'text-light\',delay: 10000,set:\'' + Date.now() + '\'}]'));

        } else if (r.responseText == "changed") {

            // Convert 0/1 Value to string
            let sVal;
            if (v == "0") sVal = "online";
            else sVal = "offline";


            // Show Toast
            let tId = newToast(false, '<img style="top: -2px; position: relative;" src="/svg/admin/check-light.svg" width="16" height="16" class="rounded me-2" alt=""> Die Bootstrap Quelle wurde auf <b>' + sVal + '</b> gesetzt!', '', '', '', 'bg-success', 'text-light');
            $('#' + tId).toast({ delay: 10000 });
            $('#' + tId).toast('show');
            setTimeout(() => { $('#' + tId).remove(); }, 13000);


            // Enable Radios
            document.querySelector("#change-bootstrap-state-radio-online").toggleAttribute("disabled", false);
            document.querySelector("#change-bootstrap-state-radio-offline").toggleAttribute("disabled", false);

        }


        sending = false;
    }


    // Send Request
    r.send("v=" + v);
}







async function checkBootstrapTime(request, timeout, outputElem) {
    try {
        const response = await Promise.race([
            fetch(request, { cache: "no-store" }),
            new Promise((_, reject) => setTimeout(
                () => reject(new Error('Timeout')),
                timeout
            ))
        ]);

        if (response.status == 404) {
            return viewerUI(outputElem, "btn-danger", "Datei nicht gefunden");
        }

        viewerUI(outputElem, "btn-success", "Online");
    } catch (e) {
        if (e.message === 'Timeout' || e.message === 'Network request failed' || e.message === 'Failed to fetch') {
            viewerUI(outputElem, "btn-danger", "Offline");
        } else {
            console.log(e); // rethrow other unexpected errors
            console.log(e.message);
            viewerUI(outputElem, "btn-danger", "Es ist ein Fehler beim Test aufgetreten");
        }
    }
}


function viewerUI(elem, colorScheme, text) {
    let e = document.querySelector(elem);
    
    if (!e) return false;

    e.classList.remove("btn-secondary");
    e.classList.remove("btn-danger");
    e.classList.remove("btn-warning");
    e.classList.remove("btn-success");

    e.classList.add(colorScheme);

    e.innerHTML = text;
}






let checkBootstrap = function () {
    viewerUI("#jsdelivr-status #css-view span", "btn-secondary", "Wird getestet...");
    viewerUI("#jsdelivr-status #js-view span", "btn-secondary", "Wird getestet...");

    setTimeout(() => {
        checkBootstrapTime("https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css", 3000, "#jsdelivr-status #css-view span");
        checkBootstrapTime("https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js", 3000, "#jsdelivr-status #js-view span");
    }, 1000);
}







let checkBootstrapIntervalID;

if (window.fetch) {

    // First test
    checkBootstrap();


    // Set Loop to test
    checkBootstrapIntervalID = setInterval(() => {
        checkBootstrap();
    }, 15000);

} else {
    viewerUI("#jsdelivr-status #css-view span", "btn-success", "Der Browser unterstützt dieses Feature nicht");
    viewerUI("#jsdelivr-status #js-view span", "btn-success", "Der Browser unterstützt dieses Feature nicht");
}




let stopBootstrapStatusInterval = function(sender) {
    clearInterval(checkBootstrapIntervalID);
    document.querySelector("#bootstrap-status-interval-deactivated-feedback").style.display = 'block';
    document.querySelector("#stop-bootstrap-status-interval-button").remove();
}