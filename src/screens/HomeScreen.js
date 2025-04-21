import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Text,
  ActivityIndicator,
  Animated,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchXeMay, deleteXeMay } from "../redux/xeMaySlice";
import Banner from "../components/Banner";
import CustomButton from "../components/CustomButton";
import SearchBar from "../components/SearchBar";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.xeMay);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const checkmarkScale = new Animated.Value(0);

  useEffect(() => {
    console.log("HomeScreen mounted, fetching data...");
    dispatch(fetchXeMay());
  }, [dispatch]);

  useEffect(() => {
    if (items) {
      const filtered = items.filter((item) =>
        item.ten_xe_ph56584.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items, searchText]);

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Xóa thành công",
      text2: "Xe đã được xóa khỏi danh sách",
      position: "top",
      visibilityTime: 2000,
    });
  };

  const animateCheckmark = () => {
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(checkmarkScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedItem(null);
    });
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleDelete = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa xe này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          setSelectedItem(id);
          setIsDeleting(true);
          setTimeout(() => {
            dispatch(deleteXeMay(id));
            showSuccessToast();
            setIsDeleting(false);
            animateCheckmark();
          }, 1000);
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setTimeout(() => {
      navigation.navigate("EditXe", { xe: item });
      setIsEditing(false);
      setSelectedItem(null);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.ten_xe_ph56584}</Text>
        <Text style={styles.text}>Màu sắc: {item.mau_sac_ph56584}</Text>
        <Text style={styles.text}>
          Giá bán: {item.gia_ban_ph56584.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.text} numberOfLines={2}>
          {item.mo_ta_ph56584}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <CustomButton
          title="Sửa"
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        />
        <CustomButton
          title="Xóa"
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Banner />
      <SearchBar onSearch={handleSearch} />
      <CustomButton
        title="Thêm xe mới"
        onPress={() => navigation.navigate("AddXe")}
        style={styles.addButton}
      />
      {status === "loading" ? (
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      ) : status === "failed" ? (
        <Text style={styles.errorText}>Có lỗi xảy ra khi tải dữ liệu</Text>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
      <Modal
        visible={isEditing}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isDeleting}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleting(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f44336" />
            <Text style={styles.loadingText}>Đang xóa...</Text>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  addButton: {
    margin: 16,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#f44336",
  },
  loadingSpinner: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
});

export default HomeScreen;
