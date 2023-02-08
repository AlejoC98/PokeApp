let flipped_cards = [];
let last_card;
let timer = 60;
let gMatches = {
    "total": 0,
    "found": 0
}

let gPlayers;
let gRounds;
let gTurn;

const playersColors = ["#B7F0AD", "#A22522", "#FF8E72", "#32908F", "#C47AC0", "#FFBC42", "#52D1DC", "#9D96B8", "#415D43", "#C6AC8F",]

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

    document.querySelector(".alert").style.top = "25%";

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
                if (gameM % nPlayers === 0){
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
                if (/\d/.test(event.key) == true)
                    status = false;
                break;
        }

    if (status == false)
        event.preventDefault();

}

function flipCard() {

    var cardEle = event.currentTarget;
    
    if (!cardEle.querySelector(".flip-card-inner").classList.contains("flipped"))
        if (flipped_cards.length < 2) {
            cardEle.querySelector(".flip-card-inner").classList.add("flipped");
            cardEle.style.zIndex = "1000000";

            if (flipped_cards.includes(cardEle.id)) {
                createErrorMg("You found a match!!", "success");
                setTimeout(() => {
                    document.querySelectorAll(".flipped:not(.matched)").forEach((ele, ind) => {
                        ele.classList.add("matched");
                        ele.insertAdjacentHTML("afterbegin", "<div class='matched-card'> <h1 class='text-white'>" + gPlayers["player" + gTurn].name.substr(0,1) + "</h1></div>");
    
                        ele.querySelector(".matched-card").style.background = convertHexToRGBA(gPlayers["player" + gTurn].color, 0.8);
                    }); 
                }, 1000);
                gMatches["found"] += 1;
                updateGameInfo(gMatches.total);
                flipped_cards = [];
            } else {
                flipped_cards.push(cardEle.id)
            }
            
            if (flipped_cards.length === 2) {
                setTimeout(() => {
                    flipped_cards.find((card) => {
                        document.querySelector("#"+ card +" .flip-card-inner.flipped:not(.matched)").classList.remove("flipped");
                    });
                    updateGameInfo();
                    flipped_cards = [];
                }, 1700);
            }
        }
}

function updateGameInfo() {
    
    if (gMatches != "") {
        document.querySelector("#matches span").innerText = gMatches.found +" / " + gMatches.total;
    }

    if (gRounds != "")
        document.querySelector("#rounds_count span").innerText = gRounds;

    if (Object.keys(gPlayers).length > 0){
        if (gTurn === undefined)
            gTurn = 1;
        else if (gTurn + 1 <= Object.keys(gPlayers).length)
            gTurn += 1;
        else
            gTurn = 1;
        
        document.querySelector("#player_turn span").innerText = gPlayers["player" + gTurn].name;
        document.querySelector("#player_turn i").style.color = gPlayers["player" + gTurn].color;
        timer = 60;
    }

    if (gMatches.total === gMatches.found) {
        document.querySelector(".end-game").classList.toggle("d-none");
        timer = 0;
    } else {
        document.querySelector("#counter span").innerHTML = "&infin;";
    }
}

async function createGameField(cards, matches, players, rounds) {

    gMatches["total"] = parseInt(matches);

    let usedColors = [];
    var playerColor = playersColors[Math.floor(Math.random()*playersColors.length)];

    for (var player of Object.keys(players)) {
        
        while (usedColors.includes(playerColor)) {
            playerColor = playersColors[Math.floor(Math.random()*playersColors.length)];
        }

        usedColors.push(playerColor);
        players[player].color = playerColor;
    }

    gPlayers = players;

    gRounds = rounds;

    document.querySelector(".btn-secondary").click();

    await loadModule({"module" : "newgame"});

    updateGameInfo();

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

        var cardEle = '<div class="pokecard flip-card" onclick="flipCard()" id="'+ card.id +'">' +
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

    });

    if (Object.keys(players).length > 1)
        gameTimer();
}

function gameTimer() {
    var top = 0;
    const timeCounter = setInterval(() => {
        if (timer === top) {
            clearInterval(timeCounter);
            updateGameInfo();
            timer = 60;
            gameTimer();
        } else {
            document.querySelector("#counter span").innerText = ( (timer - 1).toString().length == 1 ) ? "00:0" + (timer -= 1) : "00:" + (timer -= 1);
        }
    }, 1000);
}

const convertHexToRGBA = (hexCode, opacity = 1) => {  
    let hex = hexCode.replace('#', '');
    
    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }    
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;   
    }

    return `rgba(${r},${g},${b},${opacity})`;
};