// Géocodage d'une adresse avec Nominatim (OpenStreetMap)
export async function geocodeAddress(address: string, city: string): Promise<{ latitude: number, longitude: number } | null> {
  const query = encodeURIComponent(`${address}, ${city}, France`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'OpossumApp/1.0' } });
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }
  return null;
}
