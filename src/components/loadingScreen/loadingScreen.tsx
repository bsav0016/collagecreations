interface LoadingScreenProps {
    message?: string | null;
}

function LoadingScreen({ message = null }: LoadingScreenProps) {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-white">
            <div className="w-[75px] h-[75px] border-8 border-black/10 border-t-blue-500 rounded-full animate-spin" />
            {message && (
                <p className="mt-[10px] text-base text-black text-center">{message}</p>
            )}
        </div>
    );
}

export default LoadingScreen;
