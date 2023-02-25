import pokemon from 'pokemontcgsdk';

pokemon.configure({apiKey: '11800482-77f0-4124-b53f-7f12ac6d690c'});

const getPokeCards = async (req) => {

    const action = req.body.action;

    var response;

    switch (action) {
        case "all":
            await pokemon.card.where({ pageSize: 250, page: 1 }).then(result => {
                response = result;
            })
            break;
        case "sets":
            await pokemon.set.all().then((cards) => {
                response = [];
                var content = [];
                cards.find((set) => {
                    content.push(set.name);
                });

                content = content.sort();

                for (var card of content) {
                    var insert = cards.find((setN) => setN.name === card);
                    response.push(insert);
                }
            })
            break;
        case "setCards":
            
            let filter = req.body.filter;

            var filter_by;

            if ("size" in req.body)
                filter_by = { q: 'set.id:' + filter, pageSize: req.body.size, page: 1}
            else
                filter_by = { q: 'set.id:' + filter}

            await pokemon.card.all(filter_by).then(result => {
                response = result;
            })
            break;
    }
    return response;
}

export { getPokeCards };