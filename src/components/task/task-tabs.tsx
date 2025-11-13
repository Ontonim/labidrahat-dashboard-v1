"use client"

export default function TaskTabs({
  active,
  onChange,
}: {
  active: "to do" | "in progress" | "completed"
  onChange: (filter: "to do" | "in progress" | "completed") => void
}) {
  const tabs = ["to do", "in progress", "completed"] as const

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            active === tab ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300 hover:bg-slate-600"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}
