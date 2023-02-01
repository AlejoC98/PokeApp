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