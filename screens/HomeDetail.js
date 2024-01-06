import React, { useState,useEffect,useCallback,useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity ,ActivityIndicator,Button, TextInput, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable'; // Import the animatable package
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../constant/base';
import { useSelector } from 'react-redux';
import { removeAccessToken } from '../redux/auth';
import Icon from '@mdi/react';
import { mdiTrashCan,mdiHomePlus } from '@mdi/js';
import RoomDetail from './RoomDetail';
import UserManagement from './UserManagement';
const functionIcons = [
  require('../assets/smart-home.png'),
  require('../assets/account-details.png'),
  // Add more function icons as needed
];
const HomeDetail = ({navigation}) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const id = route.params.id;
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [chosenScreen , setChosenScreen] = useState(0);
  const getScreen = (chosenScreen) => {
    switch(chosenScreen) {
      case 0 : return <RoomDetail homeId={id}/>
      case 1 : return <UserManagement homeId={id}/>
    }
  }
  return (
    <View style={styles.container}>
        {getScreen(chosenScreen)}
      <View style={[styles.footer, { backgroundColor: '#E6E6E6' }]}>
        {functionIcons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={styles.footerIconContainer}
            onPress={() => {
              setChosenScreen(index)
            }}
          >
            <Image source={icon} style={styles.footerIcon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    justifyContent:'space-between'
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
    flexDirection : 'row-reverse',
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

export default HomeDetail;


// HomeDetailScreen.js
// HomeDetailScreen.js
// HomeDetailScreen.js
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// const rooms = [
//   { id: 1, name: 'Room 101', floor: 1 },
//   { id: 2, name: 'Room 102', floor: 1 },
//   { id: 3, name: 'Room 201', floor: 2 },
//   { id: 4, name: 'Room 202', floor: 2 },
//   // Add more rooms as needed
// ];
// // HomeDetailScreen.js
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 10,
//   },
//   header: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     marginBottom: 20,
//     borderRadius: 8,
//     flexDirection: 'row'
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   roomContainer: {
//     backgroundColor: '#e0e0e0',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   roomName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// const HomeDetail = () => {
//   const navigation = useNavigation();
//   const [selectedFloor, setSelectedFloor] = useState(null);

//   const categorizedRooms = rooms.reduce((acc, room) => {
//     const floor = room.floor;
//     if (!acc[floor]) {
//       acc[floor] = [];
//     }
//     acc[floor].push(room);
//     return acc;
//   }, {});

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//       {Object.keys(categorizedRooms).map((floor) => (
//         <TouchableOpacity
//           key={floor}
//           style={styles.header}
//           onPress={() => setSelectedFloor(floor)}
//         >
//           <Text style={styles.headerText}>Floor {floor}</Text>
//         </TouchableOpacity>
//       ))}
//       </View>
//       {selectedFloor && (
//         <FlatList
//           data={categorizedRooms[selectedFloor]}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.navigate('RoomDetail', { room: item });
//               }}
//             >
//               <View style={styles.roomContainer}>
//                 <Text style={styles.roomName}>{item.name}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default HomeDetail;
