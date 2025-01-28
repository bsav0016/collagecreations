const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

export default formatDateString;