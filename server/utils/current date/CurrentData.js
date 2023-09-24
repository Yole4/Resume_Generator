function getCurrentFormattedDate() {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const currentDate = new Date();
    return new Intl.DateTimeFormat('en-US', options).format(currentDate);
}

module.exports = getCurrentFormattedDate;