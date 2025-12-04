import { Tooltip, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import IndiaGeoJson from "@mifin/public/IndiaGeoMapJson/IndiaGeoJson.json";
import IndiaGeoMapJson from "@mifin/pages/Dashboard/IndiaGeoMapJson/IndiaGeoJson.json";
import { getCorrectImageUrl2 } from "@mifin/utils/getCorrectImgUrl";

// const geoUrl =
//   "https://raw.githubusercontent.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json";
// const geoUrl =
//   "https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/india.geojson";
// Adjust the path to your local geojson file

type MarkerType = {
  markerOffset: number;
  name: string;
  coordinates: [number, number];
};

const markers: MarkerType[] = [
  {
    markerOffset: -10,
    name: "Andhra Pradesh",
    coordinates: [80.5167, 16.5417],
  },
  {
    markerOffset: -15,
    name: "Arunachal Pradesh",
    coordinates: [93.692, 27.102],
  },
  { markerOffset: -15, name: "Assam", coordinates: [91.7362, 26.1445] },
  { markerOffset: -15, name: "Bihar", coordinates: [85.1376, 25.5941] },
  { markerOffset: -15, name: "Goa", coordinates: [73.8278, 15.4909] },
  { markerOffset: -15, name: "Haryana", coordinates: [76.7794, 30.7333] },
  {
    markerOffset: -15,
    name: "Himachal Pradesh",
    coordinates: [77.1734, 31.1048],
  },
  { markerOffset: -15, name: "Jharkhand", coordinates: [85.3096, 23.3441] },
  { markerOffset: -15, name: "Kerala", coordinates: [76.9366, 8.5241] },
  { markerOffset: -15, name: "Maharashtra", coordinates: [72.8777, 19.076] },
  { markerOffset: -15, name: "Manipur", coordinates: [93.9368, 24.817] },
  { markerOffset: -15, name: "Meghalaya", coordinates: [91.8933, 25.5788] },
  { markerOffset: -15, name: "Mizoram", coordinates: [92.7176, 23.7271] },
  { markerOffset: -15, name: "Nagaland", coordinates: [94.1086, 25.6751] },
  { markerOffset: -15, name: "Odisha", coordinates: [85.8245, 20.2961] },
  { markerOffset: -15, name: "Rajasthan", coordinates: [75.7873, 26.9124] },
  { markerOffset: -15, name: "Sikkim", coordinates: [88.6138, 27.3314] },
  { markerOffset: -15, name: "Tripura", coordinates: [91.2868, 23.8315] },
  { markerOffset: -15, name: "Uttarakhand", coordinates: [78.0322, 30.3165] },
  { markerOffset: -15, name: "West Bengal", coordinates: [88.3639, 22.5726] },
  {
    markerOffset: 25,
    name: "Karnataka",
    coordinates: [76.5946, 11.9716],
  },
  {
    markerOffset: 25,
    name: "Gujarat",
    coordinates: [72.5714, 23.0225],
  },
  {
    markerOffset: -15,
    name: "Delhi",
    coordinates: [77.209, 28.6139],
  },
  {
    markerOffset: 25,
    name: "Uttar Pradesh",
    coordinates: [80.9462, 26.8467],
  },
  {
    markerOffset: 25,
    name: "Tamil Nadu",
    coordinates: [80.2707, 13.0827],
  },
  {
    markerOffset: -15,
    name: "Madhya Pradesh",
    coordinates: [77.4126, 23.2599],
  },
  {
    markerOffset: 25,
    name: "Chattisgarh",
    coordinates: [81.6296, 21.2514],
  },
  {
    markerOffset: -15,
    name: "Telangana",
    coordinates: [78.4867, 17.385],
  },
  {
    markerOffset: -15,
    name: "Punjab",
    coordinates: [76.7794, 30.7333],
  },
  {
    markerOffset: -15,
    name: "Jammu & Kashmir",
    coordinates: [75.1734, 33.1048],
  },
];

const MapChart = (props: any) => {
  const { dashboardData, mapAvailableState } = props;
  const geoUrl = getCorrectImageUrl2(IndiaGeoJson);
  const [markersState, setMarkersState] = useState<MarkerType[]>([]);
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const containerStyle = {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: isMobile ? "40vh" : "90vh",
  };

  useEffect(() => {
    const availableStates = mapAvailableState?.map(item => item?.state);
    const filteredMarkers = markers?.filter(marker =>
      availableStates?.includes(marker?.name)
    );
    setMarkersState(filteredMarkers);
  }, [mapAvailableState]);
  const placement = useBreakpointValue({ base: "top", md: "bottom" });

  return (
    <div style={containerStyle}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [78.9629, 22.5937], // Adjust center to focus on India
          scale: 1000, // Adjust scale for better view
        }}
        width={650} // Set explicit width
        height={300} // Set explicit height
        // style={{
        //   width: isMobile ? "370px" : "600px",
        //   height: isMobile ? "400px" : "800px",
        // }}
        style={{
          width: isMobile ? "370px" : "600px",
          height: isMobile ? "400px" : "800px",
          marginLeft: isMobile ? "-10px" : "-80px", // shifts the map left
        }}
      >
        <Geographies geography={IndiaGeoJson}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                // fill="#EAEAEC"
                fill="#FFFFFF"
                stroke="#D6D6DA"
              />
            ))
          }
        </Geographies>
        {markersState?.map(({ name, coordinates, markerOffset }) => (
          <Tooltip label={name} placement={placement} key={name}>
            <Marker key={name} coordinates={coordinates} data-tip={name}>
              {/* <circle r={5} fill="#F00" stroke="#fff" strokeWidth={2} /> */}
              <circle r={5} fill="#2F4CDD66" stroke="#2F4CDD" strokeWidth={2} />
              {/* <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
            >
              {name}
            </text> */}
            </Marker>
          </Tooltip>
        ))}
      </ComposableMap>
    </div>
  );
};

export default MapChart;
