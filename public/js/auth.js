document.addEventListener("DOMContentLoaded", function() {

    // let login          = document.querySelector(".login");
    let modal          = document.querySelector(".modal");
    let authLogin      = document.querySelector(".auth-login");
    let authRegister   = document.querySelector(".auth-register");
    let authForgot     = document.querySelector(".auth-forgot-password")
    let modalOverLay   = document.querySelector(".modal__overlay");
    let switchLogin    = document.querySelector(".auth-form__switch-login");
    let switchLogin1   = document.querySelector(".auth-form__switch-login-1");
    let switchRegister = document.querySelector(".auth-form__switch-register");
    let forgotPassword = document.querySelector(".auth-form__help-forgot");


    // login.addEventListener("click", function() {
    //     modal.classList.add("open");
    //     authLogin.style.display = "block";
    //     authRegister.style.display = "none";
    // })
    modalOverLay.addEventListener("click", function() {
        modal.classList.remove("open");
    })

    switchLogin.addEventListener("click", function() {
        authLogin.style.display = "block";
        authRegister.style.display = "none";
    })

    switchRegister.addEventListener("click", function() {
        authRegister.style.display = "block";
        authLogin.style.display = "none";
    })
    forgotPassword.addEventListener("click", function() {
        authRegister.style.display = "none";
        authLogin.style.display = "none";
        authForgot.style.display = "block";
    })
    switchLogin1.addEventListener("click", function() {
        authLogin.style.display = "block";
        authForgot.style.display = "none";
    })
}, false)   
function checkValue(){
    const TK = document.getElementById('TK').value;
    const MK = document.getElementById('MK').value;
    const NLMK = document.getElementById('NLMK').value;
    if(TK ==""||MK == ""|| NLMK == ""){
        ShowErrorAlert();
    }
}   
