export const Loader = () => (
  <div className="w-full flex-grow flex flex-col gap-3 animate-pulse">
    {/* Main Weather Card Skeleton */}
    <div className="h-44 sm:h-48 rounded-2xl bg-app-surface border border-app-border" />
    {/* Forecast Cards Skeletons */}
    <div className="grid grid-cols-3 gap-2">
      <div className="h-24 sm:h-28 rounded-xl bg-app-surface border border-app-border" />
      <div className="h-24 sm:h-28 rounded-xl bg-app-surface border border-app-border" />
      <div className="h-24 sm:h-28 rounded-xl bg-app-surface border border-app-border" />
    </div>
    {/* Chat Box Skeleton */}
    <div className="flex-1 min-h-[140px] rounded-2xl bg-app-surface border border-app-border" />
  </div>
);