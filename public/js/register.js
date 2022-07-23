
(function ($) {
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(e){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        e.preventDefault();
        if(check){
            var user = new User;
            user.name = $("#fullName").val();
            user.email = $("#email").val();
            user.password = $("#pass").val();
            doLRegisterUser(user);
        }
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else  if($(input).attr('name') == 'pass') {
            if($(input).val().length < 8 || $(input).val() == "") {
                return false;
            }
        }   else  if( $(input).attr('name') == 're-pass') {
            if($(input).val() !== $("#pass").val()) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    function doLRegisterUser(user){
        showLoading();
        axios.post(API_REGISTER, {name: user.name,email: user.email, password: user.password})
          .then(function (response) {
            if(response.status == 200){
                showToast(2,"Successfully Register, Please Login To Eky Note!");
                window.setTimeout( function(){
                    window.location = "/login";
                }, 2500 );
            }  
          })
          .catch(function (error) {
            if(error.response.status == 300){
                showToast(3,error.response.data);
            } else{
                showToast(1,"Register has error, please try again!");
            }
          })
          .then(() => {
            hideLoading();
          });
    }
    
})(jQuery);