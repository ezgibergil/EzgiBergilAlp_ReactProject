import { useState } from "react";

function EditableSongCard({ song, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(song.title);
  const [editedArtist, setEditedArtist] = useState(song.artist);

  const handleSave = () => {
    onUpdate({
      ...song,
      title: editedTitle,
      artist: editedArtist,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white/80 rounded-xl p-4 flex items-center gap-4 shadow">
      <img
        src={song.image}
        alt={song.title}
        className="w-16 h-16 rounded-lg object-cover"
      />

      <div className="flex-1">
        {isEditing ? (
          <>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-1"
            />
            <input
              value={editedArtist}
              onChange={(e) => setEditedArtist(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </>
        ) : (
          <>
            <h3 className="font-semibold">{song.title}</h3>
            <p className="text-sm text-gray-600">{song.artist}</p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="text-green-600 text-sm"
          >
            Kaydet
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 text-sm"
          >
            Düzenle
          </button>
        )}

        <button
          onClick={() => onDelete(song.id)}
          className="text-red-500 text-sm"
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default EditableSongCard;
