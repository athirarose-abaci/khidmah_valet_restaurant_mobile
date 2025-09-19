import moment from 'moment';

const transformRecentActivity = (apiResponse, limit = 5) => {
  const results = Array.isArray(apiResponse) ? apiResponse : apiResponse?.results;
  if (!Array.isArray(results)) return [];

  return results
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
    .map(txn => ({
      id: txn.id.toString(),
      plate: txn.vehicle?.plate_number || 'Unknown',
      amount: txn.rate || '0.00',
      time: moment(txn.created_at).format('h:mm A'), 
    }));
};

export default transformRecentActivity;
