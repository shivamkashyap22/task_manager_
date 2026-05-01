import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <PaperProvider>
      <StatusBar barStyle="light-content" />
      <RootNavigator />
    </PaperProvider>
  );
}