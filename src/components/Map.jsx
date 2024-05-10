/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  useNavigate,
  useParams,
  useResolvedPath,
  useSearchParams,
} from "react-router-dom";

import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCity } from "../contexts/CityContext";
import { useGeolocation } from "../hooks/useGeoLoccation";
import Button from "./Button";
export default function Map() {
  const [mapPosition, setMapPosition] = useState([0, 30]);
  const [searchParams] = useSearchParams();
  const { cities, currentCity } = useCity();
  const {isLoading:isLoadingPosition,position:geolocationPosition,getPosition}=useGeolocation()


  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(
    function () {
      if (lat && lng) setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function(){
      if(geolocationPosition) setMapPosition([geolocationPosition.lat,geolocationPosition.lng])
    },
  [geolocationPosition]
  )
  // console.log([currentCity?.position.lat,currentCity.position.lng])

  return (
    <div className={styles.mapContainer}>
    {!geolocationPosition &&(<Button type='position' onclick={getPosition}>{isLoadingPosition ? "Loading..." : "Use your Position"}</Button>)}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles["map"]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities?.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
