import React from 'react';
import { View, Text , Switch} from 'react-native';

// Define device codes
const LIGHT_DEVICE = '0';
const TEMPERATURE_SENSOR = '1';

export function convertValue(code, value) {
  console.log(value);

  if (code == LIGHT_DEVICE) {
    const data = JSON.parse(value);
    const typedData = data;

    return {component : (
      <View>
        <Text>Status: {typedData.lightStatus}</Text>
        <Switch></Switch>
      </View>
    ), newValue : {value}};
  }

  if (code == TEMPERATURE_SENSOR) {
    const data = JSON.parse(value);
    const typedData = data;
    return (
      <View>
        <Text>Temperature: {typedData.temperature}</Text>
        <Text>Humidity: {typedData.humidity}</Text>
      </View>
    );
  }

  // Return a default component for unknown device codes
  return <View><Text>Unknown Device Code</Text></View>;
}
