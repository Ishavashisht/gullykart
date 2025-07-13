import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState } from "react";

/* ──────────────────────────
   1. Hard-coded demo data
   ────────────────────────── */
type CityKey = "Lucknow" | "Kolkata" | "Jaipur";

const cityTrendMap: Record<
  CityKey,
  { lat: number; lng: number; festivals: string[]; items: string[] }
> = {
  Lucknow: {
    lat: 26.8467,
    lng: 80.9462,
    festivals: ["Diwali", "Eid"],
    items: ["Zari Sarees", "White Kurtas"],
  },
  Kolkata: {
    lat: 22.5726,
    lng: 88.3639,
    festivals: ["Durga Puja", "Eid"],
    items: ["Cotton Sarees", "Hand-loom Dupattas"],
  },
  Jaipur: {
    lat: 26.9124,
    lng: 75.7873,
    festivals: ["Teej", "Gangaur"],
    items: ["Block-print Suits", "Lehenga"],
  },
};

export default function TrendMap() {
  /* 2. Load Google-Maps script */
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY as string,
  });

  const [activeCity, setActiveCity] = useState<CityKey | null>(null);
  const cities = useMemo(
    () => Object.entries(cityTrendMap) as [CityKey, (typeof cityTrendMap)[CityKey]][],
    [],
  );

  if (!isLoaded)
    return <p className="text-center text-sm text-muted-foreground">Loading map…</p>;

  return (
    <GoogleMap
      zoom={5}
      center={{ lat: 23, lng: 80 }} /* roughly centre of India */
      mapContainerClassName="w-full h-96 rounded-2xl overflow-hidden shadow"
      options={{ disableDefaultUI: true }}
    >
      {cities.map(([name, data]) => (
        <Marker
          key={name}
          position={{ lat: data.lat, lng: data.lng }}
          onClick={() => setActiveCity(name)}
          icon={{
            url: "/pin-pink.svg", /* put any svg/png pin in /public */
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
      ))}

      {activeCity && (
        <InfoWindow
          position={{
            lat: cityTrendMap[activeCity].lat,
            lng: cityTrendMap[activeCity].lng,
          }}
          onCloseClick={() => setActiveCity(null)}
        >
          <div className="w-56 space-y-1">
            <h3 className="font-semibold">{activeCity}</h3>
            <p className="text-xs">
              <span className="font-medium">Festivals:</span>{" "}
              {cityTrendMap[activeCity].festivals.join(", ")}
            </p>
            <p className="text-xs">
              <span className="font-medium">Hot items:</span>{" "}
              {cityTrendMap[activeCity].items.join(", ")}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
