import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


window.onload = onInit;

function onInit() {
    addEventListenrs();
    mapService.initMap()
        .then((gMap) => {
            console.log(gMap);
            gMap.addListener("click", (mapsMouseEvent) => {
                console.log(mapsMouseEvent.latLng) // Get the 'latLng'.
                mapService.addMarker(mapsMouseEvent.latLng);
                locService.createLoc(mapsMouseEvent.latLng);
            })
        })
        .catch(() => console.log('Error: cannot init map'));
}

function addEventListenrs() {
    document.querySelector('.btn-pan').addEventListener('click', (ev) => {
        console.log('Panning the Map');
        mapService.panTo(35.6895, 139.6917);
    })
    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        console.log('Adding a marker');
        mapService.addMarker({ lat: 32.0759914, lng: 34.9120554 });
    })
    document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
        locService.getLocs()
            .then(locs => {
                console.log('Locations:', locs)
                document.querySelector('.locs').innerText = JSON.stringify(locs)
            })

    })
    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                console.log('User position is:', pos.coords);
                document.querySelector('.user-pos').innerText =
                    `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })
   
    // mapService.gMap.addEventListener('click', (ev) => {
    //     console.log(ev.latLng)
    // })
    // const map = new google.maps.Map(document.getElementById("map")
    // map.addListener("click", (mapsMouseEvent) => {
    //     // Create a new InfoWindow.
    //     infoWindow = new google.maps.InfoWindow({
    //       position: mapsMouseEvent.latLng,
    //     });
    //     infoWindow.setContent(
    //       JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    //     );
    //     infoWindow.open(map);
    //   });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}