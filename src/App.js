import React, { useEffect, useState } from 'react';
import './App.css';
import LineGraph from './components/LineGraph';
import Covid19 from './components/Covid19';
import axios from './axios';
import { StepLabel } from '@material-ui/core';

function App() {

  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalRecovered, setTotalRecovered] = useState(0);
  const [totalDeath, setTotalDeath] = useState(0);
  const [loading, setLoading] = useState(false);
  const [covid19, setCovid19] = useState({});
  const [country, setCountry] = useState('');
  const [days, setDays] = useState(7);
  const [coronaCountAr, setCoronaCountAr] = useState([]);
  const [label, setLabel] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get('/summary')
      .then(res => {
        setLoading(false);

        if (res.status === 200) {
          setTotalConfirmed(res.data.Global.TotalConfirmed);
          setTotalRecovered(res.data.Global.NewRecovered);
          setTotalDeath(res.data.Global.TotalDeaths);
          setCovid19(res.data);
        }

        console.log(res);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`;
    const _date = d.getDate();
    return `${year}-${month}-${_date}`;
  }

  const countryHandler = (e) => {
    setCountry(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - days));
    //console.log(from,to);
    getCoronaReport(e.target.value, from, to);
  }

  const daysHandler = (e) => {
    setDays(e.target.value);
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - e.target.value));
    getCoronaReport(country,from,to);
  }

  const getCoronaReport = (countrySlug, from, to) => {
    axios.get(`/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`)
      .then(res => {
        console.log(res);

        const yAxisCorona = res.data.map(d => d.Cases);
        const xAxisLabel = res.data.map(d => d.Date);
        const covidDetails = covid19.Countries.find(country => country.Slug === countrySlug);
        setCoronaCountAr(yAxisCorona);
        setTotalConfirmed(covidDetails.TotalConfirmed);
        setTotalRecovered(covidDetails.TotalRecovered);
        setTotalDeath(covidDetails.TotalDeaths);
        setLabel(xAxisLabel);
      })
      .catch(error => {
        console.log(error);
      })
  }

  if (loading) {
    <p>Feteching Data...!</p>
  }

  return (
    <div className="App">
      <Covid19
        totalConfirmed={totalConfirmed}
        totalRecovered={totalRecovered}
        totalDeath={totalDeath}
        country={country}
      />

      <div>
        <select value={country} onChange={countryHandler}>
          <option value="">Select Country</option>
          {
            covid19.Countries && covid19.Countries.map(
              country => <option key={country.Slug} value={country.Slug}>{country.Country}</option>
            )
          }
        </select>

        <select value={days} onChange={daysHandler}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <LineGraph
        yAxis={coronaCountAr}
        label={label}
      />
    </div>
  );
}

export default App;
