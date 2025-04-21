import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Animated } from "react-native";

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  keyboardType = "default",
  multiline = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(value ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const labelStyle = {
    position: "absolute",
    left: 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 25 : 18, 6],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [error ? "#f44336" : "#666", error ? "#f44336" : "#2196F3"],
    }),
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const containerStyle = [
    styles.container,
    multiline && styles.multilineContainer,
    error && styles.errorContainer,
    style,
  ];

  const inputStyle = [
    styles.input,
    multiline && styles.multilineInput,
    isFocused && styles.focused,
    error && styles.inputError,
    value && styles.hasValue,
  ];

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ""}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  container: {
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  multilineContainer: {
    height: 120,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "#f44336",
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingVertical: 8,
    marginTop: 14,
    color: "#333",
    backgroundColor: "transparent",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  focused: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  inputError: {
    borderBottomWidth: 2,
    borderBottomColor: "#f44336",
  },
  hasValue: {
    color: "#333",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default CustomInput;
