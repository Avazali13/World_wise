/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */

import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import Spinner from "./Spinner"
import Message from "./Message"
import { useCity } from '../contexts/CityContext'


function CountryList() {

  const {isLoading,cities}=useCity()


  if (isLoading) return <Spinner/>
 if(!cities.length) return <Message message='ede olke elave elededeee qagasssss'/>

let country=cities.reduce((arr,city)=>{
if(!arr.map(el=>el.country).includes(city.country)) return [...arr,{country:city.country,emoji:city.emoji}]
else return arr
},[])

    return (

        <ul className={styles.countryList}>
          {country.map(country=><CountryItem country={country} key={country.country} />)}
        </ul>

    )
}



export default CountryList
