import moment from 'moment';

const transformPaymentHistory = (results) => {
    if (!Array.isArray(results)) return [];
  
    const grouped = results.reduce((acc, txn) => {
      const dateKey = moment(txn.created_at).format('MMM DD, YYYY').toUpperCase();
  
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
  
      acc[dateKey].push({
        id: txn.id.toString(),
        plate: txn.vehicle?.plate_number || 'Unknown',
        amount: txn.rate || '0.00',
        time: moment(txn.created_at).format('h:mm A'),
        image: require('../assets/images/car_avatar.png'),
      });
  
      return acc;
    }, {});
  
    return Object.keys(grouped).map(date => ({
      date,
      transactions: grouped[date],
    }));
  };

export default transformPaymentHistory;