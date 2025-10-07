
export function releaseDates(){

    const currentYear = new Date().getFullYear();
    let startDate = 1958;

    const yearList = [];

    for (let i = startDate; i <= currentYear; i++) {
        yearList.push(startDate);
        startDate++;
    };

    return yearList;
};



