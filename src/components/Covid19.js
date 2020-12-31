import React from 'react';
import Card from './Card';

const Covid19 = (props) => {
    const {
      totalConfirmed,
      totalRecovered,
      totalDeath,
      country
    } = props;

    return (
        <div>
            <div>
                <div>
                    <h1>WHO Coronavirus Disease (COVID-19).</h1>
                    <h1 style={{textTransform:'capitalize'}}>{country === '' ? 'World Wide Report' : country}</h1>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Card>
                            <span>Total Confirmed</span><br />
                            <span>{totalConfirmed}</span>
                        </Card>
                        <Card>
                            <span>Total Recovered</span><br />
                            <span>{totalRecovered}</span>
                        </Card>
                        <Card>
                            <span>Total Death</span><br />
                            <span>{totalDeath}</span>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Covid19;
