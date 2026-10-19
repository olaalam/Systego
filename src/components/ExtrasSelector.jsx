/**
 * Multi-select used inside the Package form to choose optional add-ons.
 * `value` is an array of Extra ids.
 */
const ExtrasSelector = ({ options = [], value = [], onChange }) => {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  if (!options.length) {
    return (
      <p className="text-sm text-gray-500">
        No extras yet. Add them from the "Extra" page first.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const checked = selected.includes(opt._id);
        return (
          <label
            key={opt._id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
              checked
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt._id)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span>{opt.name}</span>
            <span className="text-xs text-gray-400">
              {opt.is_recurring ? "Recurring" : "One time"}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default ExtrasSelector;
