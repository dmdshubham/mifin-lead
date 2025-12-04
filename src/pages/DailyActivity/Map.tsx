import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Heading } from "@chakra-ui/react";
import L from "leaflet";
import MarkerIcon from "@mifin/assets/icons/marker.png";

const Map = (props: any) => {
  const { searchDailyReport, dailyReportList } = props;
  const combinedReports = [
    ...(dailyReportList || []),
    ...(searchDailyReport || []),
  ];

  const customIcon = L.icon({
    iconUrl: MarkerIcon,
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [1, -14],
  });

  return (
    <>
      <Heading as="h2" fontWeight="bold" my={4} size="md">
        Map (Daily Activity)
      </Heading>
      <MapContainer
        style={{ height: "64vh" }}
        center={[28.7041, 77.1025]}
        zoom={8}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {combinedReports?.map((location: any, index: number) => (
          <Marker
            key={index}
            icon={customIcon}
            position={[
              parseFloat(location.actionLatitude),
              parseFloat(location.actionLongitude),
            ]}
          >
            {/* <Popup>
              <strong>User ID:</strong> {location.userId}
              <br />
              <strong>Disposition:</strong> {location.dispositionName}
              <br />
              <strong>Action:</strong> {location.actionName}
            </Popup> */}
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Map;
