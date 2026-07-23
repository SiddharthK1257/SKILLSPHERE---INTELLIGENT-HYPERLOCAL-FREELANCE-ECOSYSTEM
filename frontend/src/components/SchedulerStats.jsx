const SchedulerStats = ({ slots = [] }) => {
  const total = slots.length;
  const booked = slots.filter((slot) => slot.booked).length;
  const available = total - booked;
  const bookingRate = total ? Math.round((booked / total) * 100) : 0;

  const cards = [
    {
      title: "Total Slots",
      value: total,
      icon: "📅",
      bg: "from-blue-500 to-cyan-500",
    },
    {
      title: "Available",
      value: available,
      icon: "🟢",
      bg: "from-emerald-500 to-green-600",
    },
    {
      title: "Booked",
      value: booked,
      icon: "🔒",
      bg: "from-rose-500 to-red-600",
    },
    {
      title: "Booking Rate",
      value: `${bookingRate}%`,
      icon: "📈",
      bg: "from-violet-500 to-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-r ${card.bg} rounded-3xl p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">{card.title}</p>

              <h2 className="mt-3 text-4xl font-bold">
                {card.value}
              </h2>
            </div>

            <div className="text-5xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulerStats;