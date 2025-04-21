import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const Banner = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideInterval = useRef(null);

  useEffect(() => {
    if (images.length > 1) {
      // Start auto-sliding when there are multiple images
      slideInterval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [images.length]);

  // Add effect to update scrollX when currentIndex changes
  useEffect(() => {
    if (images.length > 1) {
      Animated.timing(scrollX, {
        toValue: currentIndex * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentIndex, images.length]);

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: "Photo Permission Required",
              message: "App needs access to your photos to select images",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: "Storage Permission Required",
              message: "App needs access to your storage to select images",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages(newImages);
      setCurrentIndex(0);
      scrollX.setValue(0); // Reset scroll position
    }
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <TouchableOpacity onPress={pickImage} style={styles.sliderContainer}>
          {images.length > 1 ? (
            <Animated.View
              style={[
                styles.slider,
                {
                  transform: [
                    {
                      translateX: scrollX.interpolate({
                        inputRange: images.map((_, i) => i * width),
                        outputRange: images.map((_, i) => -i * width),
                      }),
                    },
                  ],
                },
              ]}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.banner}
                />
              ))}
            </Animated.View>
          ) : (
            <Image source={{ uri: images[0] }} style={styles.banner} />
          )}
          {images.length > 1 && (
            <View style={styles.indicatorContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
          <Text style={styles.placeholderText}>Chọn ảnh từ thư viện</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: "100%",
    marginBottom: 10,
  },
  sliderContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  slider: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  banner: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
});

export default Banner;
