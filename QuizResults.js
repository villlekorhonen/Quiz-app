import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase('QuizDB.db');

export default function QuizResults() { // Lisää sulkevat sulkeet tähän

    const navigation = useNavigation();

    const [highScores, setHighScores] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists highScores (id integer primary key autoincrement, name text, score integer);');
        }, null, updateList);
    }, []);

    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from highScores order by score desc;', [], (_, { rows }) => {
                console.log('Select result:', rows._array);
                const sortedScores = rows._array.sort((a, b) => b.score - a.score);
                setHighScores(sortedScores);
                console.log('sorted score',sortedScores);
            });
        });
    } 

    return (
        <View style={styles.container}>
            <Text style={styles.header}>High Scores</Text>
            <FlatList
                style={{ marginLeft: 0 }}
                keyExtractor={item => item.id.toString()}
                data={highScores}
                renderItem={({ item }) => (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.header}>{item.name}, {item.score}</Text>
                    </View>
                )}
            />
        </View>
    ); // Lisää tämä sulkeet tähän
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        
    },
});


