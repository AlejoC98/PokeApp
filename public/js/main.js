
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