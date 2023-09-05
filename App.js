import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./screens/HomeScreen.js";
import SettingsScreen from "./screens/SettingsScreen.js";
import PlayerScreen from "./screens/PlayerScreen.js";
import ItemFormScreen from "./screens/ItemFormScreen.js";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarVisible: route.name !== 'Player',
                tabBarStyle: [{ display: 'flex' }, null]
            })}>
                <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ unmountOnBlur: true, title: 'Tela Inicial' }} />
                <Tab.Screen name="PlayerScreen" component={PlayerScreen} options={{
                    key: 'PlayerScreen',
                    forceRender: true, unmountOnBlur: false, tabBarButton: () => null, tabBarVisible: false, title: ''
                }} />
                <Tab.Screen name="SettingsScreen" component={SettingsScreen} options={{ unmountOnBlur: true, title: 'Tela de Configurações' }} />
                <Tab.Screen name="ItemFormScreen" component={ItemFormScreen} options={{ unmountOnBlur: true, title: 'Formulário de Item', tabBarButton: () => null, tabBarVisible: false }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
