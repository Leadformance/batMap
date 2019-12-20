// Mock data ResultsPage

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

// eslint-disable-next-line no-unused-vars
const locations = [];

//eslint-disable-next-line no-magic-numbers
for (let i = 0; i < 20; i++) {
    const location = {
        _id: `uuid${i}`,
        localisation: {
            coordinates: {
                latitude: getRandomInRange(45, 46, 3), //eslint-disable-line no-magic-numbers
                longitude: getRandomInRange(5, 7, 3) //eslint-disable-line no-magic-numbers
            }
        }
    };

    locations.push(location);

    const li = document.createElement('li');
    li.classList.add('location');
    li.setAttribute('data-location', location._id);
    li.innerText = `Location ${i + 1}`;
    document.querySelector('#locationsList').appendChild(li);
}
