import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { addXeMay } from "../redux/xeMaySlice";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import Toast from "react-native-toast-message";

const AddXeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ten_xe_ph56584: "",
    mau_sac_ph56584: "",
    gia_ban_ph56584: "",
    mo_ta_ph56584: "",
    hinh_anh_ph56584: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Thêm thành công",
      text2: "Xe mới đã được thêm vào danh sách",
      position: "top",
      visibilityTime: 2000,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ten_xe_ph56584.trim()) {
      newErrors.ten_xe_ph56584 = "Vui lòng nhập tên xe";
    }

    if (!formData.mau_sac_ph56584.trim()) {
      newErrors.mau_sac_ph56584 = "Vui lòng nhập màu sắc";
    }

    if (!formData.gia_ban_ph56584) {
      newErrors.gia_ban_ph56584 = "Vui lòng nhập giá bán";
    } else if (
      isNaN(parseFloat(formData.gia_ban_ph56584)) ||
      parseFloat(formData.gia_ban_ph56584) <= 0
    ) {
      newErrors.gia_ban_ph56584 = "Giá bán phải là số dương";
    }

    if (!formData.mo_ta_ph56584.trim()) {
      newErrors.mo_ta_ph56584 = "Vui lòng nhập mô tả";
    }

    if (!formData.hinh_anh_ph56584.trim()) {
      newErrors.hinh_anh_ph56584 = "Vui lòng nhập URL hình ảnh";
    } else if (!formData.hinh_anh_ph56584.match(/^https?:\/\/.+/)) {
      newErrors.hinh_anh_ph56584 = "URL hình ảnh không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("Submitting new xe with data:", {
        ...formData,
        gia_ban_ph56584: parseFloat(formData.gia_ban_ph56584),
      });

      const result = await dispatch(
        addXeMay({
          ...formData,
          gia_ban_ph56584: parseFloat(formData.gia_ban_ph56584),
        })
      ).unwrap();

      console.log("Add result:", result);
      showSuccessToast();
      navigation.goBack();
    } catch (error) {
      console.error("Error adding data:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      Alert.alert(
        "Lỗi thêm xe",
        `Không thể thêm xe mới. Chi tiết lỗi: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <CustomInput
          label="Tên xe"
          value={formData.ten_xe_ph56584}
          onChangeText={(text) => handleChange("ten_xe_ph56584", text)}
          placeholder="VD: Honda Wave Alpha"
          style={styles.input}
          error={errors.ten_xe_ph56584}
        />
        <CustomInput
          label="Màu sắc"
          value={formData.mau_sac_ph56584}
          onChangeText={(text) => handleChange("mau_sac_ph56584", text)}
          placeholder="VD: Đỏ, Đen, Xanh"
          style={styles.input}
          error={errors.mau_sac_ph56584}
        />
        <CustomInput
          label="Giá bán"
          value={formData.gia_ban_ph56584}
          onChangeText={(text) => handleChange("gia_ban_ph56584", text)}
          placeholder="VD: 18500000"
          keyboardType="numeric"
          style={styles.input}
          error={errors.gia_ban_ph56584}
        />
        <CustomInput
          label="Mô tả"
          value={formData.mo_ta_ph56584}
          onChangeText={(text) => handleChange("mo_ta_ph56584", text)}
          placeholder="Nhập thông tin mô tả về xe"
          multiline
          style={styles.input}
          error={errors.mo_ta_ph56584}
        />
        <CustomInput
          label="URL Hình ảnh"
          value={formData.hinh_anh_ph56584}
          onChangeText={(text) => handleChange("hinh_anh_ph56584", text)}
          placeholder="VD: https://example.com/image.jpg"
          style={styles.input}
          error={errors.hinh_anh_ph56584}
        />
        {formData.hinh_anh_ph56584 ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: formData.hinh_anh_ph56584 }}
              style={styles.previewImage}
              onError={() => {
                setErrors((prev) => ({
                  ...prev,
                  hinh_anh_ph56584:
                    "Không thể tải hình ảnh. Vui lòng kiểm tra lại URL",
                }));
              }}
            />
          </View>
        ) : null}
        <CustomButton
          title={isSubmitting ? "Đang thêm..." : "Thêm xe"}
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          disabled={isSubmitting}
        />
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 8,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: "#90CAF9",
  },
});

export default AddXeScreen;
