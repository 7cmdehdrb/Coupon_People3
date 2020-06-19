const searchField = document.getElementById("searchField");

openSearchField = () => {
    if (searchField.style.display === undefined) {
        searchField.style.display = null;
    } else if (searchField.style.display === null) {
        searchField.style.display = "none";
    } else if (searchField.style.display == "none") {
        searchField.style.display = null;
    } else {
        searchField.style.display = "none";
    }
};
