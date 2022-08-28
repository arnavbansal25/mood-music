import axios from "axios";
import { buildItunesSearchQueries } from "./musicQueryBuilder";

const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";

/**
 * Apple iTunes Search API — free, no API key, works in the browser (CORS),
 * returns 30-second previews. Best fit for a client-only mood + weather app.
 * @see https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
 */
export async function searchItunes(term, { limit = 15, country } = {}) {
  const response = await axios.get(ITUNES_SEARCH_URL, {
    params: {
      term,
      media: "music",
      entity: "song",
      limit,
      country: country || process.env.REACT_APP_ITUNES_COUNTRY || "US",
    },
  });

  const results = response.data?.results ?? [];
  return results
    .filter((track) => track.previewUrl && track.trackId)
    .map((track) => ({
      id: track.trackId,
      image:
        track.artworkUrl100?.replace("100x100", "300x300") ||
        track.artworkUrl100,
      title: `${track.trackName} — ${track.artistName}`,
      previewUrl: track.previewUrl,
      appleUrl: track.trackViewUrl,
      durationMs: track.trackTimeMillis,
      genre: track.primaryGenreName,
    }));
}

function mergeUniqueTracks(trackLists, maxTracks) {
  const seen = new Set();
  const merged = [];

  for (const list of trackLists) {
    for (const track of list) {
      if (seen.has(track.id)) {
        continue;
      }
      seen.add(track.id);
      merged.push(track);
      if (merged.length >= maxTracks) {
        return merged;
      }
    }
  }

  return merged;
}

export async function recommendTracks(mood, weatherDescription) {
  const queries = buildItunesSearchQueries(mood, weatherDescription);

  const results = await Promise.all(
    queries.map((term) =>
      searchItunes(term, { limit: 12 }).catch(() => [])
    )
  );

  const tracks = mergeUniqueTracks(results, 20);

  return {
    tracks,
    provider: "itunes",
    queriesUsed: queries,
  };
}
