import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;

function onInit() {
    // const urlParams = new URLSearchParams(window.location.search);
    // const myParam = urlParams.get('myParam');
    
    addEventListenrs();
    mapService.initMap()
        .then((gMap) => {
            console.log(gMap);
            gMap.addListener("click", (mapsMouseEvent) => {
                console.log(mapsMouseEvent.latLng) // Get the 'latLng'.
                let locName = locService.createLoc(mapsMouseEvent.latLng);
                mapService.addMarker(mapsMouseEvent.latLng, locName);
                renderlist()
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                console.log(urlParams)
                const lat = urlParams.get('lat');
                const lng = urlParams.get('lng');
                mapService.panTo(lat, lng)
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

    document.querySelector('.btn-my-location').addEventListener('click', (ev) => {
        getPosition()
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
    document.querySelector('.btn-copy-loc').addEventListener('click', (ev) => {
        let loc = mapService.getPos()
        let url = `https://odedalon.github.io/travel-tip/?lat=${loc.lat}&lng=${loc.lng}`
        onCopyLoc(url);
    })

}

function onCopyLoc(newClip) {
    navigator.clipboard.writeText(newClip).then(function () {
        alert('URL copied to clipboard.');
    }, function () {
        alert('Cannot copy URL.');
    });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    navigator.geolocation.getCurrentPosition(pos => {
        mapService.panTo(pos.coords.latitude, pos.coords.longitude)
    });
}

function renderlist() {
    locService.getLocs()
        .then(locs => {
            console.log('position is' + locs)
            var strHtmls = locs.map(function (loc) {
                return ` 
                  <div class="location">
                 <p>name:${loc.name}</p>
                 <p>lat:${loc.lat}</p>
                 <p>lng:${loc.lng}</p>
                 <p>weather:${loc.weather}</p>
                 <p>created:${loc.createdAt}</p>
                 <p>update:${loc.updatedAt}</p>
                 </div>
                    `})
            document.querySelector('.locations').innerHTML = strHtmls.join('');
        })
}
