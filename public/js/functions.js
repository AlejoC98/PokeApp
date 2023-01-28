function createErrorMg(ele, mg, time = 3000) {
    var element = document.querySelector(ele);
    element.innerText = mg;
    setTimeout(() => {
        element.innerText = "";
    }, time);
}