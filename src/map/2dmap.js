import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import countryBorder from "../alljsonfile/countriesborder.json";
import countriesInfo from "../alljsonfile/countryInfo.json";

const worldPopulation = 7818939000;

const InfoBox = ({ selectedFeature, modType }) => {
  if (!selectedFeature) {
    return null; // If no feature is selected, don't render the info box
  }

  // Extract the desired information from the selected feature
  const {
    ISO_A2,
    ISO_A3,
    NAME,
    ADMIN,
    POP_EST,
    POP_YEAR,
    GDP_MD,
    GDP_YEAR,
    ECONOMY,
    INCOME_GRP,
    LABEL_Y,
    LABEL_X,
    SUBREGION,
  } = selectedFeature.properties;

  // Get country information from countriesInfo based on ISO_A2 code
  const countryInfo = countriesInfo[ISO_A2];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        zIndex: 999,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "4px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <center>
        {ISO_A2 !== "-99" ? (
          <img
            src={`https://flagcdn.com/w80/${ISO_A2.toLowerCase()}.png`}
            alt={`${ADMIN} Flag`}
            className="mx-auto"
          />
        ) : null}
        <h1 style={{ fontSize: "24px" }}>
          <b>{NAME + " ( " + ISO_A3 + " )"}</b>
        </h1>
        {modType === "population" && (
          <>
            <p><b>Population Year: </b>{POP_YEAR}</p>
            <p><b>Population:</b> {POP_EST.toLocaleString()}</p>
            <p>
              <b> Population Ratio:</b> {"% " + ((POP_EST / worldPopulation) * 100).toFixed(3)}
            </p>
          </>
        )}
        {modType === "finance" && (
          <>
            <p><b>GDP Year:</b> {GDP_YEAR}</p>
            <p><b>ECONOMY:</b> {ECONOMY}</p>
            <p><b>INCOME_GRP:</b> {INCOME_GRP}</p>
            <p><b>GDP:</b> {GDP_MD.toLocaleString() + " Million $"}</p>
            {countryInfo && (
              <>
                <p><b>Currency:</b> {countryInfo.currency.join(", ")}</p>
              </>
            )}
            <p>
              <b>GDP Per Capita:</b> {((GDP_MD * 1000000) / POP_EST).toLocaleString() + " $"}
            </p>
          </>
        )}
        {!modType && countryInfo && (
          <>
            <p><b>Native: </b>{countryInfo.native}</p>
            <p><b>Region: </b>{SUBREGION}</p>
            <p><b>Capital: </b>{countryInfo.capital}</p>
            <p><b>Phone: </b> {"+" + countryInfo.phone.join(", ")}</p>
            <p><b>Languages: </b>{countryInfo.languages.join(", ")}</p>
            <p><b>Coordinates: </b>{LABEL_Y + ` "N, ` + LABEL_X + ` "E `}</p>
          </>
        )}
      </center>
    </div>
  );
};

const Map = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [modType, setModType] = useState("population");
  const [isBasicInfoClicked, setBasicInfoClicked] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [matchedCountries, setMatchedCountries] = useState([]);

  const calculateFillOpacity = (feature) => {
    if (isBasicInfoClicked) {
      return 0.4;
    } else if (modType === "population") {
      const population = feature.properties.POP_EST;
      return (population / worldPopulation) * 10;
    } else if (modType === "finance") {
      const population = feature.properties.POP_EST;
      const GDP = feature.properties.GDP_MD;
      return (GDP / Math.max(1e5, population)) * 10;
    }
  };

  const handleOpacityTypeChange = (type) => {
    setModType(type);
    setBasicInfoClicked(false);
  };

  const handleBasicInfoClick = () => {
    setBasicInfoClicked(true);
    setModType(null);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);

    if (value.length >= 2) {
      const matched = countryBorder.features.filter((feature) => {
        const name = feature.properties.NAME.toLowerCase();
        return name.includes(value.toLowerCase());
      });

      setMatchedCountries(matched);
    } else {
      setMatchedCountries([]);
    }
  };

  const handleCountryClick = (feature) => {
    setSelectedFeature(feature);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 999,
        }}
      >
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleOpacityTypeChange("population")}
        >
          Population
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleOpacityTypeChange("finance")}
        >
          Finance
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBasicInfoClick}
        >
          Basic Country Information
        </button>
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 999 }}>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search country..."
          className="bg-white rounded-md px-2 py-1 outline-none"
        />
      </div>
      <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 999 }}>
        {matchedCountries.length > 0 && searchValue.length >= 2 && (
          <div
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
            {matchedCountries.map((feature) => (
              <div
                key={feature.properties.ISO_A2}
                onClick={() => handleCountryClick(feature)}
                style={{ cursor: "pointer" }}
              >
                {feature.properties.NAME}
              </div>
            ))}
          </div>
        )}
      </div>



      <MapContainer
        center={[0, 0]}
        zoom={3}
        style={{ height: "100vh", width: "100%" }}
        zoomControl={false}
        maxBounds={[
          [84.67351256610522, -174.0234375],
          [-80.995311187950925, 223.2421875],
        ]}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          noWrap={true}
          maxZoom={6}
          minZoom={2}
        />
        <GeoJSON
          data={countryBorder}
          style={(feature) => ({
            fillColor:
              feature === selectedFeature
                ? "steelblue"
                : isBasicInfoClicked
                  ? "gray"
                  : modType === "finance"
                    ? "green"
                    : "orange",
            color: "black",
            weight: 1,
            fillOpacity:
              feature === selectedFeature || isBasicInfoClicked
                ? 0.8
                : calculateFillOpacity(feature),
            zIndex: feature === selectedFeature ? 1 : 0,
          })}
          onEachFeature={(feature, layer) => {
            layer.on({
              mouseover: () => {
                setSelectedFeature(feature);
                layer.setStyle({
                  fillColor: "steelblue",
                  fillOpacity: 0.8,
                  zIndex: 1,
                });
              },
              mouseout: () => {
                setSelectedFeature(null);
                layer.setStyle({
                  fillColor: isBasicInfoClicked
                    ? "gray"
                    : modType === "finance"
                      ? "green"
                      : "gray",
                  fillOpacity: calculateFillOpacity(feature),
                  zIndex: 0,
                });
              },
              click: () => {
                handleCountryClick(feature);
              },
            });
          }}
        />
      </MapContainer>
      <InfoBox selectedFeature={selectedFeature} modType={modType} />
    </>
  );
};

export default Map;
