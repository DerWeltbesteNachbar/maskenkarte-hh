export const getUserGPSCoordinates = (callback: Function) => {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(function(position) {
			const user_position: {lat: number; lng: number } = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
			callback(user_position);
		}, function(errorcode) { 
			console.log("GPS ERROR:" + errorcode.code)
			callback(undefined);
		}, {
			enableHighAccuracy: true,
			maximumAge: 15000,
			timeout: 30000,
		})
	} else {
		callback(undefined);
	}
}


