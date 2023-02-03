function createErrorMg(ele, mg, time = 3000) {

    // var element = document.querySelector(ele);
    
    var element = (typeof ele === "string") ? document.querySelector(ele) : ele;

    if (element.childNodes.length > 0) {
        element.insertAdjacentHTML("beforeend", "<span class='text-danger text-small'>" + mg + "</span>")
        element = element.querySelector("span");
    }
    else {
        element.innerText = mg;
    }


    setTimeout(() => {
        (element.tagName === "SPAN") ? element.remove() : element.innerText = "";
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

    await axios.post("/modules", json_params).then((res) => {
        res = res.data;
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

    await axios.post("/pokeload", json_params).then((res) => {
        res = res.data;
        if ("content" in res)
            window[func].apply(this, [res.content]);
    }).catch((err) => {
        console.log(err);
    });
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
    axios.post("/forms", json_params).then((res) => {
        res = res.data;

        switch (json_params.action) {
            case "createGame":
                element.querySelector("#mainModalLabel").innerText = "New Game.";
                element.querySelector("#mainModal .modal-body").insertAdjacentHTML("beforeend", res);
                updateSelectOpt("#pokeSets", "sets");
                break;
        }
    
        var formID = element.querySelector("#mainModal .modal-body form").id;
    
        element.querySelector("#mainModal #confirmModal").setAttribute("form", formID);

        // document.querySelectorAll()

    }).catch((err) => {
        console.log(err);
    });
}

async function updateSelectOpt(select, data) {
    
    var json_params;

    switch (data) {
        case "sets":
            json_params = "sets";
            break;
    }

    axios.post("/pokeload", {
        "action" : json_params
    }).then((res) => {
        res = res.data;
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

function validatePlayers() {

    var parent = document.querySelector('#playersInputs .cont');

    parent.innerHTML = "";

    if (event.target.value != "") {
        for (let index = 0; index < event.target.value; index++) {
            var currentID = (index + 1);
            var insertIn = "<div class='col-12'> <label>Palyer "+ currentID +"</label> <input class='form-control' type='text' name='player"+currentID+"' id='player"+currentID+"' required  placeholder='Name'/> </div>";
            parent.insertAdjacentHTML('beforeend', insertIn);
        }
        showHiddenElements(".modal-body form");
    }
}

function showHiddenElements(container) {
    document.querySelectorAll(container + " .d-none").forEach((ele) => {
        ele.classList.toggle("d-none");
    });
}

function validatePlayerMatches() {

    inputMask('number');

    if (event.key != "Backspace" && event.target.value != "") {
        let nPlayers = document.getElementById("playerNumber").value,
        gameM = document.getElementById("gameMatches").value;
    
        if (nPlayers != "" && gameM != "") {
            var evenly = nPlayers / gameM;
            if (evenly % 1 === 0){
                // Removing tooltip
                new bootstrap.Tooltip("#confirmModal", {disabled: true});
                document.getElementById("confirmModal").setAttribute("type", "submit");
                event.target.classList.toggle("is-invalid");
            } else {
                // Adding tooltip
                new bootstrap.Tooltip("#confirmModal", {
                    title: "Number of matches not evenly with players!",
                });
                document.getElementById("confirmModal").setAttribute("type", "button");

                event.target.classList.toggle("is-invalid");

            }
        }
    }
}

// function addPlayerName() {
    
// }



function inputMask(type) {
    var status = true;
    if (event.key != "Backspace" && event.key != "Tab")
        switch (type) {
            case "number":
                if (/^[A-Za-z]*$/.test(event.key) == true)
                    status = false;

                if ("max" in event.target) {
                    if ( parseInt(event.target.value + event.key) > parseInt(event.target.max) ){
                        status = false;
                        createErrorMg(event.target.parentElement, "Number can't be higher than " + event.target.max);
                    }
                }

                break;
            case "letters":
                // if (/\d/.test(event.key) == true)
                if (/^[0-9]*$/.test(event.key) == true)
                    status = false;
                break;
        }

    if (status == false)
        event.preventDefault();

}