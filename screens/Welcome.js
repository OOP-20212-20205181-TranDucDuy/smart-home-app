import React, { useState,useEffect,useCallback,useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity ,ActivityIndicator,Button, TextInput, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable'; // Import the animatable package
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../constant/base';
import { useSelector } from 'react-redux';
import { removeAccessToken } from '../redux/auth';
import Icon from '@mdi/react';
import { mdiTrashCan,mdiHomePlus } from '@mdi/js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const functionIcons = [
  require('../assets/smart-home.png'),
  require('../assets/smart-home.png'),
  require('../assets/smart-home.png'),
  // Add more function icons as needed
];

const Welcome = ({navigation}) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [page,setPage] = useState(1);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isSearchMenuVisible, setSearchMenuVisible] = useState(false);
  const [isUpdateScreen,setUpdateScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [houseid, setHouseId] = useState('');
  const [house , setHouse] = useState({});
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [homeName, setHomeName] = useState(null);
  const [floor, setFloor] = useState(0);
  const [roomName, setRoomName] = useState('');
  const [listRoom, setListRoom] = useState([]);
  const [numfloors,setNumFloors] = useState(0);
  const [err,setError] = useState('');
  const fetchData = async () => {
    try {
      const response = await axios.get(baseUrl + `/home/owner/retriveHome?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setItems(response.data);
      console.log(accessToken);
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
  useEffect(() => {
    fetchData();
  },[])
  const toggleMenu = () => {
    setError('')
    setHomeName('');
    setNumFloors(0);
    setListRoom([]);
    setMenuVisible(!isMenuVisible);
  };
  const toggleUpdateScreen = () => {
    setUpdateScreen(!isUpdateScreen);
  };
  const toggleSearchMenu = () => {
    setError('');
    setHouse('');
    setSearchMenuVisible(!isSearchMenuVisible);
  };
  const handleSaveHome = async () => {
    console.log("listRoom");
    setIsSaveLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/home`,{
        name: homeName,
        rooms : listRoom,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      )
      setIsSaveLoading(false);
      fetchData();
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
  }
  const handleDeleteHome = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/home/${id}`,
     { headers: {
        Authorization: `Bearer ${accessToken}`,
      }})
      console.log(accessToken)
      fetchData();
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }
  const handleRefresh = () => {
      setRefreshing(true)
      fetchData()
      setRefreshing(false)
  };
  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${baseUrl}/home/${id}`,
        {
          name : homeName,
        },
        {
          headers:{
            Authorization: `Bearer ${accessToken}`,
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  };
  const addRoom = () => {
    setListRoom([...listRoom, { name: roomName, floor: floor }]);
    setRoomName('');
    setFloor(0);
  };

  const removeRoom = (index) => {
    const updatedList = [...listRoom];
    updatedList.splice(index, 1);
    setListRoom(updatedList);
  };
  const searchHome = async (id) => {
    setError('');
    try {
      const response = await axios.get(`${baseUrl}/home/${id}`,{
        headers : {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      if(response.data.result == false){
        setError(response.data.message)
      }
      setHouse(response.data.result);
    } catch (error) {
     if(error.response.status === 500){
      setError('Invalid input')
     }
    }
  }
  const joinHome = async (id) => {
    
    try {
      console.log(id)
      console.log(accessToken) 
      const response = await axios.post(`${baseUrl}/home/${id}/members`, {} , {
        headers : {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      if(response.data.result === false){
        alert(response.data.message);
      }
      console.log("hello");
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={styles.container} >
      <View style={styles.header}>
        <Text style={styles.title}>Home List</Text>
        <View style = {{flexDirection : 'row'}}>
        <TouchableOpacity onPress={toggleMenu}>
                <MaterialCommunityIcons 
                  name = 'home-plus'
                  color={'coral'}
                  size={30}
                />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSearchMenu}>
                <MaterialCommunityIcons 
                  name = 'home-search'
                  color={'coral'}
                  size={30}
                />
        </TouchableOpacity>
        </View>
        <Modal isVisible={isSearchMenuVisible}>
        <Animatable.View // Wrap the menu content in an Animatable.View
          animation="slideInRight" // Use a slide-in animation
          duration={400} // Animation duration in milliseconds
          style={styles.menuContainer}
        >
          <TouchableOpacity style={{
            alignItems:"flex-end"
          }}
          onPress={toggleSearchMenu}
          >
            <MaterialCommunityIcons
              name='close-circle'
              color={'coral'}
              size={30}
            />
          </TouchableOpacity>
          <View style = {{flexDirection : 'row',justifyContent : 'space-between'}}>
          <TextInput
                    style={styles.menuItem}
                    placeholder="Home id"
                    value={houseid}
                    onChangeText={(text) => setHouseId(text)}
                />
          <TouchableOpacity onPress={() => searchHome(houseid)}>
                <MaterialCommunityIcons 
                  name = 'home-search'
                  color={'coral'}
                  size={30}
                />
          </TouchableOpacity>
          </View>
          <Text style={styles.tableHeader}>Home Table</Text>
          <View style={styles.row}>
            <Text style={styles.cell}>Home Name</Text>
            <Text style={styles.cell}>{house.name}</Text>

            {/* Add more cells for additional home properties */}
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Geo name</Text>
            <Text style={styles.cell}>{house.geo_name}</Text>
            {/* Add more cells for additional home properties */}
          </View>
          {err !== '' ? (<View><Text>{err}</Text></View>) :
            (<View>
              <TouchableOpacity onPress={() => joinHome(houseid)} style={styles.closeButton}>
                  <Text>Join Home</Text>
                </TouchableOpacity>
            </View>)
          }
          </Animatable.View>
          </Modal>
      </View>
      <Modal isVisible={isMenuVisible}>
        <Animatable.View // Wrap the menu content in an Animatable.View
          animation="slideInRight" // Use a slide-in animation
          duration={400} // Animation duration in milliseconds
          style={styles.menuContainer}
        >
          <TouchableOpacity style={{
            alignItems:"flex-end"
          }}
          onPress={toggleMenu}
          >
            <MaterialCommunityIcons
              name='close-circle'
              color={'coral'}
              size={30}
            />
          </TouchableOpacity>
          <ScrollView>
                <TextInput
                    style={styles.menuItem}
                    placeholder="House Name"
                    value={homeName}
                    onChangeText={(text) => setHomeName(text)}
                />
                 <TextInput
                    style={styles.menuItem}
                    keyboardType="numeric"
                    placeholder="Num of floor"
                    value={numfloors.toString()}
                    onChangeText={(text) => setNumFloors(parseInt(text) || 0)}
                />
                   {listRoom.map((room, index) => (
                    <View key={index} style={{ flexDirection: 'row' }}>
                      <TextInput
                        style={{ flex: 1, borderWidth: 1, margin: 5, padding: 5 }}
                        placeholder="Room Name"
                        value={room.name}
                        onChangeText={(text) => {
                          setListRoom((prevList) => {
                            const updatedList = [...prevList];
                            updatedList[index] = { ...room, name: text };
                            return updatedList;
                          });
                        }}
                      />
                      <TextInput
                        style={{ flex: 1, borderWidth: 1, margin: 5, padding: 5 }}
                        keyboardType="numeric"
                        placeholder="Room Floor"
                        value={room.floor.toString()}
                        onChangeText={(text) => {
                          setListRoom((prevList) => {
                            if(parseInt(text) > numfloors){
                                setError(`Error! Floor must be smaller than ${numfloors}`)
                            }
                            else {
                              setError('')
                            }
                            const updatedList = [...prevList];
                            updatedList[index] = { ...room, floor: parseInt(text) || 0 };
                            return updatedList;
                          });
                        }}
                      />
                      
                    <TouchableOpacity onPress={() => removeRoom(index)} style={{ alignItems: 'flex-end' }}>
                      <MaterialCommunityIcons name="minus-circle" color="green" size={30} />
                    </TouchableOpacity>
                  </View>
                ))}
                {err !== '' ? (<View><Text style = {{color : red}}>{err}</Text></View>):(
                <TouchableOpacity onPress={addRoom} style={styles.closeButton}>
                  <Text>Add Room</Text>
                </TouchableOpacity>)}
          {isSaveLoading ? <ActivityIndicator size="large" color="#385898" /> :
            <TouchableOpacity style={styles.closeButton} onPress={handleSaveHome}>
              <Text>Save</Text>
            </TouchableOpacity>
          }
          </ScrollView>
        </Animatable.View>
      </Modal>
      <View style={styles.content}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.homeBox}>
              <View style={styles.homeBoxRow}>
                <Text style={styles.homeName}>{item.name}</Text>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity 
                  onPress={() => handleDeleteHome(item.id)}
                  color="#FF0000" // Change the button color to red
                ><MaterialCommunityIcons 
                  name = 'minus-circle'
                  color={'red'}
                  size={30}
                  alignItems='center'
                />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={toggleUpdateScreen}
                  color="#FF0000" // Change the button color to red
                ><MaterialCommunityIcons 
                  name = 'dots-horizontal-circle-outline'
                  color={'red'}
                  size={30}
                  alignItems='center'
                />
                </TouchableOpacity>
                <Modal isVisible={isUpdateScreen}>
                  <Animatable.View // Wrap the menu content in an Animatable.View
                    animation="slideInRight" // Use a slide-in animation
                    duration={400} // Animation duration in milliseconds
                    style={styles.menuContainer}
                  >
                    <TouchableOpacity style={{
                      alignItems:"flex-end"
                    }}
                    onPress={toggleUpdateScreen}
                    >
                      <MaterialCommunityIcons
                        name='close-circle'
                        color={'coral'}
                        size={30}
                      />
                    </TouchableOpacity>
                    <ScrollView>
                          <TextInput
                              style={styles.menuItem}
                              placeholder="House Name"
                              value={homeName}
                              onChangeText={(text) => setHomeName(text)}
                          />
                            {/* <TextInput
                              style={styles.menuItem}
                              placeholder="Geo name"
                              value={homeName}
                              onChangeText={(text) => setHomeName(text)}
                          />
                          <TextInput
                              style={styles.menuItem}
                              placeholder="Ion"
                              value={homeName}
                              onChangeText={(text) => setHomeName(text)}
                          />
                          <TextInput
                              style={styles.menuItem}
                              placeholder="Iat"
                              value={homeName}
                              onChangeText={(text) => setHomeName(text)}
                          /> */}
                    {isSaveLoading ? <ActivityIndicator size="large" color="#385898" /> :
                      <TouchableOpacity style={styles.closeButton} onPress={() =>(handleUpdate(item.id))}>
                        <Text>Save</Text>
                      </TouchableOpacity>
                    }
                    </ScrollView>
                  </Animatable.View>
                </Modal>
                </View>
              </View>
              <Text style={styles.homeDescription}>{item.geo_name}</Text>
              <TouchableOpacity
                style={styles.footerIconContainer}
                onPress={() => navigation.navigate('HomeDetail',{
                  id: item.id, 
                })}
              >
                <Text style={styles.buttonText}>Go To Home</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<View style={{alignItems: 'center'}}><Text>Add New Home</Text></View>}
          ListHeaderComponent={<View style={styles.footerIconContainer}>
          </View>}
          ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#385898" /> : null}
          refreshing= {refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  // ...
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
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

export default Welcome;
