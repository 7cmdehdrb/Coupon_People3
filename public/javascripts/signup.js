let check = false;

checkEmailValid = async () => {
    const email = document.getElementById("email");
    const alert = document.getElementById("emailValidAlert");

    check = false;

    const count = await fetch(`/users/emailCheck?id=${email.value}`)
        .then((Response) => Response.json())
        .then((json) => json.result)
        .catch((err) => console.log(err));

    if (count === 0) {
        check = true;
        alert.style.color = "green";
        alert.innerText = "사용 가능한 이메일입니다";
    } else {
        alert.style.color = "red";
        alert.innerText = "사용 불가능한 이메일입니다";
    }
};

window.addEventListener("submit", (ev) => {
    const email = document.getElementById("email");
    const nickname = document.getElementById("nickname");
    const profileImage = document.getElementById("profileImage");
    const password = document.getElementById("password");
    const re_password = document.getElementById("re_password");

    const agreement1 = document.getElementById("agreement1");
    const agreement2 = document.getElementById("agreement2");
    const agreement3 = document.getElementById("agreement3");

    if (email.value == "" || nickname.value == "" || profileImage.value == "" || password.value == "" || re_password.value == "") {
        ev.preventDefault();
        alert("필수 항목을 전부 입력해주세요");
        return;
    }

    if (check === false) {
        ev.preventDefault();
        alert("이메일 중복 체크를 해주세요");
        return;
    }

    if (password.value !== re_password.value) {
        ev.preventDefault();
        alert("비밀번호가 서로 일치하지 않습니다");
        return;
    }

    if (agreement1.checked === false || agreement2.checked === false || agreement3.checked == false) {
        ev.preventDefault();
        alert("이용약관에 전부 동의해주세요");
        return;
    }
});
