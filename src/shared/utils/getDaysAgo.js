    const getDaysAgo = (dateString) => {
        const createdDate = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate); // в миллисекундах
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    export default getDaysAgo;