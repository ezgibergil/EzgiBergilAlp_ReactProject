function MoodCard({ mood, onSelect }) {
    return (
      <div
        onClick={() => onSelect(mood)}
        className={`w-64 h-40 rounded-2xl bg-gradient-to-br ${mood.gradient}
        p-5 cursor-pointer
        transform transition hover:scale-105 hover:shadow-xl`}
      >
        <div className="flex flex-col h-full justify-between">
          <span className="text-4xl">{mood.emoji}</span>
  
          <div>
            <h2 className="text-white text-xl font-semibold">
              {mood.title}
            </h2>
            <p className="text-white/80 text-sm">
              {mood.subtitle}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  export default MoodCard;
  