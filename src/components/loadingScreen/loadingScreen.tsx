interface LoadingScreenProps {
    message?: string | null;
}

function LoadingScreen({ message = null }: LoadingScreenProps) {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-background">
            <div className="w-[75px] h-[75px] border-8 border-foreground/10 border-t-primary rounded-full animate-spin" />
            {message && (
                <p className="mt-[10px] text-base text-foreground text-center">{message}</p>
            )}
        </div>
    );
}

export default LoadingScreen;
