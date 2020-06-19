const slider_imgs = document.querySelectorAll(".slider_img");
let idx = 0;

updatePhoto = (num) => {
    idx += num;

    if (idx < 0) {
        idx = slider_imgs.length;
    }

    if (idx === slider_imgs.length) {
        idx = 0;
    }

    for (let index = 0; index < slider_imgs.length; index++) {
        if (index === idx) {
            slider_imgs[index].style.display = null;
        } else {
            slider_imgs[index].style.display = "none";
        }
    }
};

init = () => {
    updatePhoto(0);
};

init();
