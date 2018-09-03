const keys = require('../config/keys');
const GoogleMapsAPI = require('googlemaps');
const publicConfig = {
    key: keys.MAPSKEY,
    stagger_time:       1000, // for elevationPath
    encode_polylines:   false,
    secure:             true // optional, set a proxy for HTTP requests
  };
const gmAPI = new GoogleMapsAPI(publicConfig);

exports.getStreetName = async (req, res) => {
    const postal_code = req.body.postal_code;
    const geocodeParams = {
        address: postal_code
    };
    let lat;
    let lng;
    await gmAPI.geocode(geocodeParams, async function(err, result){
        lat = result.results[0].geometry.location.lat;
        lng = result.results[0].geometry.location.lng;

        const reverseGeocodeParams = {
            latlng: `${lat},${lng}`
        }

        await gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
            const streetname = result.results[0].address_components[1].long_name;
            const city = result.results[0].address_components[2].long_name;
            const data = {
                streetname: streetname,
                city: city
            };
            res.send(data);
        });

    });
}