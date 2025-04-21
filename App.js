import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import HomeScreen from "./src/screens/HomeScreen";
import AddXeScreen from "./src/screens/AddXeScreen";
import EditXeScreen from "./src/screens/EditXeScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#007AFF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Danh sách xe máy" }}
          />
          <Stack.Screen
            name="AddXe"
            component={AddXeScreen}
            options={{ title: "Thêm xe mới" }}
          />
          <Stack.Screen
            name="EditXe"
            component={EditXeScreen}
            options={{ title: "Sửa thông tin xe" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
