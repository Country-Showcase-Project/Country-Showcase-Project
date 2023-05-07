import React, { useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';

import countries from '../alljsonfile/countriesborder.json'
import countriesInfo from '../alljsonfile/countryInfo.json'

import earthBlueMarble from '../assets/images/earth/earth-blue-marble.jpg'
import nightSky from '../assets/images/earth/night-sky.png'

import "../styles/mapStyle.css"


var countriesData, countriesInfoData;

if (!localStorage.getItem('myData')) {
    const data = {
        countries: countries,
        countriesInfo: countriesInfo
    };
    const jsonData = JSON.stringify(data);
    localStorage.setItem('myData', jsonData);
    if (localStorage.getItem('myData')) {
        window.location.reload()
        console.log("refresh")
    }
}
else {
    const jsonData = localStorage.getItem('myData');
    const data = JSON.parse(jsonData);
    countriesData = data.countries;
    countriesInfoData = data.countriesInfo;
}

const GlobeVar = React.memo(() => {
    const worldPopulation = 7818939000;
    const [hoverD, setHoverD] = useState();
    const [colorScale, setColorScale] = useState(() => d3.scaleSequentialSqrt(d3.interpolateGreens));

    const [getVal, setGetVal] = useState(() => feat => 0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    const handleSearchChange = useCallback(event => {
        const inputValue = event.target.value;
        setSearchQuery(inputValue);

        if (inputValue.length >= 2) {
            const filteredResults = countriesData.features.filter(
                feat => feat.properties.ADMIN.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    }, [countriesData]);

    const handleSearchSubmit = useCallback(event => {
        event.preventDefault();
        const searchResult = countriesData.features.find(
            feat => feat.properties.ADMIN.toLowerCase() === searchQuery.toLowerCase()
        );
        if (searchResult) {
            setHoverD(searchResult);
        } else {
            setHoverD(null);
        }
    }, [countriesData, searchQuery]);

    const [polygonLabelContent, setPolygonLabelContent] = useState(() => feat => {
        return `
        <div style="background-color: rgba(0, 0, 0, 0.9); padding: 10px; text-align: center;">
            ${feat.properties.ISO_A2 !== "-99" ? `<img src="https://flagcdn.com/w80/${feat.properties.ISO_A2.toLowerCase()}.png" alt="${feat.properties.ADMIN} Flag" class="mx-auto">` : ""}
            <br/>
            <h2 class="text-3xl">${feat.properties.ADMIN} (${feat.properties.ISO_A3})</h2> 
            ${feat.properties.ISO_A2 !== "-99" ? ` <b>Native:</b> <i> ${countriesInfoData[feat.properties.ISO_A2].native}<br/>` : ""}</i>
            <b>Region:</b> <i>${feat.properties.SUBREGION} </i>
            <br/>
            ${feat.properties.ISO_A2 !== "-99" ? ` <b>Capital:</b> <i> ${countriesInfoData[feat.properties.ISO_A2].capital}<br/>` : ""}</i>
            ${feat.properties.ISO_A2 !== "-99" ? ` <b>Phone:</b> <i>+${countriesInfoData[feat.properties.ISO_A2].phone}<br/>` : ""}</i>
            ${feat.properties.ISO_A2 !== "-99" ? ` <b>Language:</b> <i>${countriesInfoData[feat.properties.ISO_A2].languages.toString().toUpperCase()}<br/>` : ""}</i>
            <b>Coordinate:</b> <i>${feat.properties.LABEL_Y} "N, ${feat.properties.LABEL_X} "E</i>
            <br/>    
        </div>
        `;
    });

    const populationButton = useCallback(() => {
        setGetVal(() => feat => ((feat.properties.POP_EST) / worldPopulation) * 15);
        setColorScale(() => d3.scaleSequentialSqrt(d3.interpolateGreens))
        setPolygonLabelContent(() => feat => {
            return `
                <div style="background-color: rgba(0, 0, 0, 0.9); padding: 10px; text-align: center;">
                    ${feat.properties.ISO_A2 !== "-99" ? `<img src="https://flagcdn.com/w80/${feat.properties.ISO_A2.toLowerCase()}.png" alt="${feat.properties.ADMIN} Flag" class="mx-auto">` : ""}   
                    <br />
                    <h2 class="text-3xl">${feat.properties.ADMIN} (${feat.properties.ISO_A3})</h2> 
                    <b>Population Year:</b> <i>${feat.properties.POP_YEAR}</i>
                    <br/>
                    <b>Population:</b> <i>${feat.properties.POP_EST.toLocaleString()}</i>
                    <br/>
                    <b>Population Ratio:</b> <i>%${(feat.properties.POP_EST / worldPopulation * 100).toFixed(3)}</i>
                </div>
            `;

        });
    }, [setGetVal, setColorScale, setPolygonLabelContent, worldPopulation]);
    const financeButton = useCallback(() => {
        setGetVal(() => feat => (feat.properties.GDP_MD / Math.max(1e5, feat.properties.POP_EST) * 2));
        setColorScale(() => d3.scaleSequentialSqrt(d3.interpolateYlOrRd))
        setPolygonLabelContent(() => feat => {
            return `
                <div style="background-color: rgba(0, 0, 0, 0.9); padding: 10px; text-align: center;">
                    ${feat.properties.ISO_A2 !== "-99" ? `<img src="https://flagcdn.com/w80/${feat.properties.ISO_A2.toLowerCase()}.png" alt="${feat.properties.ADMIN} Flag" class="mx-auto">` : ""}
                    <br/>
                    <h2 class="text-3xl">${feat.properties.ADMIN} (${feat.properties.ISO_A3})</h2> 
                    <b>GDP Year:</b> <i>${feat.properties.GDP_YEAR}</i>
                    <br/>
                    <b>ECONOMY:</b> <i>${feat.properties.ECONOMY}</i>
                    <br/>
                    <b>INCOME GROUP:</b> <i>${feat.properties.INCOME_GRP}</i>
                    <br/>
                    <b>GDP: </b><i>${feat.properties.GDP_MD.toLocaleString()}</i> Million $
                    <br/>
                    ${feat.properties.ISO_A2 !== "-99" ? ` <b>Currency:</b> <i>${countriesInfoData[feat.properties.ISO_A2].currency}<br/>` : ""}</i>
                    <b>GDP Per Capita:</b> <i>${((feat.properties.GDP_MD) * 1000000 / feat.properties.POP_EST).toLocaleString()}</i> $
                </div>
            `;
        });
    }, [setGetVal, setColorScale, setPolygonLabelContent]);
    const basicInfoButton = useCallback(() => {
        setGetVal(() => feat => 0);
        setColorScale(() => d3.scaleSequentialSqrt(d3.interpolatePurples))
        setPolygonLabelContent(() => feat => {
            return `
            <div style="background-color: rgba(0, 0, 0, 0.9); padding: 10px; text-align: center;">
                 ${feat.properties.ISO_A2 !== "-99" ? `<img src="https://flagcdn.com/w80/${feat.properties.ISO_A2.toLowerCase()}.png" alt="${feat.properties.ADMIN} Flag" class="mx-auto">` : ""}
                <br/>
                <h2 class="text-3xl">${feat.properties.ADMIN} (${feat.properties.ISO_A3})</h2> 
                ${feat.properties.ISO_A2 !== "-99" ? ` <b>Native:</b> <i> ${countriesInfoData[feat.properties.ISO_A2].native}<br/>` : ""}</i>
                <b>Region:</b> <i>${feat.properties.SUBREGION} </i>
                <br/>
                ${feat.properties.ISO_A2 !== "-99" ? ` <b>Capital:</b> <i> ${countriesInfoData[feat.properties.ISO_A2].capital}<br/>` : ""}</i>
                ${feat.properties.ISO_A2 !== "-99" ? ` <b>Phone:</b> <i>+${countriesInfoData[feat.properties.ISO_A2].phone}<br/>` : ""}</i>
                ${feat.properties.ISO_A2 !== "-99" ? ` <b>Language:</b> <i>${countriesInfoData[feat.properties.ISO_A2].languages.toString().toUpperCase()}<br/>` : ""}</i>
                <b>Coordinate:</b> <i>${feat.properties.LABEL_Y} "N, ${feat.properties.LABEL_X} "E</i>
                <br/>    
            </div>
        `;

        })
    }, [setGetVal, setColorScale, setPolygonLabelContent]);
    return (
        (countriesData && countriesInfoData)
            ? (
                <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>
                        <button onClick={populationButton} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Population
                        </button>
                        <button onClick={financeButton} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Finance
                        </button>
                        <button onClick={basicInfoButton} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                            Basic Country Information
                        </button>
                    </div>
                    <form onSubmit={handleSearchSubmit} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search country..."
                            className="bg-white rounded-md px-2 py-1 outline-none"
                        />
                    </form>
                    <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 1 }}>
                        {searchResults.map(result => (
                            <div
                                key={result.properties.ISO_A2}
                                onClick={() => setHoverD(result)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    padding: '4px',
                                    marginBottom: '4px',
                                    width: '200px', // Sabit bir genişlik değeri belirtin
                                    overflow: 'hidden', // Metinlerin taşmasını engellemek için
                                    whiteSpace: 'nowrap', // Metinlerin satır atlamasını engellemek için
                                    textOverflow: 'ellipsis' // Metinlerin aşırı uzamasını önlemek için
                                }}
                            >
                                {result.properties.ADMIN}
                            </div>
                        ))}
                    </div>



                    <Globe
                        globeImageUrl={earthBlueMarble}
                        backgroundImageUrl={nightSky}
                        objectLabel="name"
                        objectLat="lat"
                        objectLng="lng"
                        objectAltitude="alt"
                        polygonsData={countriesData.features.filter(d => d.properties.ISO_A2)}
                        polygonAltitude={d => d === hoverD ? 0.03 : 0.06}
                        polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}
                        polygonSideColor={() => 'rgba(44, 57, 127, 0.65)'} // sınırların altındaki gölgeler
                        polygonStrokeColor={() => 'black'}
                        onPolygonHover={d => {
                            setHoverD(d);
                        }} // ülkelerin üzerine gelince yapılması gereken işlemi yapar
                        polygonsTransitionDuration={300} // ne kadar yukarda kalsın
                        animateIn={true}
                        animateOut={true}
                        polygonLabel={polygonLabelContent}
                        width={window.innerWidth}
                        height={window.innerHeight * 9.7 / 10}
                    />
                </div>
            ) : (
                null
            )
    );
});

export default GlobeVar;