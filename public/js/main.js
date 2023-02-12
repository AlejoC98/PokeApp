axios.interceptors.request.use(config => {
    document.querySelector(".loading-container").style.display = "flex";
    return config;
});

axios.interceptors.response.use(response => {
    document.querySelector(".loading-container").style.display = "none";
    return response;
}, (err) => {
    document.querySelector(".loading-container").style.display = "none";
    return Promise.reject(err);
});


// Initializing bt element
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

function handleSubmit() {
    event.preventDefault();

    var json_params = {};
    var json_url;

    event.target.querySelectorAll("input, textarea, select").forEach(element => {
        if (element.value != "")
            json_params[element.name] = element.value;
    });

    // Switch depending on the form action
    switch (event.target.id) {
        case "loginForm":
            json_url = "/authentication";
            break;
        case "gameRulesForm":
            json_url = "/loadRound";

            var new_json = {};

            var players = {};

            for(key of Object.keys(json_params)) {
                if ( /\d/.test(key) == true )
                    // players.push(json_params[key])
                    players[key] = json_params[key];
                else
                    new_json[key] = json_params[key];
            }

            json_params = {
                ...new_json,
                "players" : players
            }

            break;
    }
    // checking if there's parameters inside json_params
    if (Object.keys(json_params).length > 0)
        axios.post(json_url, json_params).then((res) => {
            res = res.data;
            if ("url" in res)
                window.location = res.url;
            else if ("func" in res)
                window[res.func].apply(this, res.args);
        }).catch((err) => {
            createErrorMg(err.response.data.message);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    // Add functions whne modal is opening
    if (myModalEl = document.getElementById('mainModal')) {
        myModalEl.addEventListener('show.bs.modal', event => {
            event.target.querySelector("#mainModal .modal-body").innerHTML = "";
            var json_params = {
                "action" : event.relatedTarget.id
            };
            loadForm(json_params, event.target);
        });
    }
    // Add event for menu items
    if (document.getElementById("side-nav")){
        document.querySelectorAll("#side-nav li:has(a)").forEach((ele, ind) => {
            ele.addEventListener("click", openMenu);
        });
    }

    // Open default module
    if (document.getElementById("side-nav") != null)
        openMenu("home");
    
    document.addEventListener("scroll", (pos) => {
        if (document.querySelectorAll(".breadcrumb").length > 0)
                if (window.scrollY >= 80){
                    if (!(document.querySelector(".breadcrumb").classList.contains("fixed-top"))) {
                        document.querySelector(".breadcrumb").classList.add("fixed-top");
                    }
                } else {
                    document.querySelector(".breadcrumb").classList.remove("fixed-top");
                }
    });
});