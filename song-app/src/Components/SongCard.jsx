function SongCard({ song, onAdd }) {
    return (
      <div className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center">
        <div>
          <h3 className="text-white font-medium">{song.title}</h3>
          <p className="text-zinc-400 text-sm">{song.artist}</p>
        </div>
  
        <button
          onClick={onAdd}
          className="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-lg text-white text-sm"
        >
          Ekle
        </button>
      </div>
    );
  }
  
  export default SongCard;
  