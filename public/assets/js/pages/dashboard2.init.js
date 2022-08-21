showLoading();
$( document ).ready(function() {
   appDashboard.initCount();
//    const socket = io(DOMAIN);
//    socket.on('connect', function() {
//     // const sessionID = socketConnection.socket.sessionid; //
//     var sessionID = socket.io.engine.id;

//     console.log(sessionID);
//   });
});

var appDashboard = {

    initCount : ()=>{
        axios.get(API_GET_COUNT, {withCredentials: true})
        .then(function (response) {
        if(response.status === 200){
         if(response.data){
            appDashboard.renderCount(response.data);
          }
           }
        })
        .catch(function (error) {
          if(error.response.status == 403) {
            showToast(5,null);
          } else {
            showToast(4,"Load Data Of Dashboard Faild, Try Again!!");
          }
        })
        .then(() => {
          hideLoading();
        });
    },
    renderCount: (data)=> {
        let dataCountHtml = `
        <div class="col-md-6 col-xl-3">
                        <div class="card-box">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-md bg-info rounded-circle">
                                        <i class=" mdi mdi-notebook-outline avatar-title font-26 text-white"></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right">
                                        <h3 class="my-0 font-weight-bold"><span data-plugin="counterup" class="counterUp">${data.keywordCount}</span>/200</h3>
                                        <p class="mb-0 mt-1 text-truncate">Total Keyword/Limit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card-box-->
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card-box">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-md bg-warning rounded-circle">
                                        <i class="mdi mdi-code-tags avatar-title font-26 text-white"></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right">
                                        <h3 class="my-0 font-weight-bold"><span data-plugin="counterup" class="counterUp">${data.codeCount}</span>/100</h3>
                                        <p class="mb-0 mt-1 text-truncate">Total Codes/Limit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card-box-->
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card-box">
                            <div class="row">
                                <div class="col-4">
                                    <div class="avatar-md bg-success rounded-circle">
                                        <i class="mdi mdi-image-filter avatar-title font-26 text-white"></i>
                                    </div>
                                </div>
                                <div class="col-8">
                                    <div class="text-right">
                                        <h3 class="my-0 font-weight-bold"><span data-plugin="counterup" class="counterUp">${data.imageCount}</span>/60</h3>
                                        <p class="mb-0 mt-1 text-truncate">Total Image/Limit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card-box-->
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="card-box">
                            <div class="row">
                                <div class="col-6">
                                    <div class="avatar-md bg-primary rounded-circle">
                                        <i class="ion-md-eye avatar-title font-26 text-white"></i>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="text-right">
                                        <h3 class="my-0 font-weight-bold"><span data-plugin="counterup" class="counterUp">20544</span></h3>
                                        <p class="mb-0 mt-1 text-truncate">Unique Visitors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card-box-->
                    </div>
        `
        $("#dataCount").append(dataCountHtml);

        let progressBarComponent = `
        <div class="pl-xl-4">
        <p class="mb-1">Keyword percent - <span class="text-purple">${data.percentKeyword}%</span></p>
        <div class="progress mb-5" style="height: 7px;">
            <div class="progress-bar bg-purple progress-animated wow animated" role="progressbar" aria-valuenow="${data.percentKeyword}" aria-valuemin="0" aria-valuemax="100" style="width: ${data.percentKeyword}%">
            </div>
        </div>
        <p class="mb-1">Code percent - <span class="text-warning">${data.percentCode}%</span></p>
        <div class="progress mb-5" style="height: 7px;">
            <div class="progress-bar bg-warning progress-animated wow animated" role="progressbar" aria-valuenow="${data.percentCode}" aria-valuemin="0" aria-valuemax="100" style="width: ${data.percentCode}%">
            </div>
        </div>
        <p class="mb-1">Image percent - <span class="text-success">${data.percentImage}%</span></p>
        <div class="progress mb-5" style="height: 7px;">
            <div class="progress-bar bg-success progress-animated wow animated" role="progressbar" aria-valuenow="${data.percentImage}" aria-valuemin="0" aria-valuemax="100" style="width: ${data.percentImage}%">
            </div>
        </div>
        <p class="mb-1">Cached - <span class="text-info">70%</span></p>
        <div class="progress mb-5" style="height: 7px;">
            <div class="progress-bar bg-info progress-animated wow animated" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%">
            </div>
        </div>
        <p class="mb-1">Cached 2 - <span class="text-pink">90%</span></p>
        <div class="progress mb-0" style="height: 7px;">
            <div class="progress-bar bg-pink progress-animated wow animated" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 90%">
            </div>
        </div>
    </div>
        `

        $("#progressBarComponent").append(progressBarComponent);

        $('.counterUp').counterUp({
            delay: 15,
            time: 2000
           });
    }

}
