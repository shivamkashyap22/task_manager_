import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../presentation/state/authStore';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { ActivityIndicator, View } from 'react-native';

const RootNavigator = () => {
  const { firebaseUser, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {firebaseUser ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;