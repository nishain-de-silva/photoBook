import React from "react";
import { TextInput } from "react-native";
import styles from "./inputFieldStyle"

export default ({ onChange, placeholder, value, style = {} }) => {
    return <TextInput
        placeholder={placeholder}
        value={value}

        multiline
        numberOfLines={10}
        textAlignVertical="top"
        onChangeText={onChange}
        style={{
            ...styles.inputField,
            ...style
        }} />
}