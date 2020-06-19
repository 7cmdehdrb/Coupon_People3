var duration = 300;

var $sidebar = $(".sidebar");
var $sidebarButton = $sidebar.find("button").on("click", function () {
    $sidebar.toggleClass("open");
    if ($sidebar.hasClass("open")) {
        $sidebar.stop(true).animate({ left: "-70px" }, duration, "easeOutBack");
        $sidebarButton.find("span").text("CLOSE");
    } else {
        $sidebar.stop(true).animate({ left: "-270px" }, duration, "easeInBack");
        $sidebarButton.find("span").text("OPEN");
    }
});
