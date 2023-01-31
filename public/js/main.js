async function handleSubmit() {
    event.preventDefault();

    var json_params = {};

    event.target.querySelectorAll("input, textarea").forEach(element => {
       json_params[element.name] = element.value;
    });

    
    await fetch('/authentication', {
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

if (myModalEl = document.getElementById('mainModal')) {
    myModalEl.addEventListener('show.bs.modal', event => {
        var json_params = {
            "action" : event.relatedTarget.id
        };
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
                    event.target.querySelector("#mainModalLabel").innerText = "New Game.";
                    event.target.querySelector("#mainModal .modal-body").insertAdjacentHTML("beforeend", resJson);
                    event.target.querySelector("#exampleModalToggleLabel2").innerText = "New Game.";
                    document.querySelector("#mainModal2 .modal-body").appendChild(document.querySelector("#namesForm"));
                    break;
            }
        }).catch((err) => {
            console.log(err);
        });
    });
}