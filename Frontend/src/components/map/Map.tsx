import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import Pin from './pin/Pin'

export type applicationMode = "EDIT" | "USE"

interface MapProps {
  readonly apiKey?: string
  readonly onCenterChanged: Function,
  readonly center?: { lat: number; lng: number }
  readonly editPolygons?: [{ lat: number; lng: number }],
  readonly editPolyCount?: number,
  readonly areaData?: [{}],
  readonly mode: applicationMode,
  readonly pinClickHandler: Function
}

const Map: React.FC<MapProps> = ({apiKey, onCenterChanged, center, editPolygons, editPolyCount, areaData, mode, pinClickHandler}) => {
  
  const _DELAY_TIME_: number = 1

  // refresh map in order to update the polygon data
  const [isRefreshingMap, setIsRefreshingMap] = React.useState<boolean>(false)
  const [polygons, setPolygons] = React.useState<[{ lat: number; lng: number }]>()
  
  const refreshMap = async () => { setIsRefreshingMap(true); setTimeout(() => { setIsRefreshingMap(false); }, _DELAY_TIME_); };
  
  const onChange = (e: any) => {    
    onCenterChanged(e["center"])
  }
  
  useEffect(() => {
    if ( mode === "USE" ) {
      let tempPolyData: any = []
      areaData?.forEach( (data: any) => {
        tempPolyData.push(JSON.parse(data.coords))
      })      
      setPolygons(tempPolyData)
    } else if ( mode === "EDIT" ) {
      setPolygons(editPolygons || undefined)
    }
    refreshMap();
  }, [areaData, editPolyCount, mode, editPolygons]);

  const handlePinClicked = (id: number) => {
    id && pinClickHandler(id)
  }


  const renderAreaInfo = () => {

    return areaData?.map( (data: any, id: number) => {      
      let avgLat: number = 0
      let avgLng: number = 0
      let parsedCoordData = JSON.parse(data.coords)

      parsedCoordData.forEach( (coords: { lat: number; lng: number }) => {
        avgLat += coords.lat
        avgLng += coords.lng
      })
      avgLat /= parsedCoordData.length;
      avgLng /= parsedCoordData.length;
      
      return (
        <Pin
          lat={avgLat} 
          lng={avgLng}
          id={data.ID}
          key={data.ID}
          clickHandler={handlePinClicked}
          />
      )
    });
  }

  return (
    <>
    {isRefreshingMap
      ? "Refreshing..." 
      : <GoogleMapReact      
        bootstrapURLKeys={{ key: apiKey ? apiKey : "" }}
        center={center ? center : { lat: 0, lng: 0 }}
        defaultZoom={17}
        onChange={(e) => onChange(e)}
        options={
          {styles: [{"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#e9e9e9"},{"lightness": 17}]},{"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},{"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"},{"lightness": 17}]},{"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#dedede"},{"lightness": 21}]},{"elementType": "labels.text.stroke", "stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"elementType": "labels.text.fill", "stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"elementType": "labels.icon", "stylers": [{"visibility": "off"}]},{"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]}]}
        }
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={ ({ map, maps }) => {
          if (polygons) {
            new maps.Polygon({
              paths: polygons,
              strokeColor: "#E66A73",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FCEDEE",
              fillOpacity: 0.35,
              map
            })
          }
        }}>
        {(mode === "USE") && polygons && renderAreaInfo()}
      </GoogleMapReact>
    }
    </>
  )
}

export default Map;
