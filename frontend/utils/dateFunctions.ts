import { format } from "date-fns";

const formatDate = (isoDate: string | undefined, includeWeekDay = false) => {

    if (isoDate == undefined) {
        return "";
    }
    const date = new Date(isoDate);
    if (includeWeekDay) {
        return " " + format(date, 'EEEE').toUpperCase() + ", " + format(date, 'dd.LLL.yyyy');
    }
    return format(date, 'dd.LLL.yyyy');
};

const calculateDate = (isoDate: string | undefined) => {
    if (isoDate == undefined) {
        return "";
    }
    let targetDate = new Date(isoDate);
    const now = new Date();

    const diff = targetDate.getTime() - now.getTime();
    if (isNaN(targetDate.getTime())) {
        return "InvalidDate";
    }
    if (now.toDateString() === targetDate.toDateString()) {
        const hours = Math.round(diff / (1000 * 60 * 60));

        if (hours === 0) {
            return "The date is now!";
        } else if (hours > 0) {
            return `${hours} hours from now`;
        } else {
            return `${Math.abs(hours)} hours ago`;
        }
    }
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            const hours = Math.round(diff / (1000 * 60 * 60));
            return `${hours} hour(s) from now`;
        }
        if (days > 29) {
            const months = Math.floor(days / 30);
            return `${months} month(s) from now`;
        } else {
            return `${days} day(s) from now`;
        }
    }

    // If the date is in the past
    else {
        const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));

        if (days === 0) {
            const hours = Math.round(Math.abs(diff) / (1000 * 60 * 60));
            return `${hours} hour(s) ago`;
        }
        if (days > 29) {
            const months = Math.floor(days / 30);
            return `${months} month(s) ago`;
        } else {
            return `${days} day(s) ago`;
        }
    }
}
export { calculateDate, formatDate };