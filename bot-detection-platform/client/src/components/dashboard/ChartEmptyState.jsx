export default function ChartEmptyState({ message = 'Not enough data collected yet' }) {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 text-center">
      <p className="text-sm font-medium text-gray-600">{message}</p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">
        Run traffic simulations or wait for live sessions to populate analytics.
      </p>
    </div>
  );
}
