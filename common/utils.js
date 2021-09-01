import { DEFAULT_CURRENCY } from "./constants";


export const getFileExtension = (filename) => {
    const lastDot = filename.lastIndexOf('.');
    const ext = filename.substring(lastDot + 1);
    return ext;
};

export const currencyFormatter = (data) => {
    return (data.amount*100/100).toLocaleString(data.currency, {
        style: 'currency',
        currency: data.currency,
    }); 
};