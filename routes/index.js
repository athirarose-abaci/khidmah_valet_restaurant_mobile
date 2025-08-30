import Login from "../src/screens/Login";
import Dashboard from "../src/screens/Dashboard";
import Profile from "../src/screens/Profile";
import PaymentHistory from "../src/screens/PaymentHistory";
import ValidatePayment from "../src/screens/ValidatePayment";
import PaymentValidationSuccessfull from "../src/screens/PaymentValidationSuccessfull";

const publicRoutes = [
  { name: 'Login', component: Login },
];

const privateRoutes = [
  { name: 'Dashboard', component: Dashboard },
  { name: 'Profile', component: Profile },
  { name: 'PaymentHistory', component: PaymentHistory },
  { name: 'ValidatePayment', component: ValidatePayment },
  { name: 'PaymentValidationSuccessfull', component: PaymentValidationSuccessfull },
];

export { publicRoutes, privateRoutes };
