export default function Schematic() {
  return (
    <section className="w-120 p-2 border">
        <div className="flex items-center justify-between">
            <h2 className="font-bold">Reference Schematic</h2>
            <button type="button" className="border px-3 py-1 font-bold">
                Replace
            </button>
        </div>

        <hr className="-mx-2 mt-2 mb-2"/>

        <div className="border border-dashed gray-400 bg-gray-50 p-10 flex flex-col items-center justify-center">
            <p className="text-lg mb-10">Drop .sch file here</p>
            <div className="border p-3 w-full">
                <p className="text-sm">circuit-schematic.sch</p>
                <p className="text-sm text-gray-500">SCH · 24 KB</p>
            </div>
        </div>

    </section>
  );
}