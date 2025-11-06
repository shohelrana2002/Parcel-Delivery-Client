import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import locations from "../../data/location.json";
import MapActions from "./MapActions";
const notFound =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPc3nCMbgH8lElexAa_bditHj6ihuf-ZqUlA&s";

// default marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Coverage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(locations);
  const [flyTo, setFlyTo] = useState(null);

  // safe filter: handle missing covered_area etc.
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === "") {
      setFiltered(locations);
      setFlyTo(null);
      return;
    }

    const result = locations.filter((loc) => {
      const region = (loc.region || "").toLowerCase();
      const district = (loc.district || "").toLowerCase();
      const city = (loc.city || "").toLowerCase();
      const coveredList = Array.isArray(loc.covered_area)
        ? loc.covered_area.map((i) => (i || "").toLowerCase())
        : [];

      return (
        region.includes(value) ||
        district.includes(value) ||
        city.includes(value) ||
        coveredList.some((a) => a.includes(value))
      );
    });

    setFiltered(result);

    if (result.length === 1) {
      setFlyTo(result[0]);
    } else {
      setFlyTo(null);
    }
  };

  // compute bounds for filtered points
  const bounds = useMemo(() => {
    if (!filtered || filtered.length === 0) return null;
    const latlngs = filtered
      .filter(
        (f) => typeof f.latitude === "number" && typeof f.longitude === "number"
      )
      .map((f) => [f.latitude, f.longitude]);
    return latlngs.length ? L.latLngBounds(latlngs) : null;
  }, [filtered]);

  // optional: quick "go to first result" button
  const goToFirst = () => {
    if (filtered.length > 0) {
      setFlyTo(filtered[0]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-xl text-gray-600">
        Total Locations: {filtered.length} available
      </p>

      <div className="flex justify-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="🔍 Search division / district / area (e.g. Dhaka, Uttara)"
          className="input input-bordered w-full max-w-lg text-sm rounded-lg shadow"
        />
        <button
          onClick={() => {
            setSearchTerm("");
            setFiltered(locations);
            setFlyTo(null);
          }}
          className="btn btn-ghost"
        >
          Clear
        </button>

        <button onClick={goToFirst} className="btn btn-primary">
          Go to first
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto h-[600px] rounded-xl shadow-md overflow-hidden">
        <MapContainer
          center={[23.7806, 90.4075]}
          zoom={10}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapActions flyTo={flyTo} bounds={bounds} />

          <MarkerClusterGroup>
            {filtered.map((loc, idx) => {
              const lat = Number(loc.latitude);
              const lng = Number(loc.longitude);
              if (Number.isNaN(lat) || Number.isNaN(lng)) return null; // skip invalid
              return (
                <Marker
                  key={idx}
                  position={[lat, lng]}
                  icon={new L.Icon.Default()}
                >
                  <Popup className="max-w-xs">
                    <div className="text-sm">
                      <h3 className="font-semibold">
                        {loc.city || "Unknown"}, {loc.district || "Unknown"}
                      </h3>
                      <p className="text-xs">Region: {loc.region || "—"}</p>
                      <p className="text-xs">
                        Status:{" "}
                        <span
                          className={
                            loc.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {loc.status || "—"}
                        </span>
                      </p>
                      <div className="mt-2">
                        <strong className="text-xs">Covered areas:</strong>
                        <ul className="list-disc ml-4 text-xs">
                          {(Array.isArray(loc.covered_area)
                            ? loc.covered_area
                            : []
                          ).map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <img
                          src={loc.flowchart || notFound}
                          alt="flowchart"
                          className="w-full h-24 object-contain rounded"
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
