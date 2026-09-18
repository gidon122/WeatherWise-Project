export const Loader = () => (
  <div className="w-full flex-grow flex flex-col md:grid md:grid-cols-2 gap-3 animate-pulse min-h-0">
    {/* Left Column Skeletons */}
    <div className="flex flex-col gap-3">
      {/* Main Weather Card Skeleton */}
      <div className="h-44 sm:h-48 rounded-2xl bg-app-surface border border-app-border" />
      {/* Forecast Cards Skeletons */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <div className="h-24 sm:h-28 rounded-xl bg-app-surface border border-app-border" />
        <div className="h-24 sm:h-28 rounded-xl bg-app-surface border border-app-border" />
        <div className="h-24 sm:h-28 rounded-xl bg-app-surface border border-app-border" />
      </div>
    </div>
    {/* Chat Box Skeleton */}
    <div className="flex-1 min-h-[300px] md:min-h-0 h-[420px] md:h-full rounded-2xl bg-app-surface border border-app-border" />
  </div>
);