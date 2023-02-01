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
                document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
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

function loadForm(json_params, element) {
    fetch("/forms", {
        method: 'POST',
        body: JSON.stringify(json_params),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        // return res.json();
        return res.text();
    }).then((resJson) => {
        // action
        switch (json_params.action) {
            case "createGame":
                element.querySelector("#mainModalLabel").innerText = "New Game.";
                element.querySelector("#mainModal .modal-body").insertAdjacentHTML("beforeend", resJson);
                updateSelectOpt("#pokeSets", "sets")
                break;
        }

        var formID = element.querySelector("#mainModal .modal-body form").id;

        element.querySelector("#mainModal #confirmModal").setAttribute("form", formID);

    }).catch((err) => {
        console.log(err);
    });
}

async function updateSelectOpt(select, data) {
    
    var json_params = {};

    switch (data) {
        case "sets":
            json_params["action"] = "sets";
            break;
    }

    await fetch("/pokeload", {
        method: "POST",
        body: JSON.stringify(json_params),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((resJson) => {
        return resJson.json();
    }).then((res) => {
        if ("content" in res) {
            for (opt of res.content) {
                var option_ele = document.createElement("option");
                option_ele.id = opt.id;
                option_ele.value = opt.id;
                option_ele.innerText = opt.name;
                document.querySelector(select).appendChild(option_ele);
            }
        }
    }).catch((err) => {
        console.log(err);
    });
}