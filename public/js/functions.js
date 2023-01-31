function createErrorMg(ele, mg, time = 3000) {
    var element = document.querySelector(ele);
    element.innerText = mg;
    setTimeout(() => {
        element.innerText = "";
    }, time);
}

function openMenu() {
    event.preventDefault();

    // Cleaning container
    document.querySelector(".d-content").innerHTML = "";

    var json_params = {
        "module": this.id
    };

    if (document.querySelector("li.active")) {
        document.querySelector("li.active").classList.toggle("active");
    }

    this.classList.toggle("active");

    fetch("/modules", {
        method: 'POST',
        body: JSON.stringify(json_params),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((resJson) => {
        return resJson.text();
    }).then((res) => {

        switch (this.id) {
            case "home":
                console.log("Perrito");
                break;
                case "sets":
                document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
                break;
        }

    }).catch((err) => {
        console.log(err);
    });

}

// function loadCards(action) {

//     var json_params = {
//         "action": action
//     };

//     fetch("/pokeload", {
//         method: "POST",
//         body: JSON.stringify(json_params),
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     }).then((resJson) => {
//         return resJson.json();
//     }).then((res) => {
//         console.log(res);
//     }).catch((err) => {
//         console.log(err);
//     })
// }