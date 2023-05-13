import React, { useEffect, useState } from "react"
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Compose from "./pages/Compose";
import CommentPage from "./pages/CommentPage";

export default () => {
    const Stack = createNativeStackNavigator()
  
    return <NavigationContainer>
        <Stack.Navigator
             initialRouteName="auth">
            <Stack.Screen
                name="auth"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="home"
                component={Home}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="settings"
                component={Settings}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="post"
                component={Compose}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="comments"
                component={CommentPage}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
}