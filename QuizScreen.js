import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Keyboard, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { quizData } from './quizData';
import * as SQLite from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';


const db = SQLite.openDatabase('QuizDB.db');

export default function App() {
    const navigation = useNavigation();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [name, setName] = useState('');
    const [highScores, setHighScores] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [usedQuestions, setUsedQuestions] = useState([]);


    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists highScores (id integer primary key autoincrement, name text, score integer);');
        }, null, updateList);
        generateNextQuestion();
    }, []);

    const saveScore = () => {
        console.log('Save score:', name, score);
        db.transaction(tx => {
            tx.executeSql('insert into highScores (name, score) values (?, ?);', [name, score], (_, result) => {
                console.log('insert result:', result);
                Keyboard.dismiss();
                Alert.alert("Your score has saved!")
                setShowScore(false);
                backToHome();
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
            setScore(prevscore => prevscore + 1);
        }

        setQuestionCount(prevCount => prevCount + 1);


        if (questionCount < 19) {
            generateNextQuestion();
        } else {
            setShowScore(true);
        }
    }

    const generateNextQuestion = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * quizData.length);
        } while (usedQuestions.includes(randomIndex));
        setCurrentQuestion(randomIndex);
        setUsedQuestions([...usedQuestions, randomIndex]);
    };

    const backToHome = () => {
        navigation.navigate('Home');
    }

    return (
        <View style={styles.container}>
            <LinearGradient

                colors={['rgba(0,0,0,0.9)', 'transparent']}
                style={styles.background}
            />
            <Image style={styles.image} source={require('./images/quiz-app_logo.png')} />

            {showScore ? <View>
                <Text style={styles.result}>Your</Text>
                <Text style={styles.result1}>Score:</Text>
                <Text style={styles.result2}>{score}</Text>
                <TextInput
                    placeholder="Name"
                    onChangeText={(text) => setName(text)}
                    value={name}
                    style={styles.nameInput}
                />
                <TouchableOpacity style={styles.scoreButton} title="Tallenna tulos" onPress={saveScore} >
                    <Text style={styles.saveButton}> Save score </Text>
                </TouchableOpacity>


            </View> :
                <View style={styles.questionContainer}>
                    <Text style={styles.question}> {quizData[currentQuestion]?.question} </Text>
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
        backgroundColor: '#015442',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionContainer: {
        backgroundColor: 'transparent',
        padding: 30,
        margin: 10,
        borderRadius: 5,
        fontSize: 28,
        width: '100%'
    },
    question: {
        fontSize: 25,
        color: 'white',
        fontWeight: '800',
    },
    optionStyle: {
        color: 'white',
        padding: 8,
        alignItems: 'center',
        fontSize: 18,
        fontWeight: '500',
    },
    optionContainer: {
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 15,
    },
    questionText: {
        fontSize: 24,
    },
    nameInput: {
        width: 200,
        height: 50,
        borderWidth: 0.5,
        borderColor: 'white',
        fontSize: 24,
        marginBottom: 10,
        color: 'white',
        marginTop: 10,
        backgroundColor: 'lightgrey'
    },
    scoreButton: {
        width: 200,
        height: 50,
        borderWidth: 2.5,
        borderColor: 'white',
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    saveButton: {
        fontSize: 25,
        marginLeft: 30,
        marginTop: 5,
        fontWeight: '500',
    },
    result: {
        fontSize: 35,
        marginTop: 40,
        marginLeft: 65,
        color: 'white',
    },
    result1: {
        fontSize: 35,
        marginBottom: 10,
        marginLeft: 55,
        color: 'white',
    },
    result2: {
        fontSize: 40,
        fontWeight: 'bold',
        marginLeft: 75,
        color: 'white',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 450,
    },
    image: {
        width: '50%'
    },
});
