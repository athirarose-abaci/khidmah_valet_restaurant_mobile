import Login from "../src/screens/Login";
import Dashboard from "../src/screens/Dashboard";
import Profile from "../src/screens/Profile";
import PaymentHistory from "../src/screens/PaymentHistory";
import ValidatePayment from "../src/screens/ValidatePayment";
import PaymentValidationSuccessfull from "../src/screens/PaymentValidationSuccessfull";
import PaymentHistoryDetails from "../src/screens/PaymentHistoryDetails";

const publicRoutes = [
  { name: 'Login', component: Login },
];

const privateRoutes = [
  { name: 'Dashboard', component: Dashboard },
  { name: 'Profile', component: Profile },
  { name: 'PaymentHistory', component: PaymentHistory },
  { name: 'ValidatePayment', component: ValidatePayment },
  { name: 'PaymentValidationSuccessfull', component: PaymentValidationSuccessfull },
  { name: 'PaymentHistoryDetails', component: PaymentHistoryDetails },
];

export { publicRoutes, privateRoutes };
