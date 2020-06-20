kakaoLogin = () => {
    Kakao.Auth.login({
        success: function (response) {
            Kakao.API.request({
                url: "/v2/user/me",
                success: function (res) {
                    const {
                        kakao_account: {
                            email,
                            profile: { nickname, profile_image_url: profile_image },
                        },
                    } = res;
                    const kakao_email = document.getElementById("kakao_email");
                    const kakao_username = document.getElementById("kakao_username");
                    const kakao_userImage = document.getElementById("kakao_userImage");
                    kakao_email.value = email;
                    kakao_username.value = nickname;
                    kakao_userImage.value = profile_image;
                    document.getElementById("kakao").submit();
                },
                fail: function (error) {
                    console.log(error);
                },
            });
        },
        fail: function (error) {
            console.log(error);
        },
    });
};

kakaoLogout = () => {
    if (!Kakao.Auth.getAccessToken()) {
        console.log("NOT LOGGED IN");
        location.href = `${contextPath}/user/logout.us`;
    } else {
        Kakao.Auth.logout(function () {
            location.href = `${contextPath}/user/logout.us`;
            console.log("LOGOUT");
        });
    }
};

kakaoInit = () => {
    Kakao.init(KAKAO_KEY.trim());
};

kakaoInit();
