
//  VirtualSelect.init ({ 
//   ele: '#select-typeKeyWord', 
//   multiple: true,
//   selectedValue: [1,2,3],
//   search: false
// });

VirtualSelect.init({
  ele: '#select-typeKeyWord', 
  options: [
    { label: 'Keyword', value: '1',alias: 'typeKeyword' },
    { label: 'Code', value: '2',alias: 'typeKeyword'},
    { label: 'Favorite', value: '3',alias: 'typeKeyword'},
  ],
  multiple: true,
  selectedValue: [1,2],
  labelRenderer: renderLabelType,
  search: false,
  disableSelectAll: true
});

VirtualSelect.init({
  ele: '#select-typeGroup', 
  options: [
    {label: 'Date group', value: '1',alias: 'typeGroup'},
    {label: 'Web name group', value: '2',alias: 'typeGroup'},
  ],
  multiple: false,
  selectedValue: [1],
  labelRenderer: renderLabelType,

});

function renderLabelType(data) {
  let prefix = '';

  if (!data.isCurrentNew && !data.isNew) {
    if (data.alias == 'typekeyword') {
      if(data.value == "1" ){
        prefix = `<img class="icon-select" src="\\images\\icons\\keyword-icon-select.png" >`
      } else
      if(data.value == "2" ){
        prefix = `<img class="icon-select" src="\\images\\icons\\code-icon-select.png" >`
      } else
      if(data.value == "3" ){
        prefix = `<img class="icon-select" src="\\images\\icons\\star-icon-select.png" >`
      }
    } else if (data.alias == "typegroup") {
      if(data.value == "1"){
        prefix = `<img class="icon-select" src="\\images\\icons\\icons8-date-65.png" >`
      }
      if(data.value == "2"){
        prefix = `<img class="icon-select" src="\\images\\icons\\icons8-web-48.png" >`
      }
    }
   
   
  } else {
    /** common image/icon could be added for new options */
  }

  return `${prefix}${data.label}`;
}


var pageIndex = 1;
var totalPages = 10;
var calling = false;
var pageCurr = 1;
var isSearch = false;

var startDate;
var endDate;

$(document).ready(()=>{
  $('[data-toggle="tooltip"]').tooltip();   
  $(function() {
    $('#dateRangePicker').daterangepicker({
      "minYear": 2022,
      "maxYear": 2099,
      "startDate": new Date(),
      "endDate": new Date(),
      "cancelClass": "btn-secondary"
    }, function(start, end, label) {
    // console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
  });
  

  $('#dateRangePicker').on('apply.daterangepicker', function(ev, picker) {
    startDate = picker.startDate.format('YYYY-MM-DD');
    endDate = picker.endDate.format('YYYY-MM-DD');
  });
})





$(document).ready(function() {
  getListNote(pageIndex, true);
});


$(document).on('click', '.exploder', function() {
    $(this).closest("tr").next("tr").toggleClass("hide");
    if($(this).closest("tr").next("tr").hasClass("hide")){
      $(this).closest("tr").next("tr").children("td").slideUp();
    }
    else{
      $(this).closest("tr").next("tr").children("td").slideDown();
    }
  });

var oldContent;
$(document).on('click', '.btn-edit-note', function() {
  let textarea =   $(this).closest(".text-wrap").find("textarea")
  textarea.prop('disabled', false);
  textarea.css("border","1px solid #7ed957");
  textarea.focus();
  let val = textarea.val();
  oldContent = val.trim(); 
  textarea.val(""); 
  textarea.val(val); 
   $(this).removeClass("ion-md-create");
   $(this).removeClass("btn-edit-note");
   $(this).addClass("ion-md-checkmark");
  //  console.log(oldContent);
});

$(document).on("focus","textarea", function(){
  oldContent = $(this).val();
});
$(document).on("blur","textarea", function(ev){
  ev.preventDefault();
});

$(document).on('click', '.btn-search-google', function() {
  let textarea =   $(this).closest(".text-wrap").find("textarea")
   toGoogleSeach(textarea.val());
});


$(document).on('click', '.ion-md-checkmark', function() {
  let textarea =   $(this).closest(".text-wrap").find("textarea");
  const newContent = textarea.val().trim()
  if(newContent == oldContent){
     showToast(1,"Content Not Change!");
  } else if(newContent.trim() == "" || newContent == undefined || newContent == null){
    showToast(1,"Content Can't Empty");
    textarea.val(oldContent);
    return;
  } else{
    const noteId = $(this).parents('tr').prev("tr").attr("note-id");
     updateContent(noteId,newContent,(res)=>{
      if(res.status === 200){
        textarea.val(res.data.content);
        $(this).parents('tr').prev("tr").find(".content-note").text(res.data.content);
      }
     }); 
  }
  textarea.prop('disabled', true);
  textarea.css("border","none");
   $(this).removeClass("ion-md-checkmark");
   $(this).addClass("ion-md-create");
   $(this).addClass("btn-edit-note");
});

$(document).on('click', '.btn-copy-note', function() {
  var textarea =   $(this).closest(".text-wrap").find("textarea");
  copyToClipboard(textarea.val())
  showToast(2,"Copied to clipboard!");
});

$(document).on('keypress','.text-content-full',function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
    console.log(event.target);
  }
});

$(document).on('click', '.btn-favorite', function() {
  const idNote =   $(this).closest(".tr-note-data").attr("note-id");
   favoriteKeyword(idNote,(data)=>{
    if(data.isFavorite == 1){
      $(this).addClass("favorite-fill");
    } else if(data.isFavorite == 0){
      $(this).removeClass("favorite-fill");
    }
   });    
});

$(document).on("click", ".btn-delete-keyword", function() {
  const idNote =   $(this).closest(".tr-note-data").attr("note-id");
  showComfirm('Are you sure delete that keyword?',()=>{
    deleteKeyword(idNote, ()=>{
      $(this).closest(".tr-note-data").remove();
      $('tr[extend-tab-id="'+idNote+'"]').remove();
    });
  });
})

$(document).on("click", ".search-list-btn", function (){
  isSearch = true;
  pageIndex = 1;
  getListNote(1,false);
})

$(document).on("click", ".btn-to-page" , function () {
 var urlPage =  $(this).attr('pageUrl');
 var content =  $(this).closest(".tr-note-data").find('.content-note').text().trim();
 if (urlPage == "" || urlPage == null || content == null || content == "") {
    showToast(4,"To This Page Faild!"); 
 } else {
  var contentFormat = content.replace(/ /g, '%20');
  var newUrl =  setParamUrl('ekytext', contentFormat, urlPage);
  window.open(
    newUrl, "_blank");
 }
})

   



function getListNote(page,isFirst){
  var param = "";
  if(page == 0){
    page = 1;
  }
  if(checkScrollAtBottom() && page > 1 && calling == false){
    return;
  }
  if(page == 1){
    showLoading();
  }
  if(page > totalPages) return;
  param = "?page="+ page;
  pageCurr = page;
  if(isSearch){
    param =  initParamGetListKeyword(param, isFirst);
  }
  calling = false;
  axios.get(API_GET_LIST_KEYWORD + param, {withCredentials: true})
    .then(function (response) {
    if(response.status === 200){
     if(response.data.keywords.length > 0){
      $("#totalNote").html(response.data.count);
      totalPages = calTotalPage(response.data.count);
      pageIndex++;
      if(response.data.groupType.createdAt){
        renderListNote(response.data.keywords, 'groupDate');
      } else if(response.data.groupType.hostName){
        renderListNote(response.data.keywords,'groupWeb');
      }
      }
       }
    })
    .catch(function (error) {
      if(error.response.status == 403) {
        showToast(5,null);
      } else if(error.response.status == 500) {
        showToast(4,"Load List Note Faild, Try Again!!");
      }
    })
    .then(() => {
      calling = true;
      hideLoading();
    });
}

$('#tb-scroll').on('scroll', function() {

if(checkScrollAtBottom() && calling == true){
    getListNote(pageIndex,false);
} else if(checkScrollAtBottom()) {
  $(".tr-place-holder").remove();
}
});

var lastTimeInList = "";
var lastHostName = "";
function renderListNote(listNote,typeGroup) {
  $(".tr-place-holder").remove();
  if(isSearch && pageCurr == 1){
    $("#table-list-note").html("");
  } 

  $.each(listNote, function (index, keyword) {
    let item = ``;
    let favicon = keyword.favicon == undefined ? "https://res.cloudinary.com/tqt-group/image/upload/v1659630147/noimage_h3wlg6.png" : keyword.favicon;
    let tag = keyword.type == "1" ? "keyword-tag" : keyword.type == "2" ?  "code-tag" : "";
    if ( keyword.type == "2") {
       keyword.content = keyword.content.replace(/&/g, "&amp;");
       keyword.content = keyword.content.replace(/</g, "&lt;");
       keyword.content = keyword.content.replace(/>/g, "&gt;");
    }
    if(index == listNote.length -1){
      lastTimeInList = keyword.createdAt;
    }
    if(typeGroup == "groupDate"){
      if(index == 0 ){
        if(lastTimeInList !== ''){
          if(formatISODate(keyword.createdAt) !== lastTimeInList){
            item += ` <tr ><td colspan="5" class="date-tr" >${formatISODate(keyword.createdAt, false)}</td> </tr>`
          }
        } else {
          if(formatISODate(keyword.createdAt) === formatISODate(new Date().toISOString())){
            item += ` <tr ><td colspan="5" class="date-tr" >Today ${formatISODate(keyword.createdAt, false)}</td> </tr>`
          } else{
          item += ` <tr ><td colspan="5" class="date-tr" >${formatISODate(keyword.createdAt, false)}</td> </tr>`
        }
        } 
      }
    } else if (typeGroup == "groupWeb") {
      if(index == 0 ){
        if (lastHostName !== keyword.hostName) {
          item += ` <tr ><td colspan="5" class="date-tr" >${keyword.hostName}</td> </tr>`
        }
      }
    } 
    
    item += `
<tr class="tr-note-data" note-id="${keyword._id}">
<td class="content-note exploder ${tag}" >${keyword.content}</textarea>
<td class="col-sm-1 ">
  <img class="favicon-page" src="${favicon}" alt="">
   <span>${keyword.hostName}</span>
</td>
<td class="title-page" data-toggle="tooltip" title="${keyword.titlePage}">${keyword.titlePage}</td>
<td class="col-sm-1 date-time-note">${formatISODate(keyword.createdAt,true)}</td>
<td class="col-sm-2 ">
<div class="group-at-btn">
  <a href="javascript:void(0)" class="ion ion-md-add-circle "></a>
  <a href="javascript:void(0)" class="ion ion-ios-star btn-favorite ${checkFavorite(keyword.isFavorite)}"></a>
  <a href="javascript:void(0)"   pageUrl="${keyword.url}" class="ion ion-ios-share-alt btn-to-page"></a>
  <a href="javascript:void(0)" class="ion ion-md-trash  btn-delete-keyword"></a>
</div>
</td>
</tr>
<tr class="extendTab hide" extend-tab-id="${keyword._id}">
<td colspan="2" style="background-color: #3A6378; display: none;">
  <div class="text-wrap">
  
    <textarea class="text-content-full"  spellcheck="false" disabled>${keyword.content}</textarea>
    <div class="list-btn-action">
      <a href="javascript:void(0)" class="ion ion-md-create btn-outline-primary btn btn-edit-note"></a>
      <a href="javascript:void(0)" class="ion ion-md-copy btn-outline-primary btn btn-copy-note"></a>
      <a href="javascript:void(0)" class="ion ion-logo-google btn-outline-primary btn btn-search-google"></a>
      </div>
    </div>
</td>
</tr>
     `;
     if (typeGroup == 'groupDate') {
      if(index < listNote.length - 1){
        if(formatISODate(keyword.createdAt) !== formatISODate(listNote[index + 1].createdAt, false)){
         item += ` <tr ><td colspan="5" class="date-tr">${formatISODate(listNote[index + 1].createdAt, false)}</td>
          </tr>`
        };
      }
     } else if (typeGroup = 'groupWeb') {
      if(index < listNote.length - 1){
        if(keyword.hostName !== listNote[index + 1].hostName){
         item += ` <tr ><td colspan="5" class="date-tr">${listNote[index + 1].hostName}</td></tr>`
        };
      }
     }
     lastHostName = keyword.hostName;
    
  $("#table-list-note").append(item);
   $('[data-toggle="tooltip"]').tooltip();   
 
  });
  if(pageCurr < totalPages) {
    appendPlaceHolder();
  } else {
    $(".tr-place-holder").remove();
  };

}


function formatISODate(date,isInNote) {
  var date = new Date(date);
  var dateFormat =  date.toISOString().substring(0, 10);
  var hours = date.getHours();
  var minute = date.getMinutes();
  if(hours < 10){
    hours = "0"+ hours 
  }
  if(minute < 10){
    minute = "0"+ minute 
  }
  if(isInNote){
    return dateFormat.split(":").reverse().join(":") + "-" + hours + ":" + minute; 
  } else {
    return dateFormat.split("-").reverse().join("-");

  }
}

function calTotalPage(totalRecord){
  let totalPage = Math.floor(totalRecord / PAGE_SIZE_NOTE);
   if(totalRecord % PAGE_SIZE_NOTE == 0){
    return totalPage;
   } 
   return totalPage+1;
}

function checkScrollAtBottom() {
  if($('#tb-scroll').scrollTop() + $('#tb-scroll').outerHeight() + 1 >  $('#tb-scroll').prop("scrollHeight")){
   return true;
  }
  return false 
}

function checkFavorite(check){
  if(check == 0){
    return "";
  } else if(check == 1) {
    return "favorite-fill";
  }
}

function updateContent(id,newContent,callBack) {
  showLoading();
  axios.put(API_UPDATE_KEYWORD, {id: id, newContent: newContent}, {withCredentials: true})
    .then(function (response) {
      callBack(response);
      showToast(2,"Update Content Success!");
    })
    .catch(function (error) {
      showToast(1,"Account not found, please try again or register");
    })
    .then(() => {
      hideLoading();
    });
}


//   $(document).on('mouseenter', '.tr-note-data', function () {
//     $(this).find(".col-sm-2").find(".group-at-btn").css("display", "block");
//   });

//   $(document).on('mouseout', '.tr-note-data', function () {
//     $(this).find(".col-sm-2").find(".group-at-btn").css("display", "none");
//  });

function toGoogleSeach(query){
    url ='http://www.google.com/search?q=' + query;
    window.open(url,'_blank');
}


function favoriteKeyword(id, callBack){
  showLoading();
  axios.post(API_FAVORITE, {noteId: id}, {withCredentials: true})
          .then(function (response) {
            if(response.status == 200){
              callBack(response.data);
            }
          })
          .catch(function (error) {
            showToast(4,"Favorite Note Faild, Try Again!!");
          })
          .then(() => {
            hideLoading();
          });
}

function deleteKeyword(id,callSuccess){
  showLoading();
  axios.delete(API_DELETE_KEYWORD+ "?id=" + id, {withCredentials: true})
          .then(function (response) {
            if(response.status == 200){
             if(response.data == "success"){
              callSuccess();
              showToast(2,"Delete Note Success!");
             } else{
             showToast(4,"Delete Note Faild, Try Again!!");
             }
            }
          })
          .catch(function (error) {
            showToast(4,"Delete Note Faild, Try Again!!");
          })
          .then(() => {
            hideLoading();
          });
}

function initParamGetListKeyword(param, isFirst){
 var listValTypeKeyWord =  getValuesSelec("select-typeKeyWord");
 var typeGroup =  $("#select-typeGroup").val();
 var textSearch =  $("#keywordSeach").val();
  if(listValTypeKeyWord.length !== 0){
    param += "&type=" + listValTypeKeyWord;
  }
  if (isFirst) {
     param += "&type=1,2"
  }
  if(startDate !== undefined && endDate !== undefined){
   param += "&startDate=" + startDate + "&endDate=" + endDate;
  }
  if(textSearch !== undefined && textSearch !== ""){
    param += "&textSearch=" + textSearch;
  }
  if (typeGroup) {
    param += "&typeGroup=" + typeGroup;
  }
  return param;
}

function appendPlaceHolder() {
  $("#table-list-note").append(` <tr class="tr-place-holder" >
  <td colspan="5">
      <div class="ph-item">
          <div>
            <div class="ph-row">
              <div class="ph-col-12 "></div>
              <div class="ph-col-8"></div>
              <div class="ph-col-10 "></div>
            </div>
          </div>
      </div>
  </td>
</tr>`)
}