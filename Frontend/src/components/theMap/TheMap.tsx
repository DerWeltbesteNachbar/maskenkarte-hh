import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

interface TheMapProps {
  readonly onCenterChanged: Function,
  readonly polygons?: {},
  polyCount?: number
}

const TheMap: React.FC<TheMapProps> = ({onCenterChanged, polygons, polyCount}) => {

  // refresh map in order to update the polygon data
  const [isRefreshingMap, setIsRefreshingMap] = React.useState<boolean>(false)
  const refreshMap = async () => { setIsRefreshingMap(true); setTimeout(() => { setIsRefreshingMap(false); }, 100); };
  
  const onChange = (e: any) => {    
    onCenterChanged(e["center"])
  }

  useEffect(() => {   
    refreshMap();
  }, [polyCount]);

  return (
    isRefreshingMap ? <>Loading…</> : (
      <GoogleMapReact      
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={{ lat: 0, lng: 0 }}
        center={{ lat: 53.559383, lng: 9.937278 }}
        defaultZoom={13}
        onChange={(e) => onChange(e)}
        options={
          {styles: [{"featureType": "administrative", "elementType": "all", "stylers": [{"visibility": "on"}]},{"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#9d935e"}]},{"featureType": "administrative", "elementType": "labels.text.stroke", "stylers": [{"color": "#3f3b28"}]},{"featureType": "landscape", "elementType": "geometry.fill", "stylers": [{"color": "#5a5335"}]},{"featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{"color": "#4d4329"}]},{"featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{"visibility": "off"}]},{"featureType": "landscape.natural.terrain", "elementType": "geometry.fill", "stylers": [{"color": "#6e6950"}]},{"featureType": "poi", "elementType": "geometry.fill", "stylers": [{"color": "#372f14"}]},{"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]},{"featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"color": "#372f14"}]},{"featureType": "road", "elementType": "all", "stylers": [{"saturation": -100},{"lightness": 45},{"color": "#959358"}]},{"featureType": "road", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},{"featureType": "road.highway", "elementType": "all", "stylers": [{"visibility": "simplified"}]},{"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},{"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]},{"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#344144"}]}]}
        }
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={ ({map, maps}) => { { 

          polygons && (
            new maps.Polygon({
              paths: polygons,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              map
            })
          )

        }}}
      >        
      </GoogleMapReact>
    )
  )
}

export default TheMap;
