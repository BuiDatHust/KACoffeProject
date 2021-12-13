// toastAlertN function
function toastAlertN({title = '', message = '', type = 'success', duration = 1000}){
  const main = document.getElementById('toastAlertN');

  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle'
  };
  const icon = icons[type];
  if(main){
    const toastAlertN = document.createElement('div');

    toastAlertN.onclick = function(e){
      if(e.target.closest('.toastAlertN__close'))
        main.removeChild(toastAlertN);
    }

    const delay = (duration/1000).toFixed(2);

    toastAlertN.classList.add('toastAlertN', `toastAlertN--${type}`);

    toastAlertN.style.animation = `alertInLeft ease .3s, fadeOutAlert linear 1s ${delay}s forwards`;


    toastAlertN.innerHTML = `
    <div class="toastAlertN__icon">
        <i class="${icon}"></i>
    </div>
    <div class="toastAlertN__body">
        <h3 class="toastAlertN__title">${title}</h3>
        <p class="toastAlertN__msg">${message}</p>
    </div>
    <div class="toastAlertN__close">
        <i class="fas fa-times"></i>
    </div>
    `
    main.appendChild(toastAlertN);

    setTimeout(function(){
      main.removeChild(toastAlertN);
    },duration +1000);
  }
}


function ShowSuccessAlert(){
  toastAlertN({
    title: "Thành công",
    message: "Cảm ơn bạn đã mua hàng, hi vọng bạn luôn hài lòng về sản phẩm của chúng tôi",
    type: "success",
    duration: 1000
  })
}
function ShowErrorAlert(){
  toastAlertN({
    title: "Thất bại",
    message: "Hãy nhập đủ thông tin",
    type: "error",
    duration: 1000
  })
}