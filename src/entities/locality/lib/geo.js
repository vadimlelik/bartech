const SAME_POINT = 1e-5;

function samePoint(a, b) {
  return Math.abs(a.lat - b.lat) < SAME_POINT && Math.abs(a.lon - b.lon) < SAME_POINT;
}

export function assembleRings(parts) {
  const unused = parts
    .filter((part) => part.length >= 2)
    .map((part) => part.map((point) => ({ lat: point.lat, lon: point.lon })));
  const rings = [];

  while (unused.length) {
    const ring = unused.pop();
    let progressed = true;
    while (progressed && !samePoint(ring[0], ring[ring.length - 1])) {
      progressed = false;
      for (let index = 0; index < unused.length; index += 1) {
        const part = unused[index];
        const head = ring[0];
        const tail = ring[ring.length - 1];
        if (samePoint(tail, part[0])) {
          ring.push(...part.slice(1));
        } else if (samePoint(tail, part[part.length - 1])) {
          ring.push(...part.slice(0, -1).reverse());
        } else if (samePoint(head, part[part.length - 1])) {
          ring.unshift(...part.slice(0, -1));
        } else if (samePoint(head, part[0])) {
          ring.unshift(...part.slice(1).reverse());
        } else {
          continue;
        }
        unused.splice(index, 1);
        progressed = true;
        break;
      }
    }
    rings.push(ring);
  }

  return rings;
}

export function bboxOf(rings) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;
  for (const ring of rings) {
    for (const point of ring) {
      if (point.lat < minLat) minLat = point.lat;
      if (point.lat > maxLat) maxLat = point.lat;
      if (point.lon < minLon) minLon = point.lon;
      if (point.lon > maxLon) maxLon = point.lon;
    }
  }
  return { minLat, maxLat, minLon, maxLon };
}

function inBbox(lat, lon, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat && lon >= bbox.minLon && lon <= bbox.maxLon;
}

function pointInRing(lat, lon, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const yi = ring[i].lat;
    const xi = ring[i].lon;
    const yj = ring[j].lat;
    const xj = ring[j].lon;
    const crosses = yi > lat !== yj > lat;
    if (crosses && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function containsPoint(lat, lon, boundary) {
  if (!inBbox(lat, lon, boundary.bbox)) return false;
  if (!boundary.outers.some((ring) => pointInRing(lat, lon, ring))) return false;
  if (boundary.inners.some((ring) => pointInRing(lat, lon, ring))) return false;
  return true;
}

function bboxArea(bbox) {
  return (bbox.maxLat - bbox.minLat) * (bbox.maxLon - bbox.minLon);
}

function pickSmallest(items, lat, lon) {
  const hits = items.filter((item) => containsPoint(lat, lon, item));
  hits.sort((a, b) => bboxArea(a.bbox) - bboxArea(b.bbox));
  return hits[0] || null;
}

export function locateLocality(lat, lon, index) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const region = pickSmallest(index.regions, lat, lon);
  const district = pickSmallest(index.districts, lat, lon);
  if (region && district) {
    return { regionName: region.name, districtName: district.name };
  }
  if (region && isMinskCity(region.name)) {
    return { regionName: region.name, districtName: 'Минск' };
  }
  return null;
}

function isMinskCity(name) {
  const normalized = name.trim().toLowerCase().replaceAll('ё', 'е');
  return normalized === 'минск' || normalized === 'город минск';
}
