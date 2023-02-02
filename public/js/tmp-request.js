// await fetch("/pokeload", {
//         method: "POST",
//         body: JSON.stringify(json_params),
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     }).then((resJson) => {
//         return resJson.json();
//     }).then((res) => {
//         if ("content" in res) {
//             for (opt of res.content) {
//                 var option_ele = document.createElement("option");
//                 option_ele.id = opt.id;
//                 option_ele.value = opt.id;
//                 option_ele.innerText = opt.name;
//                 document.querySelector(select).appendChild(option_ele);
//             }
//         }
//     }).catch((err) => {
//         console.log(err);
//     });


// fetch("/forms", {
//     method: 'POST',
//     body: JSON.stringify(json_params),
//     headers: {
//         'Content-Type': 'application/json',
//     }
// }).then((res) => {
//     // return res.json();
//     return res.text();
// }).then((resJson) => {
//     // action
//     switch (json_params.action) {
//         case "createGame":
//             element.querySelector("#mainModalLabel").innerText = "New Game.";
//             element.querySelector("#mainModal .modal-body").insertAdjacentHTML("beforeend", resJson);
//             updateSelectOpt("#pokeSets", "sets")
//             break;
//     }

//     var formID = element.querySelector("#mainModal .modal-body form").id;

//     element.querySelector("#mainModal #confirmModal").setAttribute("form", formID);

// }).catch((err) => {
//     console.log(err);
// });



// await fetch("/pokeload", {
//     method: "POST",
//     body: JSON.stringify(json_params),
//     headers: {
//         'Content-Type': 'application/json',
//     }
// }).then((resJson) => {
//     return resJson.json();
// }).then((res) => {
//     if ("content" in res)
//         window[func].apply(this, [res.content]);
// }).catch((err) => {
//     console.log(err);
// })



// await fetch("/modules", {
//     method: 'POST',
//     body: JSON.stringify(json_params),
//     headers: {
//         'Content-Type': 'application/json',
//     }
// }).then((resJson) => {
//     return resJson.text();
// }).then((res) => {

//     switch (json_params.module) {
//         case "home":
//             document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
//             break;
//         case "sets":
//             document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
//             // Loading pokedata
//             loadCards({"action" : "sets"}, "createSetTable");
//             break;
//         case "cardsSet":
//             document.querySelector(".d-content").insertAdjacentHTML("beforeend", res);
//             loadCards({ "action" : "setCards", "filter" : eleID }, "createCardElement");
//             break;
//     }

// }).catch((err) => {
//     console.log(err);
// });


await fetch(json_url, {
    method: 'POST',
    body: JSON.stringify(json_params),
    redirect: "follow",
    headers: {
        "Content-Type": "application/json"
    }
}).then((res) => {
    var jres;
    (res.redirected == true) ? window.location = res.url : jres = res.json();
    return jres;
}).then((jsonRes) => {
    
    if ('message' in jsonRes)
        createErrorMg(".login-error", jsonRes.message);

}).catch((err) => {
    console.log(err);
});