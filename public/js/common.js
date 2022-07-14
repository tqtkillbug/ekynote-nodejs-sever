const API_LOGIN = "/api/auth/login"
const API_REGISTER = "/api/auth/register"
const API_REFRESH_TOKEN = "/api/auth/refreshToken"


class User {
    constructor(id,code,name,email,password,isDelete,admin,keywords) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.email = email;
      this.password = password;
      this.isDelete = isDelete;
      this.admin = admin;
      this.keywords = keywords;
    }
  }

  function showLoading(){
    $("body").append(`<div class="loader__wrap"  id="snipper">
    <div class="loader" aria-hidden="true">
      <div class="loader__sq"></div>
      <div class="loader__sq"></div>
    </div>
  </div>`)
  $("#snipper").fadeIn(300);
  $("#snipper").css("display", "flex");
  }

  function hideLoading(){
    $("#snipper").fadeOut(300);
    $("#snipper").remove();
  }

  iziToast.settings({
    timeout: 3000, // default timeout
    resetOnHover: true,
    title: "Eky: ",
    // icon: '', // icon class
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    position: 'topRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    onOpen: function () {

    },
    onClose: function () {

    }
  });


  function showToast(type,message){
    switch(type) {
      case 1:
        iziToast.show({
          theme: 'dark',
          icon: 'fa fa-exclamation',
          message: message,
          progressBarColor: 'rgb(0, 255, 184)',
        });
        break;
      case 2:
        iziToast.success({
          icon:"fa fa-check",
          message: message,
        });
        break;
        case 3:
          iziToast.error({
          icon:"fa fa-exclamation-triangle",
          message:message,
        });
        break;
          case 2:
        // code block
        break;
        case 2:
        // code block
        break;
    }
   
  
  }
