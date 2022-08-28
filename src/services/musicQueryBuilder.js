const MOOD_SEARCH_TERMS = {
  Happy: ["happy", "upbeat", "feel good", "pop"],
  Sad: ["sad", "melancholy", "emotional", "ballad"],
  Surprised: ["energetic", "uplifting", "exciting", "dance"],
  Fearful: ["dark ambient", "tense", "cinematic", "atmospheric"],
  Angry: ["rock", "intense", "aggressive", "metal"],
  Disgusted: ["alternative", "grunge", "raw"],
  Neutral: ["chill", "lo-fi", "relaxing", "instrumental"],
};

const WEATHER_RULES = [
  { match: /thunder|storm|lightning/i, terms: ["stormy", "dramatic", "powerful"] },
  { match: /snow|blizzard|sleet|ice/i, terms: ["cozy", "winter", "warm acoustic"] },
  { match: /rain|drizzle|shower/i, terms: ["rainy day", "acoustic", "mellow"] },
  { match: /overcast|cloud|grey|gray|mist|fog|haze/i, terms: ["mellow", "soft", "ambient"] },
  { match: /sun|clear|fair/i, terms: ["bright", "sunny", "summer"] },
  { match: /wind/i, terms: ["breezy", "indie"] },
  { match: /hot|warm/i, terms: ["summer", "tropical"] },
  { match: /cold|freez/i, terms: ["winter", "introspective"] },
];

function weatherTerms(weatherDescription) {
  if (!weatherDescription) {
    return ["playlist"];
  }

  for (const rule of WEATHER_RULES) {
    if (rule.match.test(weatherDescription)) {
      return rule.terms;
    }
  }

  return [weatherDescription.split(" ")[0].toLowerCase()];
}

/**
 * Builds several iTunes search phrases from a mood label and weather text.
 * No music API accepts mood/weather fields directly; this is the recommendation layer.
 */
export function buildItunesSearchQueries(mood, weatherDescription) {
  const moodTerms = MOOD_SEARCH_TERMS[mood] || [mood.toLowerCase(), "music"];
  const atmosphere = weatherTerms(weatherDescription);

  const primary = [...moodTerms.slice(0, 2), ...atmosphere.slice(0, 2)].join(" ");
  const secondary = `${mood} ${weatherDescription} music`;
  const fallback = `${moodTerms[0]} ${atmosphere[0]} music`;

  return [primary, secondary, fallback];
}
