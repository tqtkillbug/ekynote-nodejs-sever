// const DOMAIN = "https://ekynote-staging.herokuapp.com";
const DOMAIN = "http://localhost:8000";
const PAGE_SIZE_NOTE = 10;

const API_LOGIN = DOMAIN+ "/api/auth/login"
const API_REGISTER = DOMAIN + "/api/auth/register"
const API_REFRESH_TOKEN = DOMAIN + "/api/auth/refreshToken"
const API_GET_LIST_KEYWORD = DOMAIN + "/api/keyword/keywords"
const API_UPDATE_KEYWORD = DOMAIN + "/api/keyword"
const API_GET_LIST_IMAGE = DOMAIN + "/api/keyword/images"
const API_GET_COUNT = DOMAIN + "/api/keyword/count"


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
    <div class="loader_title">TQT</div>
  </div>`)
  $("#snipper").fadeIn(350);
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

  function loadLazy(){
    $('.lazy').Lazy();
}

  function showToast(type,message){
    switch(type) {
      case 1:
        iziToast.show({
          theme: 'dark',
          displayMode: 'replace',
          icon: 'fa fa-exclamation',
          message: message,
          progressBarColor: 'rgb(0, 255, 184)',
        });
        break;
      case 2:
        iziToast.success({
          icon:"fa fa-check",
          displayMode: 'replace',
          message: message,
        });
        break;
        case 3:
          iziToast.error({
          icon:"fa fa-exclamation-triangle",
          displayMode: 'replace',
          message:message,
        });
        break;
          case 4:
            iziToast.warning({
                 icon:"mdi mdi-exclamation",
                 displayMode: 'replace',
                 message:message,
              });
        break;
        case 5:
          iziToast.warning({
            timeout: 5000,
            displayMode: 'replace',
            zindex: 999,
            message: 'Unauthenticated Account Please Login!',
            position: 'bottomRight',
            buttons: [
                ['<button><b>Login</b></button>', function (instance, toast) {
                  window.location.href = "/login"
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
            ]
        });
        break;
    }
   
    
  
  }



  