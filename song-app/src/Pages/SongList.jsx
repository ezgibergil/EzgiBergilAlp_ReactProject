import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MOOD_BG = {
  mutlu: "from-[#FFF9E5] to-[#FFE4B5]", 
  uzgun: "from-[#E0F2FE] to-[#BAE6FD]", 
  sakin: "from-[#F0FDF4] to-[#DCFCE7]", 
  enerjik: "from-[#FFF1F2] to-[#FECDD3]", 
  default: "from-[#F8FAFC] to-[#F1F5F9]"
};

const TEXT_COLORS = {
  mutlu: "text-[#854D0E]",
  uzgun: "text-[#075985]",
  sakin: "text-[#166534]",
  enerjik: "text-[#9F1239]",
  default: "text-slate-800"
};

export default function SongList() {
  const { mood } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [moodSongs, setMoodSongs] = useState(() => {
    const saved = localStorage.getItem(`moodSongs-${mood}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(`moodSongs-${mood}`, JSON.stringify(moodSongs));
  }, [moodSongs, mood]);

  useEffect(() => { fetchTopSongs(); }, [mood]);

  const fetchTopSongs = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://itunes.apple.com/search?term=pop&media=music&limit=10");
      const data = await res.json();
      setSongs(data.results || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=10`);
      const data = await res.json();
      setSongs(data.results || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (searchTerm) handleSearch(searchTerm);
      else fetchTopSongs();
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const addToMood = (song) => {
    if (moodSongs.find((s) => s.trackId === song.trackId)) return;
    setMoodSongs([...moodSongs, { ...song }]);
  };

  const removeFromMood = (trackId) => {
    setMoodSongs(moodSongs.filter((s) => s.trackId !== trackId));
  };

  const textColor = TEXT_COLORS[mood] || TEXT_COLORS.default;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${MOOD_BG[mood] || MOOD_BG.default} p-6 font-sans ${textColor}`}>
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-2xl bg-white/50 p-2 rounded-full shadow-sm hover:bg-white transition">←</button>
        <div className="text-right">
          <h1 className="text-2xl font-black capitalize tracking-tight">{mood} Hislerin!</h1>
          <p className="text-[10px] font-medium opacity-70">Bugün seninle aynı hisse sahip şarkılar</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="space-y-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Şarkı veya sanatçı ara..."
            className="w-full bg-white/60 border border-white/40 rounded-2xl px-5 py-4 outline-none placeholder-slate-400 text-slate-800 shadow-sm focus:bg-white transition"
          />

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {songs.map((song) => (
              <div key={song.trackId} className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl border border-white/20 hover:bg-white/60 transition group">
                <img src={song.artworkUrl100} className="w-12 h-12 rounded-xl" alt="cover"/>
                <div className="flex-1">
                  <p className="font-bold text-sm line-clamp-1 text-slate-800">{song.trackName}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{song.artistName}</p>
                </div>
                <button onClick={() => addToMood(song)} className="bg-white/80 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:bg-white transition">EKLE</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/40 shadow-sm h-fit">
          <h2 className="text-lg font-black mb-6 flex items-center gap-2">🌟 Listem</h2>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {moodSongs.length === 0 ? (
              <div className="text-center py-10 opacity-40 italic text-sm">Henüz moduna uygun şarkı seçmedin...</div>
            ) : (
              moodSongs.map((song) => (
                <div key={song.trackId} className="flex items-center gap-4 group">
                  <img src={song.artworkUrl100} className="w-10 h-10 rounded-lg" alt="cover"/>
                  <div className="flex-1 border-b border-black/5 pb-2">
                    <p className="font-bold text-sm text-slate-800">{song.trackName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{song.artistName}</p>
                  </div>
                  <button onClick={() => removeFromMood(song.trackId)} className="text-red-500 text-[10px] font-bold">SİL</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}