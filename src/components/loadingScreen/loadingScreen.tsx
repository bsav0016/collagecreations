interface LoadingScreenProps {
    message?: string | null;
    progress?: number | null;
}

const TILE_COLUMNS = 5;
const TILE_COUNT = TILE_COLUMNS * TILE_COLUMNS;

function LoadingScreen({ message = null, progress = null }: LoadingScreenProps) {
    const hasProgress = typeof progress === "number";
    const clampedProgress = hasProgress ? Math.min(Math.max(progress as number, 0), 100) : 0;
    const filledTiles = Math.round((clampedProgress / 100) * TILE_COUNT);

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-background">
            {hasProgress ? (
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="grid gap-1.5 w-[150px] h-[150px]"
                        style={{ gridTemplateColumns: `repeat(${TILE_COLUMNS}, 1fr)` }}
                    >
                        {Array.from({ length: TILE_COUNT }).map((_, index) => (
                            <div
                                key={index}
                                className={`rounded-sm transition-all duration-500 ease-out ${
                                    index < filledTiles
                                        ? "bg-primary scale-100 opacity-100"
                                        : "bg-foreground/10 scale-90 opacity-60"
                                }`}
                                style={{ transitionDelay: `${(index % TILE_COLUMNS) * 40}ms` }}
                            />
                        ))}
                    </div>
                    <div className="w-[220px]">
                        <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${clampedProgress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground text-center">
                            {Math.round(clampedProgress)}%
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-[75px] h-[75px] border-8 border-foreground/10 border-t-primary rounded-full animate-spin" />
            )}
            {message && (
                <p className="mt-[10px] text-base text-foreground text-center">{message}</p>
            )}
        </div>
    );
}

export default LoadingScreen;
