import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { baseUrl } from '../constant/base';
import { useSelector } from 'react-redux';

const MemberBox = ({ data, handleAccept,handleReject, isJoined }) => (
  <View style={[styles.box, isJoined ? styles.joinedBox : styles.notJoinedBox]}>
    <Text style={styles.header}>{isJoined ? 'Joined Members' : 'Not Joined Members'}</Text>
    {data.map(item => (
      <View style={styles.memberContainer} key={item.id}>
        <Text style={styles.memberName}>{item.email}</Text>
        {!isJoined && (
          <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
              <Text style={styles.acceptButtonText}>Reject</Text>
            </TouchableOpacity>
      </View>
    ))}
  </View>
);


const UserManagement = ({ homeId }) => {
  const [isMembersVisible, setMembersVisible] = useState(false);
  const [isRequestsVisible, setRequestsVisible] = useState(false);
  const [owner, setOwner] = useState({});
  const [joinedMembers, setJoinedMembers] = useState([]);
  const [notJoinedMembers, setNotJoinedMembers] = useState([]);
  const [boxHeight, setBoxHeight] = useState(0);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const toggleMembersVisibility = () => {
    setMembersVisible(!isMembersVisible);
    setRequestsVisible(false);
  };

  const toggleRequestsVisibility = () => {
    setMembersVisible(false);
    setRequestsVisible(!isRequestsVisible);
  };
  const toggleAddMemberMenu = () => {
    toggleVisibility(false);
  };
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/home/${homeId}/members`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOwner(response.data.owner);
      setJoinedMembers(response.data.joined_member);
      setNotJoinedMembers(response.data.not_joined_member);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (userId) => {
    try {
      const response = await axios.post(`${baseUrl}/home/${homeId}/members/${userId}`, {} ,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      console.log(response.data);
      fetchUserData();
    } catch (error) {
      // handle error
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await axios.delete(`${baseUrl}/home/${homeId}/members/${userId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      console.log(response.data);
      fetchUserData();
    } catch (error) {
      // handle error
    }
  }
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity onPress={toggleAddMemberMenu}>
          <MaterialCommunityIcons
            name='plus-circle'
            color={'#2ecc71'}
            size={30}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.touchableOpacity} onPress={toggleMembersVisibility}>
        <Text style={styles.buttonText}>Members In Home</Text>
      </TouchableOpacity>

      {isMembersVisible && (
        <MemberBox data={joinedMembers} handleAccept={handleAccept} handleReject={handleReject} isJoined />
      )}

      <TouchableOpacity style={styles.touchableOpacity} onPress={toggleRequestsVisibility}>
        <Text style={styles.buttonText}>Request To Join Home</Text>
      </TouchableOpacity>

      {isRequestsVisible && (
        <MemberBox data={notJoinedMembers} handleAccept={handleAccept} handleReject={handleReject}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  touchableOpacity: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#fff',
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    
  },
  memberName: {
    fontSize: 16,
    color: '#fff',
  },
  box: {
    overflow: 'hidden',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#3498db',
    shadowColor: '#2c3e50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  animatedBox: {
    height: 'auto',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
    padding: 8,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UserManagement;
