import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation, useNavigationState } from '@react-navigation/native';
import audio from "../assets/audio/audio.mp3"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        width: 94,
        height: 94,
        borderRadius: 47,
        backgroundColor: "#b3b3b3",
        alignItems: "center",
        justifyContent: "center"
    },
    pressed: {
        backgroundColor: "#a3a3a3"
    }
});


export default function PlayerScreen({ route }) {
    const navigation = useNavigation();
    const navigationState = useNavigationState(state => state);
    var audioFileLocation = route.params?.audioFileLocation;

    const [sound, setSound] = useState(null);
    const [playingAudio, setPlayingAudio] = useState(false);

    useEffect(() => {
        async function loadAudio() {
            try {
                audioFileLocation = route.params?.audioFileLocation;
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioFileLocation },
                    { shouldPlay: false },
                    onPlaybackStatusUpdate
                );
                if (sound) {
                    setSound(sound);
                }
            } catch (error) {
                console.log('Error loading audio:', error);
            }
        }

        loadAudio();

        return async () => {
            if (sound) {
                await sound.pauseAsync();
                await sound.unloadAsync();
                setPlayingAudio(false);
            }
        };
    }, [navigationState]);

    async function handleAudioPlay() {
        if (sound) {
            if (!playingAudio) {
                await sound.playAsync();
            } else {
                await sound.pauseAsync();
            }
            setPlayingAudio(!playingAudio);
        }
    }

    useEffect(() => {
        audioFileLocation = route.params?.audioFileLocation;
        if (sound) {
            async () => {
                await sound.pauseAsync();
                await sound.unloadAsync();
            }
        }
        setPlayingAudio(false);
    }, [navigationState]);

    async function handleAudioSeekBackward() {
        if (sound) {
            const status = await sound.getStatusAsync();
            const position = status.positionMillis - 10000;
            await sound.setPositionAsync(position > 0 ? position : 0);
        }
    }

    function onPlaybackStatusUpdate(status) {
        try {
            if (status.isLoaded && status.positionMillis === status.durationMillis) {
                tocarSom();
                setPlayingAudio(false);
                navigation.navigate('HomeScreen');
            }
        } catch (error) {
            console.log('Error handling playback status update:', error);
        }
    }

    const tocarSom = async () => {
        try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync(audio);
            await soundObject.playAsync();

        } catch (error) {
            console.error('Erro ao reproduzir o som:', error);
        }
    }

    return (

        <View style={styles.container}>
            <Pressable style={[styles.button]}
                accessibilityHint={playingAudio ? "Pausar áudio" : "Retomar áudio"}
                onPress={() => { handleAudioPlay() }}
            >

                <MaterialIcons name={(playingAudio ? "pause" : "play-arrow")}
                    size={44}
                    color="#212121"
                />
            </Pressable>
            <View style={{ height: 30 }} />
            <Pressable
                style={[styles.button]}
                accessibilityHint="Voltar 10 segundos"
                onPress={handleAudioSeekBackward}
            >
                <MaterialIcons name="replay-10" size={44} color="#212121" />
            </Pressable>

        </View >
    )
}

