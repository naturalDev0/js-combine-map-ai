const API_BASE_URL = "https://supreme-robot-96x7xx9xqj9c9v4r-3000.app.github.dev";
const headers = {
    Accept: 'application/json'
}

async function search(lat, lng, query) {
    // create the coordinate
    let ll = lat + "," + lng;
    let response = await axios.get(API_BASE_URL + "/api/places/search", {
        headers: {
            ...headers
        },
        params: {
            'll': ll,
            'query': query
        }
    })
    return response.data;
}

async function recommend(lat, lng, query) {
    const response = await axios.post(API_BASE_URL + "/chat", {
        userMessage: query,
        systemMessage: `You are a professional travel advisor. Always respond with a JSON object containing: { \"text\": \"Helpful travel advice.\", \"locations\": [ { \"name\": \"<string>\", \"lat\": \"<number>\", \"lng\": \"<number>\", \"description\": \"<string>\",  \"website\": \"<website url>\" } ] }. The text field should be a narrative summary of all the locations, not a list, since the locations are already listed in the locations array. Only answer travel-related questions close to latitude: ${lat} and longitude: ${lng}.`,
    })

    // if empty results, throw an error
    if (!response.data.hasOwnProperty("locations") || response.data.locations.length === 0) {
        throw new Error("The AI didn't find any results. Please try again");
    }

    // remove data with null lat or lng, or with 0 values
    response.data.locations = response.data.locations.filter(function (location) {
        return location.lat !== null && location.lng !== null && location.lat !== 0 && location.lng !== 0;
    });

    return response.data;
}
