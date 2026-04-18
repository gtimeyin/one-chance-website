export default function AccountLoading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-neutral-200 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-10 bg-neutral-200 w-[60%] max-w-[320px]" />
          <div className="h-4 bg-neutral-100 w-[80%] max-w-[420px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-5 border border-neutral-200"
          >
            <div className="h-5 bg-neutral-200 w-[60%]" />
            <div className="h-3 bg-neutral-100 w-[85%]" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-6 bg-neutral-200 w-[180px]" />
        <div className="flex flex-col border border-neutral-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 last:border-b-0"
            >
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-neutral-200 w-[120px]" />
                <div className="h-3 bg-neutral-100 w-[90px]" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 bg-neutral-200 w-[70px]" />
                <div className="h-6 bg-neutral-100 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
