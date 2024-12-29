export function GalleryLoader() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-700">
          Preparing Your Art Gallery Experience
        </h2>
        <p className="text-gray-500 mt-2">
          Loading high-quality 3D environment...
        </p>
      </div>
    </div>
  );
}
