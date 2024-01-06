import React, { useState,useEffect,useCallback,useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity ,ActivityIndicator,Button, TextInput, ScrollView, Switch  } from 'react-native';
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable'; // Import the animatable package
import axios from 'axios';
import { baseUrl } from '../constant/base';
import { useSelector } from 'react-redux';
import { removeAccessToken } from '../redux/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import init from 'react_native_mqtt'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MQTT from 'sp-react-native-mqtt';
const LIGHT_DEVICE = '0';
const TEMPERATURE_SENSOR = '1';
const RBG = '2';
/* create mqtt client */
// MQTT.createClient({
//   uri: 'mqtt://test.mosquitto.org:1883',
//   clientId: 'your_client_id'
// }).then(function(client) {

//   client.on('closed', function() {
//     console.log('mqtt.event.closed');
//   });

//   client.on('error', function(msg) {
//     console.log('mqtt.event.error', msg);
//   });

//   client.on('message', function(msg) {
//     console.log('mqtt.event.message', msg);
//   });

//   client.on('connect', function() {
//     console.log('connected');
//     client.subscribe('/data', 0);
//     client.publish('/data', "test", 0, false);
//   });

//   client.connect();
// }).catch(function(err){
//   console.log(err);
// });

const RoomDetail = ({homeId}) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAddRoomMenuVisible , setAddRoomMenuVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [listRoomName, setListRoomName] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [floor, setFloor] = useState(0);
  const [err,setError] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isAddLoading , setIsAddLoading] = useState(false);
  const [isDevicesVisible, setDevicesVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [data, setData] = useState();
  const [rbg, setRbg] = useState({ red: 0, green: 0, blue: 0 });
  const [state, setState] = useState({
    status: 'disconnected',
    topic: 'yourTopic',
    subscribedTopic: null
  });
  const handleInputChange = (color, value) => {
    if (value === '') {
      setRbg({
        ...rbg,
        [color]: value,
      });
    } else {
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 255) {
        setRbg({
          ...rbg,
          [color]: newValue,
        });
      }
    }
  };
  useEffect(() => {
    let rbg_data = "{\"blue\":"+rbg.blue +",\"red\":"+rbg.red +",\"green\":"+rbg.green +"}";
    console.log(rbg_data);
    setData(rbg_data);
  }, [rbg]);
  // 
  const handleSwitchChange = async (newValue) => {
    let newData;
    setSwitchValue(!newValue);
    if(newValue == false){
      newData = "{\"lightStatus\":\"1\"}";
      setData(newData);
    }
    if(newValue == true){
      newData = "{\"lightStatus\":\"0\"}";
      setData(newData);
    }
  };
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  }
  const toggleAddRoomMenu = () => {
    setAddRoomMenuVisible(!isAddRoomMenuVisible);
  }
  const categorizedRooms = items.reduce((acc, room) => {
  const floor = room.floor;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(room);
    return acc;
  }, {});
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/home/${homeId}/room`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setItems(response.data.result);
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          dispatch(removeAccessToken());
          navigation.navigate('Login');
          alert('Unauthorized error:', error.response.data);
        } else if (error.response.status === 500) {
          alert('Internal Server Error:', error.response.data);
        }
      } else {
        console.log('Error:', error.message);
      }
    }
  };
  const addRoom = async () => {
    setIsAddLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/home/${homeId}/room`,{
        name : roomName,
        floor : floor
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      )
    } catch (error) {
      console.log(err)
    }
    fetchData();
    setIsAddLoading(false);
  }
  const addDevice = async (roomId,deviceId) => {
    console.log(deviceId);
    console.log("roomId :" +roomId);
    try {
      const response = await axios.post(`${baseUrl}/home/registerDevice` , {
        roomId,
        deviceId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }
  const handleExplainDevice = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/home/${homeId}/room/${id}/devices` ,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setDevices(response.data.result);
      setDevicesVisible(true);
      fetchData();
    }
    catch(error) {
      console.log(error);
    }
  }
  const removeDevice = async (roomid, deviceid) => {
    console.log(roomid);
    console.log(deviceid);
    try {
      const response = await axios.delete(`${baseUrl}/home/${homeId}/room/${roomid}/device/${deviceid}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      console.log(response.data);
      if(response.data.result === false){
        console.log(response.data);
      }
      handleExplainDevice(roomid);
    }
    catch (error) {
      console.log(error)
    }
  }
  const removeRoom = async (id) => {
    console.log(id);
    setIsAddLoading(true);
    try {
      const response = await axios.delete(`${baseUrl}/home/${homeId}/room/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    })
    console.log(response.data)
    } catch (error) {
      console.log(err)
    }
    fetchData();
    setIsAddLoading(false);
  }

  const saveStatusDevices = async (id,roomid) => {
    console.log(data)
    try {
      const response = await axios.post(`${baseUrl}/home/controlDevice` , {
        deviceId : id,
        value : data
      } ,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      handleExplainDevice(roomid);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    setDevicesVisible(true);
  },[])
  const convertValue = (code, value) => {
    const typedData = JSON.parse(value);
    if (code == LIGHT_DEVICE) {
      if(typedData.lightStatus == "1"){
        display = 'ON';
      }
      if(typedData.lightStatus == "0"){
        display = 'OFF';
      }

      let display;
      if(!switchValue){
        display = 'OFF';
      }
      if(switchValue){
        display = 'ON';
      }
      return (
        <View>
          <Text>Status: {display}</Text>
          <Switch
            value={switchValue}
            onValueChange={() => handleSwitchChange(switchValue)}
          />
        </View>
      );
    }
    if (code == TEMPERATURE_SENSOR) {
     
      return (
        <View>
          <Text>Temperature: {typedData.temperature}</Text>
          <Text>Humidity: {typedData.humidity}</Text>
        </View>
      );
    }
    if (code == RBG){
      return  (
        <View>
          {/* Display and change RGB values */}
          <Text>Blue: {typedData.blue}</Text>
          <TextInput
            placeholder="Blue value"
            value={rbg.blue.toString()}
            onChangeText={(text) => handleInputChange('blue', text)}
          />
          <Text>Red: {typedData.red}</Text>
          <TextInput
            placeholder="Red value"
            value={rbg.red.toString()}
            onChangeText={(text) => handleInputChange('red', text)}
          />
          <Text>Green: {typedData.green}</Text>
          <TextInput
            placeholder="Green value"
            value={rbg.green.toString()}
            onChangeText={(text) => handleInputChange('green', text)}
          />
        </View>
      );
    }
  
    // Return a default component for unknown device codes
    return <View><Text>Unknown Device Code</Text></View>;
  }
  return (
      <View>
         <View style={{
           backgroundColor: '#f0f0f0',
           padding: 10,
           marginBottom: 20,
           borderRadius: 8,
           flexDirection: 'row',
           justifyContent : 'space-between',
         }}>
        <Text style={styles.title}>Rooms</Text>
        <TouchableOpacity onPress={toggleAddRoomMenu}>
                <MaterialCommunityIcons 
                  name = 'plus-circle'
                  color={'green'}
                  size={30}
                />
        </TouchableOpacity>
        <Modal isVisible={isAddRoomMenuVisible}>
          <Animatable.View // Wrap the menu content in an Animatable.View
              animation="slideInRight" // Use a slide-in animation
              duration={400} // Animation duration in milliseconds
              style={styles.menuContainer}
          >
            <Text style = {styles.title}>Add Room</Text>
              <TouchableOpacity style={{
                  alignItems: "flex-end"
              }}
                  onPress={toggleAddRoomMenu}
              >
                  <MaterialCommunityIcons
                      name='close-circle'
                      color={'coral'}
                      size={30} />
              </TouchableOpacity>
              <ScrollView>
                  <TextInput
                      style={styles.menuItem}
                      placeholder="Room Name"
                      value={roomName}
                      onChangeText={(text) => setRoomName(text)} />
                  <TextInput
                       style={styles.menuItem}
                       keyboardType='numeric'
                       placeholder="Floor"
                       value={floor.toString()}
                       onChangeText={(text) => setFloor(parseInt(text))} />
                  
                  {isAddLoading ? <ActivityIndicator size="large" color="#385898" /> :
                      <TouchableOpacity onPress={addRoom} style={styles.closeButton}>
                      <Text>Add Room into Home</Text>
                  </TouchableOpacity>}
              </ScrollView>
          </Animatable.View>
        </Modal>
      </View>
      <View style={styles.header}>
        {Object.keys(categorizedRooms).map((floor) => (
          <TouchableOpacity
            key={floor}
            style={[
              styles.headerButton,
              selectedFloor === floor ? styles.selectedFloorButton : null,
            ]}
            onPress={() => {
              setSelectedFloor(floor);
              setDevicesVisible(false);
              console.log(selectedFloor);
            }}
          >
            <Text
              style={[
                styles.headerText,
                selectedFloor === floor ? styles.selectedHeaderText : null,
              ]}
            >
              Floor {floor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View>
              {selectedFloor && (
                  <FlatList
                      data={categorizedRooms[selectedFloor] || []}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <View style={styles.roomContainer}>
                            <TouchableOpacity onPress={() => handleExplainDevice(item.id)}>
                              <Text style={styles.roomName}>{item.name}</Text>
                              
                            </TouchableOpacity>
                            <View style ={{flexDirection : 'row'}}>
                            <TouchableOpacity onPress={toggleMenu}>
                                      <MaterialCommunityIcons
                                          name='plus-circle-outline'
                                          color={'green'}
                                          size={30} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeRoom(item.id)}>
                            <MaterialCommunityIcons
                                          name='minus-circle-outline'
                                          color={'red'}
                                          size={30} />
                            </TouchableOpacity>
                                  <Modal isVisible={isMenuVisible}>
                                      <Animatable.View // Wrap the menu content in an Animatable.View
                                          animation="slideInRight" // Use a slide-in animation
                                          duration={400} // Animation duration in milliseconds
                                          style={styles.menuContainer}
                                      >
                                        <Text style = {styles.title}>Add Device</Text>
                                          <TouchableOpacity style={{
                                              alignItems: "flex-end"
                                          }}
                                              onPress={toggleMenu}
                                          >
                                              <MaterialCommunityIcons
                                                  name='close-circle'
                                                  color={'coral'}
                                                  size={30} />
                                          </TouchableOpacity>
                                          <ScrollView>
                                              <TextInput
                                                  style={styles.menuItem}
                                                  placeholder="Device Id"
                                                  value={deviceId}
                                                  onChangeText={(text) => setDeviceId(text)} />
                                              <TouchableOpacity onPress={() => addDevice(item.id,deviceId)} style={styles.closeButton}>
                                                  <Text>Add Device into Room</Text>
                                              </TouchableOpacity>
                                              {/* {isSaveLoading ? <ActivityIndicator size="large" color="#385898" /> :
                                                  <TouchableOpacity style={styles.closeButton} onPress={saveRoom}>
                                                      <Text>Save</Text>
                                                  </TouchableOpacity>} */}
                                          </ScrollView>
                                      </Animatable.View>
                                  </Modal>
                            </View>  
                            {isDevicesVisible && (
                                <ScrollView>
                                  {devices.map((device) => (
                                    <View key={device.id} style={styles.deviceContainer}>
                                      <Text style={styles.deviceName}>{device.name}</Text>
                                      <Text style={styles.deviceName}>{convertValue(device.code,device.value)}</Text>
                                      <View>
                                      <TouchableOpacity  onPress={() => saveStatusDevices(device.id,item.id)}>
                                        <Text style={styles.closeButton}> Save </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity  onPress={() => removeDevice(item.id, device.id)}>
                                        <Text style={styles.closeButton}> Remove </Text>
                                      </TouchableOpacity>
                                      </View>
                                      
                                    </View>
                                  ))}
                                </ScrollView>
                              )}
                        </View>
                      )} />
              )}
          </View>
       
        </View>
    
  );
};

const styles = StyleSheet.create({
  deviceContainer: {
    backgroundColor: '#f0fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection : 'row',
    justifyContent : 'space-around'
    // Add any additional styles for the device container
  },

  deviceName: {
    fontSize: 16, // Add any desired styles for the device name
    fontWeight: 'bold',
    color: 'blue', // Add your preferred text color
    // Add any additional styles as needed
  },
  headerButton: {
    marginHorizontal: 10,
  },
  selectedFloorButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue', 
  },
  headerText: {
    color: 'black',
  },
  selectedHeaderText: {
    color: 'blue', // 
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    flexDirection: 'row'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roomContainer: {

    backgroundColor: '#e0e0e0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection : 'column',
    justifyContent : 'space-between'
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeBox: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical : 10,
    marginBottom: 20,
    borderRadius: 8,
    
  },
  homeName: {
    fontSize: 20,
    fontWeight: 'bold',
   
  },
  homeBoxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent : 'space-between'
  },
  homeDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  moreInfoButton: {
    backgroundColor: '#385898',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24, // Customize the font size
    fontWeight: 'bold', // Add bold style
    marginLeft: 10, // Adjust the margin for alignment
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal :10 // Allow the content to take up the remaining space
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: '#1877f2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerIconContainer: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 40,
    height: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default RoomDetail;

