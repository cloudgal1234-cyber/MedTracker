import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddMedicationScreen } from './src/screens/AddMedicationScreen';
import { MedicationDetailScreen } from './src/screens/MedicationDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Add" component={AddMedicationScreen} options={{ title: 'הוספת תרופה', headerBackTitle: 'חזרה' }} />
        <Stack.Screen name="Detail" component={MedicationDetailScreen} options={{ title: 'פרטי תרופה', headerBackTitle: 'חזרה' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
