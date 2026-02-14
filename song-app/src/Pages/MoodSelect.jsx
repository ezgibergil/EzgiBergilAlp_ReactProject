import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_MOODS = [
  { 
    id: 1, 
    name: "Mutlu", 
    desc: "Enerjik ve pozitif",
    bgImage: "/moods/happy.jpeg", 
    gradient: "from-[#FFD978]/50 to-[#F6AD55]/50" 
  },
  { 
    id: 2, 
    name: "Üzgün", 
    desc: "Ağlamaklı",
    bgImage: "/moods/sad.jpeg", 
    gradient: "from-[#4A5568]/60 to-[#2D3748]/60" 
  },
  { 
    id: 3, 
    name: "Sakin", 
    desc: "Huzur arıyorum",
    bgImage: "/moods/relax.jpeg", 
    gradient: "from-[#1A202C]/60 to-[#2D31FA]/60" 
  },
  { 
    id: 4, 
    name: "Enerjik", 
    desc: "Hareket zamanı!",
    bgImage: "/moods/enerjy.jpeg", 
    gradient: "from-[#F6AD55]/50 to-[#E53E3E]/50" 
  },
];

export default function MoodSelect() {
  const navigate = useNavigate();
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem("moodify-moods");
    return saved ? JSON.parse(saved) : DEFAULT_MOODS;
  });

  const [newMoodName, setNewMoodName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", desc: "", bgImage: "" });

  useEffect(() => {
    localStorage.setItem("moodify-moods", JSON.stringify(moods));
  }, [moods]);

  const addMood = () => {
    if (!newMoodName.trim()) return;
    const mood = {
      id: Date.now(),
      name: newMoodName,
      desc: "Yeni bir his...",
      bgImage: "/moods/happy.jpeg",
      gradient: "from-purple-500/40 to-pink-500/40",
    };
    setMoods([...moods, mood]);
    setNewMoodName("");
  };

  const handleEditClick = (e, mood) => {
    e.stopPropagation();
    setEditingId(mood.id);
    setEditForm({ name: mood.name, desc: mood.desc, bgImage: mood.bgImage });
  };

  const saveEdit = (e) => {
    e.stopPropagation();
    setMoods(moods.map(m => m.id === editingId ? { ...m, ...editForm } : m));
    setEditingId(null);
  };

  const deleteMood = (e, id) => {
    e.stopPropagation();
    setMoods(moods.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F0F5FF] p-6 font-sans pb-20">
      <header className="max-w-md mx-auto mt-8 mb-8 text-center">
        <h1 className="text-[#2D31FA] text-2xl font-bold">Bugün nasıl hissediyorsun?</h1>
        <p className="text-[#2D31FA] opacity-60 text-xs mt-2 italic text-center">Ruh halini seç, biz senin için çalalım!</p>
        
        <div className="mt-6 flex gap-2 bg-white/60 p-2 rounded-2xl shadow-sm border border-white/40 backdrop-blur-sm">
          <input
            className="flex-1 bg-transparent px-4 py-2 outline-none text-[#2D31FA] placeholder-[#2D31FA]/40 text-sm"
            value={newMoodName}
            placeholder="Başka bir mod ekle..."
            onChange={(e) => setNewMoodName(e.target.value)}
          />
          <button className="bg-[#2D31FA] text-white px-5 py-2 rounded-xl font-bold text-xs" onClick={addMood}>
            EKLE
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {moods.map((mood) => (
          <div key={mood.id} className="relative group">
            <div
              onClick={() => editingId !== mood.id && navigate(`/mood/${mood.name.toLowerCase()}`)}
              className={`relative h-56 rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-xl ${editingId !== mood.id ? 'hover:scale-[1.03] cursor-pointer' : ''}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${mood.bgImage})` }} 
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} mix-blend-multiply opacity-80`} />
              <div className="absolute inset-0 backdrop-blur-[1px]" />
              
              <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                {editingId === mood.id ? (
                  <div className="bg-white/30 backdrop-blur-md p-3 rounded-2xl w-full space-y-2 border border-white/30">
                    <input 
                      className="w-full bg-transparent border-b border-white text-white text-xs outline-none font-bold"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                    <input 
                      className="w-full bg-transparent border-b border-white/50 text-white/80 text-[10px] outline-none"
                      value={editForm.desc}
                      onChange={(e) => setEditForm({...editForm, desc: e.target.value})}
                    />
                    <button className="w-full bg-white text-indigo-600 text-[10px] py-1.5 rounded-lg font-bold" onClick={saveEdit}>TAMAMLA</button>
                  </div>
                ) : (
                  <>
                    <span className="text-5xl mb-3 drop-shadow-md">{mood.emoji}</span>
                    <h3 className="text-white font-bold text-xl tracking-wide">{mood.name}</h3>
                    <p className="text-white/90 text-[10px] mt-1 font-medium">{mood.desc}</p>
                  </>
                )}
              </div>
            </div>

            {editingId !== mood.id && (
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button onClick={(e) => handleEditClick(e, mood)} className="bg-white/90 text-[#2D31FA] text-[10px] px-3 py-1 rounded-full font-bold shadow-md">DÜZENLE</button>
                <button onClick={(e) => deleteMood(e, mood.id)} className="bg-red-500/90 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md">SİL</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}