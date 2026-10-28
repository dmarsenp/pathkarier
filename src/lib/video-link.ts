// URL video tidak boleh berasal dari AI. Tautan dibuat server dari nama skill berupa pencarian YouTube,
// sehingga tidak pernah mengarah ke video karangan.
export function videoLinkFor(skill: string): { videoTitle: string; videoUrl: string } {
  return {
    videoTitle: `Tutorial ${skill} di YouTube`,
    videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`tutorial ${skill}`)}`,
  };
}
