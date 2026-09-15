export default function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-[#F3EEFA]">
      {/* Navbar skeleton */}
      <div className="bg-[#9B7DD4] h-14 w-full animate-pulse" />
      <div className="bg-[#8B6CC8] h-10 w-full animate-pulse" />

      {/* Trust bar */}
      <div className="bg-white border-b border-gray-100 h-10 animate-pulse" />

      <div className="mx-auto max-w-[1500px] px-4 py-4">
        {/* Hero skeleton */}
        <div className="w-full h-48 rounded-xl bg-gray-200 animate-pulse mb-6" />

        {/* Destacados skeleton */}
        <div className="mb-8">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-white">
                <div className="h-32 bg-gray-100 animate-pulse" />
                <div className="p-2 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Título catálogo */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <div className="h-6 w-44 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Grid de productos skeleton */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden">
              {/* Imagen */}
              <div className="aspect-square bg-gray-100 animate-pulse" />
              {/* Info */}
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}