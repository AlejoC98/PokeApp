
axios.interceptors.request.use(config => {
    document.querySelector(".loading-container").style.display = "flex";
    return config;
}, (err) => {
    document.querySelector(".loading-container").style.display = "none";
});

axios.interceptors.response.use(response => {
    document.querySelector(".loading-container").style.display = "none";
    return response;
}, (err) => {
    document.querySelector(".loading-container").style.display = "none";
});

async function handleSubmit() {
    event.preventDefault();

    var json_params = {};
    var json_url;

    event.target.querySelectorAll("input, textarea").forEach(element => {
       json_params[element.name] = element.value;
    });

    // Switch depending on the form action
    switch (event.target.id) {
        case "loginForm":
            json_url = "/authentication"
            break;
        case "rulesForm":
            console.log("Perrito");
            break;
    }

    
    await axios.post(json_url, json_params).then((res) => {
        res = res.data;
        if (res != false)
            window.location = res;
    }).catch((err) => {
        if ("response" in err)
            var mg = err.response.data.message;
        else
            var mg = "Error Procecing your Request";

        createErrorMg(".login-error", mg);
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
        document.querySelectorAll("#side-nav li").forEach((ele, ind) => {
            ele.addEventListener("click", openMenu);
        });
    }

    
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