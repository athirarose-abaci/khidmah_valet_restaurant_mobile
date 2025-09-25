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
        entity_id: txn.entity?.id,
        plate: txn.vehicle?.plate_number || 'Unknown',
        amount: txn.entity?.rate || '0.00',
        time: moment(txn.created_at).format('h:mm A'),
        image: require('../assets/images/car_avatar.png'),
        modified_by: txn.modified_by?.full_name || 'Unknown',
        raw: txn,
        tax_type: txn.tax_type?.name,
      });
  
      return acc;
    }, {});
  
    return Object.keys(grouped).map(date => ({
      date,
      transactions: grouped[date],
    }));
  };

export default transformPaymentHistory;