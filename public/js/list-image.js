showLoading();
var pageIndex = 0;
var totalPages = 10;
var calling = false;
handle = 0; // I just do this so I know I've cleared the interval
$(document).ready(function() {
  // setInterval(function () {console.log("hihih");}, 1000);

handle =  setInterval(getImagePagaintion, 2000);
});


const getImagePagaintion =  function getListImage(){
   pageIndex++;
  if(pageIndex == 0){
    pageIndex = 1;
  }
  calling = false;
  if(pageIndex == 1){
    showLoading();
  }
  if(pageIndex > totalPages) {
    clearInterval(handle);
    return;
  };
  
  axios.get(API_GET_LIST_IMAGE + "?page=" + pageIndex, {withCredentials: true})
    .then(function (response) {
    if(response.status === 200){
     if(response.data.keywords.length > 0){
      totalPages = calTotalPage(response.data.count);
      renderImage(response.data.keywords);
      }
       }
    })
    .catch(function (error) {
      clearInterval(handle);
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

function renderImage(listImage) {
  $.each(listImage, function (index, item) {
  let itemImage = ` 
  <a class="lightboxgallery-gallery-item" target="_blank" href="${item.content}" data-title=" "  data-desc="${item.titlePage} | ${formatISODate(item.createdAt, true)}">
  <div>
    <img class="lazy" data-src="${item.content}" title="${item.content}">
    <div class="lightboxgallery-gallery-item-content">
      <span class="lightboxgallery-gallery-item-title">
          <div class="favicon-image">
              <img class="lazy" data-src="${item.favicon}" alt="${item.hostName}">
          </div>
          <div class="multi-btn-image">
          <i class="ion ion-md-eye btn-detail"></i> 
          <i class="fas fa-angle-double-down btn-download"></i>
          <i class= "mdi mdi-trash-can"></i>
      </div>
  </span>
    </div>
  </div>
</a>`
$("#list-grid-images").append(itemImage);
loadLazy();
  })

}



function formatISODate(date,IsTime) {

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
  if(IsTime){
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

jQuery(function($) {
  $(document).on('click', '.btn-detail', function(event) {
    event.preventDefault();

    $(this).closest(".lightboxgallery-gallery-item").lightboxgallery({
      showCounter: true,
      showTitle: true,
      showDescription: true
    });
  });
  $(document).on('click', '.lightboxgallery-gallery-item', function(event) {
    event.preventDefault();
  });

  $(document).on('click', '.btn-download', function(event) {
     let href =  $(this).closest(".lightboxgallery-gallery-item").attr("href");
    // console.log(href);
    downloadImage(href);
  });

});


async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)
  const link = document.createElement('a')
  link.href = imageURL
  link.download = imageSrc.split('/').pop();
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

