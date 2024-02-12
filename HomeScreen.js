import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";


export default function HomeScreen() {


    const navigation = useNavigation();

    const QuizPress = () => {
        navigation.navigate('Quiz');
    }

    const ResultsPress = () => {
        navigation.navigate('Results');
    }


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={QuizPress} style={styles.button}>
        <Text style={styles.buttonText}> Play the Game </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ResultsPress} style={styles.button}>
        <Text style={styles.buttonText}> Results </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: '10%',
    width: '50%'
  },
  buttonText: {
    fontSize: 15,
  },
});
