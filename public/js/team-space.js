$('.list-avatar-member').slick({
  slidesToShow: 6,
  slidesToScroll: 6,
  arrows: false
});

$(document).on('click', '.note-content-view', function (e) {
  const isExtend = $(this).attr('isExtend');
 if(checkEditingNote($(this))){
 const contentEdit =  $(this).find('.note-text-view').find('textarea').val();
 $(this).find('.note-text-view').html(contentEdit);
//  $(this).find('.list-btn-action').css('margin-top', '-30px');
 $(this).find('.list-btn-action').find('.ion-md-checkmark').addClass("ion-md-create").addClass("btn-edit-note").removeClass("ion-md-checkmark");
 }
  if (isExtend == 'false') {
    const infoPageEle = $(this).siblings('.info-page');
    var infoPageHtml = infoPageEle.prop('outerHTML');
    infoPageEle.fadeOut(1);
    $(this).css('max-width', '100%').addClass('expand-view');
    $(this).find('.note-text-view').css('white-space', 'normal').addClass('no-after').css('display', 'inline').css('with', '90%');
    $(this).find('.list-btn-action').removeClass('hide');
    $(this).parent().siblings('.temp-card').html(infoPageHtml).fadeIn();
    $(this).parent().siblings('.temp-card').find('.right-box-info').removeClass('right-box-info').addClass('bottom-box-info').fadeIn();
    $(this).attr('isExtend', 'true');
  } else if (isExtend == 'true') {
    const infoPageHtml = $(this).parent().siblings('.temp-card').find('.info-page');
    var infoPageHtmlBt = infoPageHtml.prop('outerHTML');
    $(this).removeClass('expand-view').css('max-width', '50%');
    $(this).find('.note-text-view').css('display', 'block').css('with', '100%');
    $(this).find('.list-btn-action').addClass('hide');
    $(this).find('.note-text-view').css('white-space', 'nowrap').removeClass('no-after');
    $(this).closest('.media').append(infoPageHtml);
    $(this).siblings('.info-page').removeClass('bottom-box-info').addClass('right-box-info');
    $(this).attr('isExtend', 'false');
  }
  
})




$(document).on('click', ".note-content-view .btn-edit-note", function(e){
  e.stopPropagation();
  const content = $(this).parent().siblings('p').text().trim();
  var textareaEdit = `<textarea spellcheck="false">${content}</textarea>`;
  $(this).parent().siblings('p').text('').html(textareaEdit);
  $(this).parent().css('margin-top', '0px');
  $(this).removeClass("ion-md-create");
  $(this).removeClass("btn-edit-note");
  $(this).addClass("ion-md-checkmark");
})

$(document).on('click', ".note-content-view .ion-md-checkmark", function(e){
  e.stopPropagation();
  console.log("hanlder update content");
})


$(document).on('click', ".note-content-view .btn-copy-note", function(e){
  e.stopPropagation();
  const query = $(this).parent().siblings('p').text().trim();
  copyToClipboard(query)
  showToast(2,"Copied to clipboard!");
})

$(document).on('click', ".note-content-view .btn-search-google", function(e){
  e.stopPropagation();
  const query = $(this).parent().siblings('p').text().trim();
  toGoogleSeach(query);
})

$(document).on('click', ".note-content-view textarea", function(e){
  e.stopPropagation();
})

function checkEditingNote(el) {
  if (el.find('.note-text-view').find('textarea').length) return true;
  return false;
}     

$(document).on("click", "#btn-add-member", function(e) {
  openAddMember(e)
})



function openAddMember(e) { 
  iziToast.info({
    backgroundColor : '#9cd883',
    class : 'iziToast-add-mem',
    timeout: false,
    titleColor : '#666666',
    progressBar : false,
    displayMode: 'once',
    icon : 'ion ion-md-add-circle',
    maxWidth:'410',
    title: 'Add Member',
    drag: false,
    target: '.area-tool-bar',
    targetFirst: false,
    inputs: [
        ['<input type="text" id="emailMemberAdd" placeHolder="member@mail.com"> '],
    ], buttons: [
      ['<button><b>Invite</b></button>', function (instance, toast) {
          let email = $('#emailMemberAdd').val();
          const spaceId = $('#spaceId').val();
          checkMemberExist(email,spaceId);
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
      }, true],
    
  ],
});
}
 function checkMemberExist(email, spaceId) {
  axios.post(API_INVITE_MEMBER, {email: email, idSpace :spaceId}, {withCredentials: true})
     .then(function (response) {
      showToast(1,response.data);
     })
    .catch(function (error) {
      showToast(1,"Add Member Error");
    })
    .then(() => {
      hideLoading();
    });
 }