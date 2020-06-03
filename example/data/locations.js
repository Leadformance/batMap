// Mock data ResultsPage

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

let locations = [];

for (let i = 0; i < 20; i++) {
    const location = {
        _id: "uuid" + i,
        localisation: {
            coordinates: {
                latitude: getRandomInRange(45, 46, 3),
                longitude: getRandomInRange(5, 7, 3),
            },
        },
    };

    locations.push(location);

    const li = document.createElement("li");
    li.classList.add("location");
    li.setAttribute("data-location", location._id);
    li.innerText = "Location " + (i + 1);
    document.querySelector("#locationsList").appendChild(li);
}
