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
            user.email = $("#email").val();
            user.password = $("#pass").val();
            doLoginUser(user);
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

    function doLoginUser(user){
        showLoading();
        axios.post(API_LOGIN, {email: user.email, password: user.password}, {withCredentials: true})
          .then(function (response) {
            appendToken(response.data.accessToken);
            showToast(2,"Successfully login!");
            window.setTimeout( function(){
                window.location = "/";
            }, 2000 );
          })
          .catch(function (error) {
            showToast(1,"Login faild, please try again or register");
          })
          .then(() => {
            hideLoading();
          });
    }

    function appendToken(token){
       $("body").append(`<input type="hidden" id="eta_token_login" value="${token}">`)
    } 
})(jQuery);

