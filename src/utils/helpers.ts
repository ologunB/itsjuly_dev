export const generateOTP = (numDigits = 4) => {
    if (numDigits <= 0) {
        return "";
    }

    const min = Math.pow(10, numDigits - 1);
    const max = Math.pow(10, numDigits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
};
