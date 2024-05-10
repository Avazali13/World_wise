/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUrlPosition from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCity } from "../contexts/CityContext";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  const [lat, lng] = useUrlPosition();
  const [geoCodingerror, setGeoCodingerror] = useState("");
  const navigate=useNavigate()

  const {createCity,isLoading} =useCity()

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  useEffect(() => {
    async function fetchCityData() {
if(!lat ||!lng) return;

      try {
        setIsLoadingGeocoding(true);
        setGeoCodingerror('')

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode) throw new Error("There is no country bro 😉");
        // console.log(data);
        setCityName(data.city || data.locality || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingerror(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e){
    e.preventDefault();
  if(!cityName || !date) return;
  const newCity={
    cityName,
    date,
    notes,
    emoji,
    country,
    position:{lat,lng}

  }

  await createCity(newCity)
  navigate('/app/cities')
  }

  if(isLoadingGeocoding) return <Spinner/>
  if(!lat && !lng) return <Message message='Start by clicking somewhere on the map'/>
if(geoCodingerror) return <Message message={geoCodingerror}/>

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
       <DatePicker onChange={(date)=>setDate(date)} selected={date} dateFormat='dd/MM/yyyy'/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
