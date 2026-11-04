import breadboardImage from "../assets/breadboard.jpg";

export default function Circuit() {
  return (
    <section className="w-120 p-2 border flex flex-col h-full">
        <div className="flex items-center justify-between shrink-0">
            <h2 className="font-bold">Actual Circuit Photos</h2>
            <button type="button" className="border px-3 py-1 font-bold">
                Upload New
            </button>
        </div>

        <hr className="-mx-2 mt-2 mb-2 shrink-0"/>

        <div className="min-h-0 flex-1 overflow-y-auto border border-dashed gray-400 bg-gray-50 p-10 flex flex-col items-center ">
            <p className="text-lg mb-10">Drop images here</p>

            <div className="border p-3 w-full mb-5">

                <img
                    src={breadboardImage}
                    alt="Breadboard circuit"
                    className="mb-3"
                />

                <p className="text-sm">breadboard.top.jpg</p>
                <p className="text-sm text-gray-500">JPG · 1.8 MB</p>
            </div>

            <div className="border p-3 w-full mb-5">

                <img
                    src={breadboardImage}
                    alt="Breadboard circuit"
                    className="mb-3"
                />

                <p className="text-sm">breadboard.top.jpg</p>
                <p className="text-sm text-gray-500">JPG · 1.8 MB</p>
            </div>

            <div className="border p-3 w-full mb-5">

                <img
                    src={breadboardImage}
                    alt="Breadboard circuit"
                    className="mb-3"
                />

                <p className="text-sm">breadboard.top.jpg</p>
                <p className="text-sm text-gray-500">JPG · 1.8 MB</p>
            </div>

        </div>

    </section>
  );
}