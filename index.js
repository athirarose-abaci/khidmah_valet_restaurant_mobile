/**
 * @format
 */

import 'react-native-gesture-handler'; 
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ToastProvider } from './src/context/ToastContext';
import { Provider } from 'react-redux';
import store from './store';

const Root = () => {
    return (
        <Provider store={store}>
            <ToastProvider>
                <App />
            </ToastProvider>
        </Provider>

    )
}

AppRegistry.registerComponent(appName, () => Root);
