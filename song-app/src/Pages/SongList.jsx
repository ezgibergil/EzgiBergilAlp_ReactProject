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

  useEffect(() => {
    localStorage.setItem(`moodSongs-${mood}`, JSON.stringify(moodSongs));
  }, [moodSongs, mood]);

  useEffect(() => { 
    fetchTopSongs(); 
  }, [mood]);

  const fetchTopSongs = async () => {
    setLoading(true);
    try {
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
    <div className={`min-h-screen bg-gradient-to-br ${MOOD_BG[mood] || MOOD_BG.default} p-6 md:p-12 font-sans ${textColor}`}>
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <button onClick={() => navigate(-1)} className="text-2xl bg-white/60 p-4 rounded-full shadow-lg hover:bg-white transition-all active:scale-90">←</button>
        <div className="text-right">
          <h1 className="text-4xl font-black capitalize tracking-tighter mb-1">{mood} Modu</h1>
          <p className="text-sm font-bold opacity-60">Müziğin ritmine bırak kendini...</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
        
        
        <div className="lg:col-span-3 space-y-8">
          <div className="relative group">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Şarkı, sanatçı veya albüm ara..."
              className="w-full bg-white/80 backdrop-blur-md border-none rounded-[2rem] px-8 py-6 outline-none placeholder-slate-400 text-slate-800 shadow-xl focus:ring-4 ring-white/20 transition-all text-lg"
            />
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div></div>
            ) : (
              songs.map((song) => (
                <div key={song.trackId} className="flex flex-col md:flex-row md:items-center gap-6 bg-white/40 p-6 rounded-[2.5rem] border border-white/30 hover:bg-white/90 transition-all shadow-md hover:shadow-2xl">
                  <div className="flex items-center gap-5 flex-1">
                    <img src={song.artworkUrl100} className="w-16 h-16 rounded-[1.2rem] shadow-lg" alt="cover"/>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-lg truncate text-slate-800">{song.trackName}</p>
                      <p className="text-sm text-slate-500 font-bold italic">{song.artistName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {song.previewUrl && (
                      <audio controls className="h-8 w-40 opacity-70 hover:opacity-100 transition-opacity">
                        <source src={song.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}
                    <button 
                      onClick={() => addToMood(song)} 
                      className="bg-slate-800 text-white text-xs font-black px-6 py-3 rounded-full hover:bg-black transition-all active:scale-95 shadow-lg"
                    >
                      EKLE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-white/60 shadow-2xl sticky top-12">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="text-3xl">🌟</span> FAVORİLERİM
            </h2>
            
            <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
              {moodSongs.length === 0 ? (
                <div className="text-center py-16 opacity-40 font-medium italic">
                  Listen henüz boş. Şarkı ekleyerek modunu oluştur!
                </div>
              ) : (
                moodSongs.map((song) => (
                  <div key={song.trackId} className="space-y-3 bg-white/30 p-5 rounded-3xl border border-white/20 group">
                    <div className="flex items-center gap-4">
                      <img src={song.artworkUrl100} className="w-12 h-12 rounded-xl shadow-md" alt="cover"/>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-800 truncate">{song.trackName}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{song.artistName}</p>
                      </div>
                      <button 
                        onClick={() => removeFromMood(song.trackId)} 
                        className="text-red-400 hover:text-red-600 p-2 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {song.previewUrl && (
                      <audio controls className="h-6 w-full opacity-60 hover:opacity-100 transition-all">
                        <source src={song.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}