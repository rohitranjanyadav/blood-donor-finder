// ═══════════════════════════════════════════════════════════════
// MATCHING SERVICE — DSA Algorithms
// Blood Donor Finder Network
//
// Algorithms implemented:
//   1. Binary Search       — to find donors by blood group O(log n)
//   2. Haversine Formula   — to calculate distance between coordinates
//   3. Greedy Sort         — to fetch nearest donor first
//   4. Priority Scoring    — urgent requests surface first(min-heap concept)
// ═══════════════════════════════════════════════════════════════

// ── BLOOD GROUP ORDER FOR BINARY SEARCH ─────────
// Sort donors alphabetically by blood group before searching
const BLOOD_GROUP_ORDER = ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"];

// ── 1. BINARY SEARCH ─────────────────────────────────────────────
// Finds the first index of the target blood group in a sorted array
// Time complexity: O(log n) vs O(n) for linear scan
//
// How it works:
//   - Array must be sorted by blood_group before calling
//   - We search for the leftmost occurrence of the target
//   - Then collect all consecutive matches from that point

const binarySearchFirstIndex = (sortedDonors, targetBloodGroup) => {
  let left = 0;
  let right = sortedDonors.length - 1;
  let firstIndex = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (sortedDonors[mid].blood_group === targetBloodGroup) {
      firstIndex = mid;
      right = mid - 1;
    } else if (sortedDonors[mid].blood_group < targetBloodGroup) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return firstIndex;
};

const binarySearchDonors = (sortedDonors, targetBloodGroup) => {
  const firstIndex = binarySearchFirstIndex(sortedDonors, targetBloodGroup);

  if (firstIndex === -1) return []; // no match

  // Collect all donors with matching blood group
  const matched = [];
  for (let i = firstIndex; i < sortedDonors.length; i++) {
    if (sortedDonors[i].blood_group === targetBloodGroup) {
      matched.push(sortedDonors[i]);
    } else {
      break;
    }
  }

  console.log(
    `🔍 Binary Search: scanned from index ${firstIndex}, ` +
      `found ${matched.length} donor(s) with blood group ${targetBloodGroup}`,
  );

  return matched;
};

// ── 2. HAVERSINE FORMULA ──────────────────────────────────────────
// Calculates the great-circle distance between two GPS coordinates
// Returns distance in kilometers
//
// Formula:
//   a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
//   c = 2 × atan2(√a, √(1−a))
//   d = R × c   where R = 6371 km (Earth's radius)

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 100) / 100; // round to 2 decimal places
};

// ── 3. GREEDY SORT — nearest donor first ─────────────────────────
// After matching by blood group, sort matched donors by distance
// from the request location — nearest donor gets alerted first
//
// Greedy approach: always pick the locally optimal choice
// (nearest available donor) at each step
const sortDonorsByDistance = (donors, requestLat, requestLon) => {
  // Separate donors with and without location data
  const withLocation = [];
  const withoutLocation = [];

  for (const donor of donors) {
    if (donor.latitude && donor.longitude) {
      withLocation.push({
        ...donor,
        distance_km: haversineDistance(
          parseFloat(requestLat),
          parseFloat(requestLon),
          parseFloat(donor.latitude),
          parseFloat(donor.longitude),
        ),
      });
    } else {
      withoutLocation.push({ ...donor, distance_km: null });
    }
  }

  withLocation.sort((a, b) => a.distance_km - b.distance_km);

  withLocation.forEach((d, i) => {
    console.log(
      `📍 Donor #${i + 1}: ${d.full_name} — ${d.distance_km} km away`,
    );
  });

  return [...withLocation, ...withoutLocation];
};

// ── 4. PRIORITY SCORING — min-heap concept ───────────────────────
// Assigns a priority score to each request based on deadline
// Lower score = higher urgency (like a min-heap where min = top)
//
// Scores:
//   CRITICAL  — under 2 hours    -> score 1
//   URGENT    — under 6 hours    -> score 2
//   MODERATE  — under 24 hours   -> score 3
//   NORMAL    — more than 24h    -> score 4
const getPriorityScore = (deadlineStr) => {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const secondsLeft = (deadline - now) / 1000;
  const hoursLeft = secondsLeft / 3600;

  let score;
  let urgency_label;

  if (hoursLeft <= 0) {
    score = 0;
    urgency_label = "EXPIRED";
  } else if (hoursLeft <= 2) {
    score = 1;
    urgency_label = "CRITICAL";
  } else if (hoursLeft <= 6) {
    score = 2;
    urgency_label = "URGENT";
  } else if (hoursLeft <= 24) {
    score = 3;
    urgency_label = "MODERATE";
  } else {
    score = 4;
    urgency_label = "NORMAL";
  }

  return {
    priority_score: score,
    urgency_label,
    hours_remaining: hoursLeft > 0 ? Math.round(hoursLeft * 10) / 10 : 0,
  };
};

// Sort according to the priority scores
const sortRequestsByPriority = (requests) => {
  return requests
    .map((r) => ({
      ...r,
      ...getPriorityScore(r.deadline),
    }))
    .sort((a, b) => a.priority_score - b.priority_score);
};

// ── MAIN Function: Full matching process ──────────────────────────
// 1. Sort all active donors by blood group
// 2. Binary search to find matching blood group donors
// 3. Haversine formula & Greedy algorithm to sort by distance
const matchDonors = (
  allActiveDonors,
  targetBloodGroup,
  requestLat,
  requestLon,
) => {
  // 1. Sort all active donors by blood group
  const sorted = [...allActiveDonors].sort((a, b) =>
    a.blood_group.localeCompare(b.blood_group),
  );

  // 2. Binary search - Matching blood groups
  const matched = binarySearchDonors(sorted, targetBloodGroup);

  if (matched.length === 0) {
    console.log(
      `⚠️  No active donors found for blood group ${targetBloodGroup}`,
    );
    return [];
  }

  // 3. Sort by distance
  if (requestLat && requestLon) {
    return sortDonorsByDistance(matched, requestLat, requestLon);
  }

  return matched;
};

module.exports = {
  matchDonors,
  binarySearchDonors,
  haversineDistance,
  sortDonorsByDistance,
  sortRequestsByPriority,
  getPriorityScore,
};
