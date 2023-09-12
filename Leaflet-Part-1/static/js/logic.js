// api endpoint to get all the earth quakes
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// make the json get call using d3 to get the data from the url 
d3.json(url).then(function (data) {
    // call the intialize map function to create the map and its markers 
    intializeMap(data.features)
});


// create the legend for the map and set its position to bottom right
let legend = L.control({ position: 'bottomright' });
// set the on add function of legend this is called when the legend is added on the map 
legend.onAdd = function () {
    console.log(legend)
    // create a div on the map having class legend
    return L.DomUtil.create('div', 'legend');
};


// function for creating markers
function getMarkers(features) {
    let markers = [];

    // Loop through features, and create the markes with respecitve color and radius.
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];

        // create options dictionary for marker
        let options = {
            // set the radius of the marker and multiply it by 4 so even if the earthquake magnitude = .55 can be seen with a small marker
            radius: feature.properties.mag * 4,
            // set the color inside of the marker
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: chooseColor(feature.geometry.coordinates[2]),
            // set the opacity of the marker
            opacity: 1,
            fillOpacity: 1
        }

        // create the lat long, and altitude for the marker a
        const latlng = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0], alt: feature.geometry.coordinates[2] }
        // bind popup creates the popup when any marker is clicked with its relevent data.
        // also add that marker to the list of markers
        markers.push(L.circleMarker(latlng, options).bindPopup(`
        <h3><b>Title:</b> ${feature.properties.title} </h3><hr>
        <p><b>Place:</b> ${feature.properties.place}</p>
        <p><b>Time:</b> ${new Date(feature.properties.time)}</p>
        <p><b>Magnitude:</b> ${feature.properties.mag}</p>
        <p><b>Depth:</b> ${feature.geometry.coordinates[2]}</p>
        <p><b>Number of "Felt" Reports:</b> ${feature.properties.felt}`)
        )
    }
    // create a layer group of markers and return it
    return L.layerGroup(markers);
}


function intializeMap(features) {
    // Adding a street tile layer (the background map image) to our map
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    // function that will create all the markers of the features on the map
    var markers = getMarkers(features);

    // Create a maps object with each map.
    let maps = {
        Street: street
    };

    // Create our map, giving it the streetmap , markers layers to display on load.
    let myMap = L.map("map", {
        center: [
            0, -0
        ],
        zoom: 3,
        layers: [street, markers]
    });
    // Add the legend to the map.
    legend.addTo(myMap);
    // update the legend by calling the update legend function
    updateLegend();
}


// this function updates the legend on the map
function updateLegend() {
    // select the legend div from the html document and update its inner html
    document.querySelector(".legend").innerHTML = [
        "<p>Earthquick depth: </p>",
        // set the data value from -10 to 10 and set the background color to the color of the marker using the chooseColor function
        `<p class='colorP'><span class="colorSpan" style="background-color:${chooseColor(1)}"></span> <span>-${10} - ${10}</span></p>`,
        `<p class='colorP'><span class="colorSpan" style="background-color:${chooseColor(11)}"></span> <span>${10} - ${30}</span></p>`,
        `<p class='colorP'><span class="colorSpan" style="background-color:${chooseColor(31)}"></span> <span>${30} - ${50}</span></p>`,
        `<p class='colorP'><span class="colorSpan" style="background-color:${chooseColor(51)}"></span> <span>${50} - ${70}</span></p>`,
        `<p class='colorP'><span class="colorSpan" style="background-color:${chooseColor(71)}"></span> <span>${70} - ${90}</span></p>`,
        `<p class='colorP'><span class="colorSpan" style="background-color:${chooseColor(91)}"></span> <span>${90} +</span></p>`
    ].join("");
}


function chooseColor(depth) {
    // check the depth of the earthquake and return the cooresponding color
    // if less than 10 
    // than between 10 and 30
    // than between 30 and 50
    // than between 50 and 70
    // than between 70 and 90
    // than greater than 90
    if (depth < 10) return "#8CE917";
    else if (depth < 30) return "#D2ED17";
    else if (depth < 50) return "#FDDB13";
    else if (depth < 70) return "#F3B00C";
    else if (depth < 90) return "#EE984C";
    else return "#E45360";
}

