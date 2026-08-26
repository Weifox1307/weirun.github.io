// Парсер GPX работает прямо в браузере (без бэкенда)
export function parseGPX(xmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const trkpts = doc.getElementsByTagName("trkpt");
  
  let totalDistance = 0;
  let startTime: number | null = null;
  let endTime: number | null = null;

  function deg2rad(deg: number) { return deg * (Math.PI / 180); }
  
  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  for (let i = 0; i < trkpts.length; i++) {
    const pt = trkpts[i];
    const lat = parseFloat(pt.getAttribute("lat") || "0");
    const lon = parseFloat(pt.getAttribute("lon") || "0");
    const timeEl = pt.getElementsByTagName("time")[0];
    const time = timeEl && timeEl.textContent ? new Date(timeEl.textContent).getTime() : null;

    if (i === 0) startTime = time;
    if (i === trkpts.length - 1) endTime = time;

    if (i > 0) {
      const prevPt = trkpts[i - 1];
      const prevLat = parseFloat(prevPt.getAttribute("lat") || "0");
      const prevLon = parseFloat(prevPt.getAttribute("lon") || "0");
      totalDistance += getDistanceKm(prevLat, prevLon, lat, lon);
    }
  }

  const durationMs = (endTime && startTime) ? endTime - startTime : 0;
  return { distanceKm: totalDistance, durationMs, points: trkpts.length };
}
