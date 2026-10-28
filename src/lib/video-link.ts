// SPEC 7.5 / KEPUTUSAN #8: URL tidak boleh berasal dari LLM. Tautan video dibuat server dari nama skill
// berupa pencarian YouTube, jadi tidak pernah mengarah ke video karangan.
export function videoLinkFor(skill: string): { videoTitle: string; videoUrl: string } {
  return {
    videoTitle: `Tutorial ${skill} di YouTube`,
    videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`tutorial ${skill}`)}`,
  };
}
