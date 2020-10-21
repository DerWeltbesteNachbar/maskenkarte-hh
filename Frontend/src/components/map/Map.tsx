import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

var CryptoJS = require("crypto-js");

interface TheMapProps {
  readonly onCenterChanged: Function,
  readonly polygons?: [[{ lat: number; lng: number }]],
  readonly polyCount?: number,
  readonly defaultCenter?: { lat: number; lng: number }
  readonly apiKey: string
}

const Pin = (props: any) => {

  const clickHandler = () => {
    //props.handleSetActivePost(props.id);
  }

  return (
    <div onClick={clickHandler}>
      123
    </div>
  )
}

const Map: React.FC<TheMapProps> = ({onCenterChanged, polygons, polyCount, defaultCenter, apiKey}) => {

  const _DELAY_TIME_: number = 1

  // refresh map in order to update the polygon data
  const [isRefreshingMap, setIsRefreshingMap] = React.useState<boolean>(false)
  
  const refreshMap = async () => { setIsRefreshingMap(true); setTimeout(() => { setIsRefreshingMap(false); }, _DELAY_TIME_); };
  
  const onChange = (e: any) => {    
    onCenterChanged(e["center"])
  }

  useEffect(() => {
    refreshMap();
  }, [polyCount]);

  const renderAreaInfo = () => {
    return polygons?.map( (data: [{ lat: number; lng: number }], id: number) => {
      let avgLat: number = 0
      let avgLng: number = 0
      data.forEach( (coords: { lat: number; lng: number }) => {
        avgLat += coords.lat
        avgLng += coords.lng
      })
      avgLat /= data.length;
      avgLng /= data.length;
      
      return (
        <Pin
          lat={avgLat} 
          lng={avgLng}/>          
      )
    });
  }

  return (
    <>
    {isRefreshingMap
      ? "Loading..." 
      : <GoogleMapReact      
        bootstrapURLKeys={{ key: apiKey }}
        center={defaultCenter ? defaultCenter : { lat: 0, lng: 0 }}
        defaultZoom={15}
        onChange={(e) => onChange(e)}
        options={
          {styles: [{"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#e9e9e9"},{"lightness": 17}]},{"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},{"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"},{"lightness": 17}]},{"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#dedede"},{"lightness": 21}]},{"elementType": "labels.text.stroke", "stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"elementType": "labels.text.fill", "stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"elementType": "labels.icon", "stylers": [{"visibility": "off"}]},{"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]}]}
        }
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={ ({ map, maps }) => {
          polygons && polygons.forEach( (coords, i) => {
            new maps.Polygon({
              paths: coords,
              strokeColor: "#E66A73",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FCEDEE",
              fillOpacity: 0.35,
              map
            })
          })
        }}>
        {polygons && renderAreaInfo()}
      </GoogleMapReact>
    }
    </>
  )
}

export default Map;
