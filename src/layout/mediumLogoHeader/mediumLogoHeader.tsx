interface MediumLogoHeaderProps {
    title: string;
}

function MediumLogoHeader({ title }: MediumLogoHeaderProps) {
    return (
        <div>
            <header className="flex items-center justify-center py-4">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </header>
        </div>
    );
}

export default MediumLogoHeader;
