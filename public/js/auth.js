document.addEventListener("DOMContentLoaded", function() {

    // let login          = document.querySelector(".login");
    let modal          = document.querySelector(".modal");
    let authLogin      = document.querySelector(".auth-login");
    let authRegister   = document.querySelector(".auth-register");
    let modalOverLay   = document.querySelector(".modal__overlay");
    let switchLogin    = document.querySelector(".auth-form__switch-login");
    let switchRegister = document.querySelector(".auth-form__switch-register");


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

}, false)   