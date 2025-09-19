// utils/mergePaymentHistory.js
export default function mergePaymentHistory(oldSections = [], newSections = []) {
    const map = {};
  
    // copy the existing sections into the map
    oldSections.forEach(sec => {
      map[sec.date] = [...sec.transactions];
    });
  
    // merge or append the new page
    newSections.forEach(sec => {
      if (map[sec.date]) {
        map[sec.date] = [...map[sec.date], ...sec.transactions];   // same date → append
      } else {
        map[sec.date] = [...sec.transactions];                     // new date → create section
      }
    });
  
    // convert map back to the [{ date, transactions }] shape
    return Object.keys(map).map(date => ({
      date,
      transactions: map[date],
    }));
  }