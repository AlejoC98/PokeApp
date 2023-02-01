function createErrorMg(ele, mg, time = 3000) {
    var element = document.querySelector(ele);
    element.innerText = mg;
    setTimeout(() => {
        element.innerText = "";
    }, time);
}

async function openMenu() {
    event.preventDefault();

    var json_params = {
        "module": this.id
    };

    if (document.querySelector("li.active"))
        document.querySelector("li.active").classList.toggle("active");

    this.classList.toggle("active");

    loadModule(json_params, this.id);


}

async function loadModule(json_params = {}) {

    // Cleaning container
    document.querySelector(".d-content").innerHTML = "";

    let eleID = event.currentTarget.id;

    await fetch("/modules", {
        method: 'POST',
        body: JSON.stringify(json_params),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((resJson) => {
        return resJson.text();
    }).then((res) => {

        switch (json_params.module) {
            case "home":
                console.log("Perrito");
                break;
            case "sets":
                document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
                // Loading pokedata
                loadCards({"action" : "sets"}, "createSetTable");
                break;
            case "cardsSet":
                document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
                loadCards({ "action" : "setCards", "filter" : eleID }, "createCardElement");
                break;
        }

    }).catch((err) => {
        console.log(err);
    });
}

async function loadCards(json_params, func) {

    await fetch("/pokeload", {
        method: "POST",
        body: JSON.stringify(json_params),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((resJson) => {
        return resJson.json();
    }).then((res) => {
        if ("content" in res)
            window[func].apply(this, [res.content]);
    }).catch((err) => {
        console.log(err);
    })
}

function createSetTable(data) {
    data.forEach((set, ind) => {
        var tr_ele = "<tr id='"+ set.id +"'>" + 
        "<th scope='row'>"+ (ind + 1) +"</th>" +
        "<td>"+ set.name +"</td>" +
        "<td><img src='"+ set.images.logo +"' width='60' height='50' /></td>" +
        "</tr>";

        document.querySelector("#setsTable tbody").insertAdjacentHTML("beforeend", tr_ele);

        document.querySelector("#" + set.id).addEventListener("click", () => loadModule({ "module": "cardsSet", "filter": set.id }));

    });
}

function createCardElement(data) {

    let count = 0;

    data.forEach((card, ind) => {
        var insert = "<div class='col'> <img src='"+ card.images.large +"' width='150' heigth='200' /> </div>";

        document.querySelector(".set-cards-content .row").insertAdjacentHTML("beforeend", insert);
    });
    
}