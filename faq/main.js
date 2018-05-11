var scroll = document.querySelector('.scroll');
SimpleScrollbar.initEl(scroll);
if (location.hash) {
    var el = document.getElementById(location.hash.slice(1));
    if (el) {
        el.scrollIntoView();
    }
}