const loginSelector = document.querySelectorAll(".login_select");
const isAdmin = document.querySelector(".isAdmin");
const userId = document.querySelector("#userId");
const userPw = document.querySelector("#userPw");
const rememberId = document.querySelector("#saveId");

changeSelector = (bool) => {
    switch (bool) {
        case true:
            isAdmin.value = "normal";
            loginSelector[0].style.backgroundColor = "#f5f5f5";
            loginSelector[1].style.backgroundColor = "#E6E6E6";
            break;

        case false:
            isAdmin.value = "admin";
            loginSelector[0].style.backgroundColor = "#E6E6E6";
            loginSelector[1].style.backgroundColor = "#f5f5f5";
            break;

        default:
            break;
    }
};

document.addEventListener("submit", (ev) => {
    if (userId.value == "" || userPw.value == "") {
        ev.preventDefault();
        alert("아이디 혹은 비밀번호를 입력해주세요");
        return;
    }

    if (rememberId.checked) {
        localStorage.rememberId = userId.value;
        localStorage.remember = "true";
    } else {
        localStorage.rememberId = null;
        localStorage.remember = "false";
    }
});

init = () => {
    if (localStorage.remember == "true") {
        userId.value = localStorage.rememberId;
        rememberId.setAttribute("checked", true);
    }
};

init();
