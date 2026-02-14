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
    try {
      const saved = localStorage.getItem(`moodSongs-${mood}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // localStorage güncelleme
  useEffect(() => {
    localStorage.setItem(`moodSongs-${mood}`, JSON.stringify(moodSongs));
  }, [moodSongs, mood]);

  // İlk açılışta popüler şarkıları getir
  useEffect(() => { 
    fetchTopSongs(); 
  }, [mood]);

  const fetchTopSongs = async () => {
    setLoading(true);
    try {
      // Netlify'da sorun çıkmaması için https ve entity=song kullandık
      const res = await fetch("https://itunes.apple.com/search?term=pop&entity=song&limit=10");
      const data = await res.json();
      setSongs(data.results || []);
    } catch (err) { 
      console.error("Hata:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=10`);
      const data = await res.json();
      setSongs(data.results || []);
    } catch (err) { 
      console.error("Hata:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  // Debounce mekanizması
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
    <div className={`min-h-screen bg-gradient-to-br ${MOOD_BG[mood] || MOOD_BG.default} p-4 md:p-10 font-sans ${textColor}`}>
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-2xl bg-white/50 p-3 rounded-full shadow-md hover:bg-white transition-all active:scale-95">←</button>
        <div className="text-right">
          <h1 className="text-3xl font-black capitalize tracking-tight">{mood} Modun!</h1>
          <p className="text-xs font-medium opacity-70">Senin için seçtiğimiz parçalar</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* SOL KOLON: ARAMA VE ŞARKILAR */}
        <div className="space-y-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Şarkı veya sanatçı ara..."
            className="w-full bg-white/70 border border-white/50 rounded-2xl px-6 py-4 outline-none placeholder-slate-400 text-slate-800 shadow-lg focus:bg-white transition-all"
          />

          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 font-bold animate-pulse">Yükleniyor...</div>
            ) : (
              songs.map((song) => (
                <div key={song.trackId} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/50 p-4 rounded-3xl border border-white/30 hover:bg-white/80 transition-all shadow-sm">
                  <div className="flex items-center gap-4 flex-1">
                    <img src={song.artworkUrl100} className="w-14 h-14 rounded-2xl shadow-inner" alt="cover"/>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate text-slate-800">{song.trackName}</p>
                      <p className="text-[11px] text-slate-500 font-bold">{song.artistName}</p>
                    </div>
                  </div>
                  
                  {/* Ses Önizleme */}
                  <div className="flex items-center justify-between gap-3">
                    {song.previewUrl && (
                      <audio controls className="h-8 w-32 opacity-80">
                        <source src={song.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}
                    <button 
                      onClick={() => addToMood(song)} 
                      className="bg-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 transition-all active:scale-90"
                    >
                      EKLE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAĞ KOLON: KİŞİSEL LİSTE */}
        <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/50 shadow-2xl h-fit sticky top-10">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">✨ {mood.toUpperCase()} LİSTEM</h2>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {moodSongs.length === 0 ? (
              <div className="text-center py-12 opacity-50 italic text-sm">
                Henüz şarkı eklemedin, hadi keşfetmeye başla!
              </div>
            ) : (
              moodSongs.map((song) => (
                <div key={song.trackId} className="flex items-center gap-4 group animate-in fade-in slide-in-from-right-4">
                  <img src={song.artworkUrl100} className="w-12 h-12 rounded-xl" alt="cover"/>
                  <div className="flex-1 border-b border-black/5 pb-2">
                    <p className="font-bold text-sm text-slate-800 truncate">{song.trackName}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{song.artistName}</p>
                  </div>
                  <button 
                    onClick={() => removeFromMood(song.trackId)} 
                    className="text-red-400 hover:text-red-600 text-[10px] font-black transition-colors"
                  >
                    SİL
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}