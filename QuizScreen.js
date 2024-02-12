import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Keyboard } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { quizData } from './quizData';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('QuizDB.db');

export default function App() {
    const navigation = useNavigation();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [name, setName] = useState('');
    const [highScores, setHighScores] = useState([]);


    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists highScores (id integer primary key autoincrement, name text, score integer);');
        }, null, updateList);
    }, []);

    const saveScore = () => {
        console.log('Save score:', name, score);
        db.transaction(tx => {
            tx.executeSql('insert into highScores (name, score) values (?, ?);', [name, score], (_, result) => {
                console.log('insert result:', result);
                Keyboard.dismiss();
                Alert.alert("Your score has saved!")
                setShowScore(false);
            });
        }, null, updateList);

    }
 
    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from highScores order by score desc;', [], (_, { rows }) => {
                console.log('Select result:', rows._array);
                const sortedScores = rows._array.sort((a, b) => b.score - a.score); // Järjestää tulokset suurimmasta pienimpään
                setHighScores(sortedScores);
            });
        });
    } 
    
    



    const handleAnswer = (selectedAnswer) => {
        const answer = quizData[currentQuestion]?.answer;
        if (answer === selectedAnswer) {
            setScore((prevscore) => prevscore + 1);
        }


        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizData.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    }

    

    return (
        <View style={styles.container}>
            {showScore ? <View>
                <Text> Your Score: {score}</Text>
                <TextInput
                        placeholder="Nimi"
                        onChangeText={(text) => setName(text)}
                        value={name}
                        style={styles.nameInput}
                    />
                    <TouchableOpacity style={styles.scoreButton} title="Tallenna tulos" onPress={saveScore} />
                    
            
            </View> :
                <View style={styles.questionContainer}>
                    <Text> {quizData[currentQuestion]?.question} </Text>
                    {quizData[currentQuestion]?.options.map((item, index) => {
                        return <TouchableOpacity key={index} onPress={() => handleAnswer(item)} style={styles.optionContainer}>
                            <Text style={styles.optionStyle}> {item} </Text>
                        </TouchableOpacity>
                    })}
                </View>
            }
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
    questionContainer: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        borderRadius: 5,

    },
    optionStyle: {
        color: 'green',
        padding: 5,
        alignItems: 'center',
        fontSize: 18,
    },
    optionContainer: {
        borderColor: 'black',
        borderWidth: 2,
        marginTop: 15,
    },
    questionText: {
        fontSize: 24,
    },
    nameInput: {
        width: 100,
        height: 50,
        borderBottomWidth: 3,
        borderColor: 'black',
    },
    scoreButton: {
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 10,

    },
});
