import React from "react"
import { TextInput } from 'react-native'
import styles from "./inputFieldStyle"

export default ({ onChange, placeholder, password = false, value, style = {} }) => {
    return <TextInput
        placeholder={placeholder}
        value={value}
        secureTextEntry={password}
        onChangeText={onChange}
        style={{
            ...styles.inputField,
            ...style
        }} />
}