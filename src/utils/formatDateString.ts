const formatDateString = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

export default formatDateString;
