
initScript();




// const DOMAIN = "https://ekynote-staging.herokuapp.com";
const DOMAIN = "";
const PAGE_SIZE_NOTE = 10;

const API_LOGIN = DOMAIN+ "/api/auth/login"
const API_REGISTER = DOMAIN + "/api/auth/register"
const API_REFRESH_TOKEN = DOMAIN + "/api/auth/refreshToken"
const API_GET_LIST_KEYWORD = DOMAIN + "/api/keyword/keywords"
const API_UPDATE_KEYWORD = DOMAIN + "/api/keyword"
const API_GET_LIST_IMAGE = DOMAIN + "/api/keyword/images"
const API_GET_COUNT = DOMAIN + "/api/keyword/count"
const API_FAVORITE = DOMAIN + "/api/keyword/favorite"
const API_DELETE_KEYWORD = DOMAIN + "/api/keyword"
const API_DELETE_IMAGE = DOMAIN + "/api/keyword/image"
// API Team Space
const API_NEW_SPACE = DOMAIN + "/api/space"
const API_INVITE_MEMBER = DOMAIN + "/api/space/invite_mem"
const API_ADD_MEMBER = DOMAIN + "/api/space/add_mem"
const API_OUT_SPACE = DOMAIN + "/api/space/out_space"




function initScript() {
  fillMenuSpace();
  $('[data-toggle="tooltip"]').tooltip()
}


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
    timeout: 3500, // default timeout
    resetOnHover: true,
    title: "Eta: ",
    // icon: '', // icon class
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    position: 'bottomRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
    
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


function showComfirm( message,yesCallBack){
  iziToast.question({
    timeout: 99999999999999,
    close: false,
    overlay: true,
    displayMode: 'once',
    id: 'question',
    zindex: 999,
    progressBar : false,
    title: 'Comfirm',
    message: message,
    position: 'center',
    buttons: [
        ['<button><b>YES</b></button>', function (instance, toast) {
            yesCallBack();
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }, true],
        ['<button>NO</button>', function (instance, toast) {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        }],
    ]
   
});
}

function getValuesSelec(idSelect) {
  var selectValue = document.querySelector('#'+ idSelect).getSelectedOptions()
  var listValStr = [];
  for (let i = 0; i < selectValue.length; i++) {
   listValStr.push(selectValue[i].value);
  }

 return listValStr;
}

var checkAddNewSpace = false;

$(document).on("click",".new-space-btn", function () {
  if (!checkAddNewSpace) {
   $(`<li><a href="javascript: void(0); " class="pl-0">
    <input type="text" value="" placeholder="Name space"  class="ip-insert-name-space">
    <p class="btn-save-new-space fas fa-check"></p>
    <p class="menu-icon btn-cancel-new-space mdi mdi-backspace-reverse"></p>
   </a></li>`).insertBefore($(this));
   checkAddNewSpace = true;  
  }
  
       
})


$(document).on("click", ".btn-save-new-space", function(){
  $("ip-insert-name-space").off('blur');
  var nameNewSpace = $(".ip-insert-name-space").val();
  if (nameNewSpace ==  undefined || nameNewSpace == null || nameNewSpace == "") {
    return;
  }
  if (nameNewSpace.length > 25) {
    showToast(3,"Name space characters limit 30!");
    return;
  }
  newTeamSpace(nameNewSpace, (data)=>{
    showToast(2,"Create "+ data.name + " space success!");
    $(this).siblings(".menu-icon").remove();
    $(this).siblings("input").removeClass("ip-insert-name-space").addClass("ip-team-space");
    $(this).closest("a").attr("href", "/space/"+ data._id);
    $(this).remove();
    checkAddNewSpace = false;
  })
})


$(document).on("click", ".btn-cancel-new-space", function(){
  $(this).closest('li').remove();
  checkAddNewSpace = false;  
})


$(document).on('click', '.noti-item', function (e) {
  e.preventDefault()
  e.stopPropagation();
})


function newTeamSpace(nameSpace,callBack) {
  showLoading();
  axios.post(API_NEW_SPACE, {name: nameSpace}, {withCredentials: true})
          .then(function (response) {
            if(response.status == 200){
              callBack(response.data);
            } else{
              showToast(4,"Create new Space faild, try again!!");
            }
          })
          .catch(function (error) {
            showToast(4,"Create new Space faild, try again!!");
          })
          .then(() => {
            hideLoading();
          });
}

var setParamUrl = function(_k, _v,_u) {
  var url = new URL(_u);
  let arrParams =url.search !== '' ? decodeURIComponent(window.location.search.substr(1)).split('&').map(_v => _v.split('=')) : Array();
  let index = arrParams.findIndex((_v) => _v[0] === _k); 
  index = index !== -1 ? index : arrParams.length;
  _v === null ? arrParams = arrParams.filter((_v, _i) => _i != index) : arrParams[index] = [_k, _v];
  let _search = arrParams.map(_v => _v.join('=')).join('&');

  let newurl =url.protocol + "//" +url.host +url.pathname + (arrParams.length > 0 ? '?' +  _search : ''); 
  return newurl;
};

// Common Utils 
function toGoogleSeach(query){
  url ='http://www.google.com/search?q=' + query;
  window.open(url,'_blank');
}

function copyToClipboard(text) {
  var sampleTextarea = document.createElement("textarea");
  document.body.appendChild(sampleTextarea);
  sampleTextarea.value = text; //save main text in it
  sampleTextarea.select(); //select textarea contenrs
  document.execCommand("copy");
  document.body.removeChild(sampleTextarea);
}

function fillMenuSpace() {
  var pathName = window.location.pathname;
  if (pathName.includes('space/')) {
    $('a[href="'+ pathName+'"]').find('input').css('color', '#7ED957');
  }
  
}

//notification event 

$(document).on('click', '.btn-disagree-space', function (e) {
  var idNotify =  $(this).closest('.noti-item').attr('id-notify');
  var idSpace =  $(this).closest('div').attr('id-space-invite');
  agreeToSpace(idNotify,idSpace, 2,()=>{
    $(this).closest('.noti-item').fadeOut();
  })
})

$(document).on('click', '.btn-agree-space', function (e) {
  var idNotify =  $(this).closest('.noti-item').attr('id-notify');
  var idSpace =  $(this).closest('div').attr('id-space-invite');
   agreeToSpace(idNotify,idSpace, 1, (response)=>{
    $(this).closest('.noti-item').fadeOut();
    showToast(1,response.data);
   })
})


function agreeToSpace(idNoti,idSpace,type,callBack) {
  axios.post(API_ADD_MEMBER, {idNotify: idNoti, idSpace :idSpace, type:type}, {withCredentials: true})
     .then(function (response) {
      callBack(response)
     })
    .catch(function (error) {
      showToast(3,"Execution error");
    })
    .then(() => {
    });
}
