import { useEffect, useState } from 'react'
import axios from 'axios'

const Countries = (props) => {

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const [weather, setWeather] = useState(null)

  const countriesToShow = props.countries.filter(country => 
    country.name.common.toLowerCase().includes(props.name.toLowerCase())
  )

  useEffect(() => {
  if (countriesToShow.length === 1) {
    const country = countriesToShow[0]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
        console.log(response.data)

      })
    }
  }, [props.name])

  if (countriesToShow.length >= 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (countriesToShow.length === 1) {

    return (
      <div>
        {countriesToShow.map(country => 
          <div key={country.name.common}>

            <h1>{country.name.common}</h1>
            <p>Capital {country.capital[0]}</p>
            <p>Area {country.area}</p>

            <h1>Languages</h1>
            {Object.values(country.languages).map(language =>
              <p key={language}>{language}</p>
            )}

            <img src={country.flags.png} />

            <h1>Wheather in {country.capital[0]}</h1>

            <p>Temperature {weather?.main?.temp} Celcius</p>

            <img src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`} />

            <p>Wind {weather?.wind?.speed} m/s</p>

          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {countriesToShow.map(country => 
        <p key={country.name.common}>{country.name.common} 
          <button onClick={() => props.setName(country.name.common)}>Show</button>
        </p>
      )}
    </div>
  )

}



const App = () => {

  const [name, setName] = useState("")
  const [countries, setCountries] = useState([])
  
  useEffect(() => {

  axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      setCountries(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <div>
      <form action="">
        find countries
        <input
          onChange={(e) => setName(e.target.value)}
        />
      </form>
      
      <Countries 
        name={name}
        setName={setName}
        countries={countries}
      />

    </div>
  )
}

export default App
