import MainRouter from './routes/MainRouter';
import { ThemeProvider } from './src/context/ThemeContext';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useDispatch } from 'react-redux';
import { setIsDarkMode } from './store/themeSlice';
import AbaciToast from './src/components/AbaciToast';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(setIsDarkMode(colorScheme === 'dark'));
    });

    return () => subscription?.remove();
  }, []);

  return (
    <ThemeProvider>
      <MainRouter />
      <AbaciToast />
    </ThemeProvider>
  );
};

export default App;
