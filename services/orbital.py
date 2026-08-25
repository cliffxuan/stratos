from __future__ import annotations

import json
import math
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parent.parent
SATELLITES_DATA = json.loads((ROOT / "data" / "satellites.json").read_text())["satellites"]

EARTH_RADIUS_KM = 6371.0
GM_EARTH = 398600.4418  # km^3 / s^2
SPEED_OF_LIGHT_KM_S = 299792.458


def get_orbital_telemetry(timestamp: float | None = None) -> list[dict[str, Any]]:
    """Propagates all active satellites to the given Unix timestamp,
    computing real-time sub-satellite lat/lon, altitude, orbital velocity,
    eclipse shadow state, and ground track path."""
    t = timestamp or time.time()
    results = []

    for sat in SATELLITES_DATA:
        alt = sat["altitude_km"]
        inc_rad = math.radians(sat["inclination_deg"])
        r = EARTH_RADIUS_KM + alt
        velocity = math.sqrt(GM_EARTH / r)
        period_sec = (2 * math.pi * math.sqrt(math.pow(r, 3) / GM_EARTH))
        period_min = period_sec / 60.0

        # Mean motion in radians per second
        n = (2 * math.pi) / period_sec

        # Orbital phase angle (seeded with satellite norad_id to space them realistically)
        phase_seed = (sat["norad_id"] % 360) * (math.pi / 180.0)
        u = (n * t + phase_seed) % (2 * math.pi)

        # Latitude: sin(lat) = sin(inc) * sin(u)
        lat_rad = math.asin(math.sin(inc_rad) * math.sin(u))
        lat_deg = math.degrees(lat_rad)

        # Longitude: lon = atan2(cos(inc) * sin(u), cos(u)) - earth_rotation
        earth_rot_rate = (2 * math.pi) / 86164.1  # sidereal day rotation rate
        raw_lon = math.atan2(math.cos(inc_rad) * math.sin(u), math.cos(u))
        lon_rad = (raw_lon - earth_rot_rate * t) % (2 * math.pi)
        if lon_rad > math.pi:
            lon_rad -= 2 * math.pi
        lon_deg = math.degrees(lon_rad)

        # Solar Eclipse computation:
        # Sun-synchronous dawn-dusk orbits (approx 98 deg inc) maintain ~100% solar illumination
        is_sso = "Sun-Synchronous" in sat["orbit_type"]
        if is_sso:
            in_eclipse = False
            sunlit_fraction = 1.0
            power_status = "100% Continuous Direct Solar (AM0)"
        else:
            # Equatorial or inclined orbits experience shadow when on night side
            in_eclipse = math.sin(u) < -0.35 and abs(lon_deg) < 90
            sunlit_fraction = 0.65 if alt < 2000 else 0.99
            power_status = "Battery Backup (In Umbra)" if in_eclipse else "Active Direct Solar"

        # Speed of light latency to sub-satellite ground point
        one_way_latency_ms = (alt / SPEED_OF_LIGHT_KM_S) * 1000.0
        rtt_latency_ms = one_way_latency_ms * 2.0

        # Generate 20 ground track points for 1 full orbital period
        ground_track = []
        for step in range(25):
            t_step = t + (step / 24.0) * period_sec
            u_step = (n * t_step + phase_seed) % (2 * math.pi)
            lat_s = math.degrees(math.asin(math.sin(inc_rad) * math.sin(u_step)))
            raw_lon_s = math.atan2(math.cos(inc_rad) * math.sin(u_step), math.cos(u_step))
            lon_s_rad = (raw_lon_s - earth_rot_rate * t_step) % (2 * math.pi)
            if lon_s_rad > math.pi:
                lon_s_rad -= 2 * math.pi
            ground_track.append({
                "lat": round(lat_s, 2),
                "lon": round(math.degrees(lon_s_rad), 2),
            })

        results.append({
            **sat,
            "current_lat": round(lat_deg, 2),
            "current_lon": round(lon_deg, 2),
            "velocity_km_s": round(velocity, 3),
            "period_min": round(period_min, 1),
            "in_eclipse": in_eclipse,
            "sunlit_fraction": sunlit_fraction,
            "power_status": power_status,
            "one_way_latency_ms": round(one_way_latency_ms, 2),
            "rtt_latency_ms": round(rtt_latency_ms, 2),
            "ground_track": ground_track,
        })

    return results


def calculate_laser_crosslinks(satellites: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Calculates optical line-of-sight distance, free-space transmission latency,
    and link feasibility between laser-equipped satellites."""
    links = []
    laser_sats = [s for s in satellites if s.get("isl_laser_equipped")]

    for i in range(len(laser_sats)):
        for j in range(i + 1, len(laser_sats)):
            s1 = laser_sats[i]
            s2 = laser_sats[j]

            # Convert spherical coordinates to 3D Cartesian vectors
            r1 = EARTH_RADIUS_KM + s1["altitude_km"]
            lat1, lon1 = math.radians(s1["current_lat"]), math.radians(s1["current_lon"])
            v1 = (
                r1 * math.cos(lat1) * math.cos(lon1),
                r1 * math.cos(lat1) * math.sin(lon1),
                r1 * math.sin(lat1),
            )

            r2 = EARTH_RADIUS_KM + s2["altitude_km"]
            lat2, lon2 = math.radians(s2["current_lat"]), math.radians(s2["current_lon"])
            v2 = (
                r2 * math.cos(lat2) * math.cos(lon2),
                r2 * math.cos(lat2) * math.sin(lon2),
                r2 * math.sin(lat2),
            )

            # Euclidean distance
            dist_km = math.sqrt(
                (v2[0] - v1[0]) ** 2 + (v2[1] - v1[1]) ** 2 + (v2[2] - v1[2]) ** 2
            )

            # Check if line of sight is obstructed by Earth
            # Distance from Earth center to line segment
            dot = v1[0] * (v2[0] - v1[0]) + v1[1] * (v2[1] - v1[1]) + v1[2] * (v2[2] - v1[2])
            seg_len_sq = dist_km ** 2
            proj = max(0.0, min(1.0, -dot / seg_len_sq)) if seg_len_sq > 0 else 0
            closest_point_dist = math.sqrt(
                (v1[0] + proj * (v2[0] - v1[0])) ** 2
                + (v1[1] + proj * (v2[1] - v1[1])) ** 2
                + (v1[2] + proj * (v2[2] - v1[2])) ** 2
            )

            is_line_of_sight = closest_point_dist > (EARTH_RADIUS_KM + 80.0)
            latency_ms = (dist_km / SPEED_OF_LIGHT_KM_S) * 1000.0

            links.append({
                "source_id": s1["id"],
                "source_name": s1["name"],
                "target_id": s2["id"],
                "target_name": s2["name"],
                "distance_km": round(dist_km, 1),
                "is_line_of_sight": is_line_of_sight,
                "latency_ms": round(latency_ms, 2),
                "bandwidth_gbps": 100.0 if is_line_of_sight else 0.0,
                "status": "Active Laser Mesh (100 Gbps)" if is_line_of_sight else "Obstructed by Earth Horizon",
            })

    return links
