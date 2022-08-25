
 VirtualSelect.init ({ 
  ele: '#select-typeKeyWord', 
  multiple: true,
  search: false
});

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
      "startDate": "08/25/2022",
      "endDate": "08/27/2022",
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
  getListNote(pageIndex, false);
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
    console.log(data);
    if(data.isFavorite == 1){
      $(this).addClass("favorite-fill");
    } else if(data.isFavorite == 0){
      $(this).removeClass("favorite-fill");
    }
   });    
});

$(document).on("click", ".btn-delete-keyword", function() {
  const idNote =   $(this).closest(".tr-note-data").attr("note-id");
  showComfirm(()=>{
    deleteKeyword(idNote, ()=>{
      $(this).closest(".tr-note-data").remove();
    });
  });
})

$(document).on("click", ".search-list-btn", function (){
  isSearch = true;
  getListNote(1);
})

   

function copyToClipboard(text) {
  var sampleTextarea = document.createElement("textarea");
  document.body.appendChild(sampleTextarea);
  sampleTextarea.value = text; //save main text in it
  sampleTextarea.select(); //select textarea contenrs
  document.execCommand("copy");
  document.body.removeChild(sampleTextarea);
}


function getListNote(page){
  var param = "";
  if(page == 0){
    page = 1;
  }
  if(checkScrollAtBottom() && page > 1 && calling == false){
    return;
  }
  calling = false;
  if(page == 1){
    showLoading();
  }
  if(page > totalPages) return;
  param = "?page="+ page;
  pageCurr = page;
  if(isSearch){
    param =  initParamGetListKeyword(param);
  }
  console.log(param);
  axios.get(API_GET_LIST_KEYWORD + param, {withCredentials: true})
    .then(function (response) {
    if(response.status === 200){
     if(response.data.keywords.length > 0){
      totalPages = calTotalPage(response.data.count);
      renderListNote(response.data.keywords, isSearch);
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
    getListNote(++pageIndex);
}
});

var lastTimeInList = "";
function renderListNote(listNote) {
  if(isSearch && pageCurr == 1){
    $("#table-list-note").html("");
  } 
  $.each(listNote, function (index, keyword) {
    let item = ``;
    let favicon = keyword.favicon == undefined ? "https://res.cloudinary.com/tqt-group/image/upload/v1659630147/noimage_h3wlg6.png" : keyword.favicon;
    let tag = keyword.type == "1" ? "keyword-tag" : keyword.type == "2" ?  "code-tag" : "";

    if(index == listNote.length -1){
      lastTimeInList = keyword.createdAt;
    }
    if(index == 0 ){
      if(lastTimeInList !== ''){
        if(formatISODate(keyword.createdAt) !== lastTimeInList){
          item += ` <tr ><td colspan="5" class="date-tr" >${formatISODate(keyword.createdAt)}</td> </tr>`
        }
      } else {
        if(formatISODate(keyword.createdAt) === formatISODate(new Date().toISOString())){
          item += ` <tr ><td colspan="5" class="date-tr" >Today ${formatISODate(keyword.createdAt)}</td> </tr>`
        } else{
        item += ` <tr ><td colspan="5" class="date-tr" >${formatISODate(keyword.createdAt)}</td> </tr>`
      }
      } 
    }
    item += `
<tr class="tr-note-data" note-id="${keyword._id}">
<td class="content-note exploder ${tag}" >${keyword.content}</td>
<td class="col-sm-1 ">
  <img class="favicon-page" src="${favicon}" alt="">
   <span>${keyword.hostName}</span>
</td>
<td class="title-page" data-toggle="tooltip" title="${keyword.titlePage}">${keyword.titlePage}</td>
<td class="col-sm-1 date-time-note">${formatISODate(keyword.createdAt)}</td>
<td class="col-sm-2 ">
<div class="group-at-btn">
  <a href="javascript:void(0)" class="ion ion-ios-add-circle-outline btn-outline-primary btn"></a>
  <a href="javascript:void(0)" class="ion ion-md-star-outline btn-outline-primary btn btn-favorite  ${checkFavorite(keyword.isFavorite)}"></a>
  <a href="javascript:void(0)" class="ion ion-ios-share-alt btn-outline-primary btn"></a>
  <a href="javascript:void(0)" class="ion ion-md-trash btn-outline-danger btn  btn-delete-keyword"></a>
</div>
</td>
</tr>
<tr class="extendTab hide">
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
     if(index < listNote.length - 1){
       if(formatISODate(keyword.createdAt) !== formatISODate(listNote[index + 1].createdAt)){
        item += ` <tr ><td colspan="5" class="date-tr">${formatISODate(listNote[index + 1].createdAt)}</td>
         </tr>`
       };
     }
    
  $("#table-list-note").append(item);
   $('[data-toggle="tooltip"]').tooltip();   
 
  });
}


function formatISODate(date) {
  var date = new Date(date);
  var dateFormat =   date.toISOString().substring(0, 10);
   return dateFormat.split("-").reverse().join("-"); 1
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

function initParamGetListKeyword(param){
 var listValTypeKeyWord =  getValuesSelec("select-typeKeyWord");
 var textSearch =  $("#keywordSeach").val();
  if(listValTypeKeyWord.length !== 0){
    param += "&type=" + listValTypeKeyWord;
  }
  if(startDate !== undefined && endDate !== undefined){
   param += "&startDate=" + startDate + "&endDate=" + endDate;
  }
  if(textSearch !== undefined && textSearch !== ""){
    param += "&textSearch=" + textSearch;
  }
  return param;
}