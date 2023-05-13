import React, { PropsWithChildren } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export default ({ color="white", backgroundColor, children, onPress, style = {} }) => {
    return <TouchableOpacity 
        style={{ backgroundColor, borderRadius: 5, padding: 7, justifyContent: 'center', ...style }}
        onPress={onPress}>
        <Text style={{ color, 
            textAlign: "center",
            fontSize: 15, fontWeight: "600" }}>{children}</Text>
    </TouchableOpacity>
}