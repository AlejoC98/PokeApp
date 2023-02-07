let flipped_cards = [];
let last_card;
let timer = 60;

function createErrorMg(mg, color = "warning", time = 5000) {

    // var element = document.querySelector(ele);

    var ms_container = '<div class="alert alert-'+ color +' alert-dismissible fade show animate__animated animate__fadeInRightBig" role="alert">' +
    '<strong>Oopss!</strong> ' + mg +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';

    if (document.querySelector(".alert") == null)
        document.querySelector("main").insertAdjacentHTML("afterbegin", ms_container);
    else
        document.querySelector(".alert").remove();

    document.querySelector(".alert").style.top = window.scrollY + 10;

    setTimeout(() => {
        document.querySelector(".alert").classList.remove("animate__fadeInRightBig");
        document.querySelector(".alert").classList.add("animate__fadeOutRight");
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 1000);
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

    // loadModule(json_params, this.id);
    loadModule(json_params);


}

async function loadModule(json_params = {}) {

    // Cleaning container
    document.querySelector(".d-content").innerHTML = "";

    let eleID = event.currentTarget.id;

    await axios.post("/modules", json_params).then((res) => {
        res = res.data;

        // Adding the module
        document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);

        switch (json_params.module) {
            case "home":
                break;
            case "sets":
                // Loading pokedata
                loadCards({"action" : "sets"}, "createSetTable");
                break;
            case "cardsSet":
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
                updateSelectOpt("select#filter", "sets");
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
    
        if (nPlayers > 1)
            if (nPlayers != "" && gameM != "") {
                var evenly = nPlayers / gameM;
                if (evenly % 1 === 0){
                    // Removing tooltip
                    new bootstrap.Tooltip("#confirmModal", {disabled: true});
                    document.getElementById("confirmModal").setAttribute("type", "submit");
                    event.target.classList.remove("is-invalid");
                } else {
                    // Adding tooltip
                    new bootstrap.Tooltip("#confirmModal", {
                        title: "Number of matches not evenly with players!",
                    });
                    document.getElementById("confirmModal").setAttribute("type", "button");

                    event.target.classList.add("is-invalid");

                }
            }
    }
}

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
                if (/\d/.test(event.key) == true)
                    status = false;
                break;
        }

    if (status == false)
        event.preventDefault();

}

function flipCard() {

    var cardEle = event.currentTarget;

    if (flipped_cards.length < 2) {
        if (!cardEle.querySelector(".flip-card-inner").classList.contains("flipped")) {
            cardEle.querySelector(".flip-card-inner").classList.toggle("flipped");
            if (flipped_cards.includes(cardEle.id)){
                if (cardEle.querySelector(".flip-card-inner:not(.flipped)") != null)
                    cardEle.querySelector(".flip-card-inner:not(.flipped)").classList.toggle("flipped");
                document.querySelectorAll("#"+cardEle.id+" .flip-card-inner.flipped").forEach((mcard, ind) => {
                    mcard.classList.add("matched");
                });
                createErrorMg("Match Found!!", "success");
                flipped_cards = [];
            } else {
                flipped_cards.push(cardEle.id);
            }
            setTimeout(() => {
                if (flipped_cards.length == 2) {
                    flipped_cards.forEach((card, ind) => {
                        document.querySelector("#"+card+" .flip-card-inner.flipped:not(.matched)").classList.remove("flipped");
                    });
                    flipped_cards = [];
                }
            }, 2500);
        }
    }
}

async function createGameField(cards, matches, players) {

    document.querySelector(".btn-secondary").click();

    await loadModule({"module" : "newgame"});

    document.getElementById("rounds_count").innerText = matches;
    
    document.getElementById("player_turn").innerText = players["player1"];
    

    var rowCount = {
        "row": 1,
        "cont" : 6
    };

    cards.forEach((card, ind) => {

        if (document.getElementById("row-" + rowCount["row"]) == null) {
            var newRow = document.createElement("div");
            newRow.classList.add("row");
            newRow.setAttribute("id", "row-" + rowCount["row"]);
            document.querySelector(".game-container").appendChild(newRow);
        }

        var cardEle = '<div class="pokecard flip-card card-'+ind+'" onclick="flipCard()" id="'+ card.id +'">' +
            '<div class="flip-card-inner">' +
                '<div class="flip-card-front">' +
                    '<img src="/img/pokecard-backside.png" width="100" alts=""></img>' +
                '</div>' +
                '<div class="flip-card-back">' +
                    '<img src="'+ card.images.small +'" width="100" alt=""></img>' +
                '</div>' +
            '</div>' +
        '</div>';

        document.querySelector(".game-container .row-cards").insertAdjacentHTML("beforeend", cardEle);

        // if (document.querySelector(".game-container #row-" + rowCount["row"]).childNodes.length < rowCount["cont"]) {
        //     document.querySelector(".game-container #row-" + rowCount["row"]).insertAdjacentHTML("beforebegin", cardEle);
        // }
        // else {
        //     rowCount["row"]++;
        //     document.querySelector(".game-container").insertAdjacentHTML("beforebegin", "<div class='row' id='row-"+ rowCount["row"] +"'></div>");
        //     document.querySelector(".game-container #row-" + rowCount["row"]).insertAdjacentHTML("beforebegin", cardEle);
        // }
    });

    gameTimer();
}

function gameTimer() {
    var top = 0;
   const timeCounter = setInterval(() => {
        if (timer === top)
            clearInterval(timeCounter);
        else
            document.getElementById("counter").innerText = ( (timer - 1).toString().length == 1 ) ? "00:0" + (timer -= 1) : "00:" + (timer -= 1);
   }, 1000);
}