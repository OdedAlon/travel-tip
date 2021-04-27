import { storageService } from './storage.service.js'
const KEY = 'locations';

export const locService = {
    getLocs,
    saveLocs,
    createLoc
}

var locs = storageService.loadFromStorage(KEY);
if (locs === null) {
    locs = [
        { id: '01', name: 'Loc1', lat: 32.047104, lng: 34.832384, weather: '', createdAt: '', updatedAt: ''}, 
        { id: '02', name: 'Loc2', lat: 32.047104, lng: 34.832384, weather: '', createdAt: '', updatedAt: ''}
    ]
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function saveLocs(locs) {
    storageService.saveToStorage(KEY, locs);
}

function createLoc(latLng) {
    let id = `0${locs.length}`;
    let name = `Loc${locs.length}`;
    let lat = JSON.parse(JSON.stringify(latLng.toJSON(), null, 2)).lat;
    let lng = JSON.parse(JSON.stringify(latLng.toJSON(), null, 2)).lng;
    let createdAt = new Date();
    let loc = { id, name, lat, lng, weather: '', createdAt, updatedAt: ''};
    locs.push(loc);
    saveLocs();
    console.log(locs)
}