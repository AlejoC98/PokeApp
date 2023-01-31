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
        "module": ""
    };

    if (document.querySelector("li.active")) {
        document.querySelector("li.active").classList.toggle("active");
    }

    this.classList.toggle("active");

    switch (this.id) {
        case "home":
            json_params["module"] = "newGameModule";
            break;
        case "sets":
            json_params["module"] = "cardSetModule";
            break;
    }

    fetch("/modules", {
        method: 'POST',
        body: JSON.stringify(json_params),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((resJson) => {
        return resJson.text();
    }).then((res) => {
        document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
    }).catch((err) => {
        console.log(err);
    });

}

function loadCards() {
    fetch("https://api.pokemontcg.io/v2/cards?q=name:gardevoir", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
}