import MainRouter from './routes/MainRouter';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {

  return (
    <SafeAreaProvider>
      <MainRouter />
    </SafeAreaProvider>
  );
};

export default App;
