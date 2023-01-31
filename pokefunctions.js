import pokemon from "pokemontcgsdk";

pokemon.configure({apiKey: '11800482-77f0-4124-b53f-7f12ac6d690c'});

function pokeRequest(option) {
    let response;

    switch (action) {
        case "allCards":
                // Getting all the cards setting a top of 250
                pokemon.card.where({ pageSize: 250, page: 1 }).then(result => {
                    // console.log(result.data[0]) // "Blastoise"
                        response = result;
                        // res.status(200).json({
                        //     content: result
                        // });
                    });
            break;
        case "setData":
            // Get set data
            pokemon.set.find('basep').then(set => {
                result = set;
                // console.log(set.name) // "Base"
                // res.status(200).json({
                //     content: set
                // });
            });
            break;
        case "allSets":
            // Get all sets
            pokemon.set.all({ q: 'series:base' })
            .then((cards) => {
                response = cards;
                // console.log(cards[0].name) // "Base"
                // res.status(200).json({
                //     content: cards
                // });
            });
            break;
        case "findCard":
            // Find specific card
            pokemon.card.find('base1-4').then(card => {
                response = card;
                // console.log(card.name) // "Charizard"
                // res.status(200).json({
                //     content: card
                // });
            });
            break;
    }
}