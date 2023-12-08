import React, { useState,useEffect,useCallback,useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity ,ActivityIndicator,Button, TextInput, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable'; // Import the animatable package
import axios from 'axios';
import { baseUrl } from '../constant/base';
import { useSelector } from 'react-redux';
import { removeAccessToken } from '../redux/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const RoomDetail = ({homeId}) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAddRoomMenuVisible , setAddRoomMenuVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [homeName, setHomeName] = useState(null);
  const [listRoomName, setListRoomName] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [floor, setFloor] = useState(0);
  const [err,setError] = useState('');
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isAddLoading , setIsAddLoading] = useState(false)
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
      console.log(response.data)
    } catch (error) {
      console.log(err)
    }
    fetchData();
    setIsAddLoading(false);
  }
  const saveRoom = () => {

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
  useEffect(() => {
    fetchData();
  },[])
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
                  style={styles.header}
                  onPress={() => {setSelectedFloor(floor);
                  console.log(selectedFloor)}}
              >
                  <Text style={styles.headerText}>Floor {floor}</Text>
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
                            <Text style={styles.roomName}>{item.name}</Text>
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
                                                  placeholder="Device Name"
                                                  value={homeName}
                                                  onChangeText={(text) => setHomeName(text)} />
                                              {listRoomName.map((name, index) => (
                                                  <View key={index} style={{ flexDirection: 'row' }}>
                                                      <TextInput
                                                          style={{ flex: 1, borderWidth: 1, margin: 5, padding: 5 }}
                                                          placeholder="Room Name"
                                                          value={name}
                                                          onChangeText={(text) => {
                                                              const updatedList = [...listRoomName];
                                                              updatedList[index] = text;
                                                              setListRoomName(updatedList);
                                                          } } />
                                                      <TouchableOpacity onPress={() => removeRoom(index)} style={{ alignItems: 'flex-end' }}>
                                                          <MaterialCommunityIcons name="minus-circle" color="green" size={30} />
                                                      </TouchableOpacity>
                                                  </View>
                                              ))}
                                              <TouchableOpacity onPress={addRoom} style={styles.closeButton}>
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
                        </View>
                      )} />
              )}
          </View>
       
        </View>
    
  );
};

const styles = StyleSheet.create({
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
    flexDirection : 'row',
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

