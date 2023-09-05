import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import audio from "../assets/audio/audio.mp3"


export default function HomeScreen({ route }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();
    const [itensSalvos, setItensSalvos] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        carregarItensSalvos();
    }, []);

    const carregarItensSalvos = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@itensSalvos');
            const itens = jsonValue != null ? JSON.parse(jsonValue) : [];
            setItensSalvos(itens);
        } catch (error) {
            console.error('Erro ao carregar itens salvos:', error);
        }
    };

    const tocarSom = async () => {
        try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync(audio);
            await soundObject.playAsync();

        } catch (error) {
            console.error('Erro ao reproduzir o som:', error);
        }
    }


    const returnFileLocation = (qrData) => {
        for (let item of itensSalvos) {
            if (item.idItem === qrData) {
                return item.localizacaoAudio;
            }
        }
        return undefined;
    }

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        const file = returnFileLocation(data);
        if (file) {
            tocarSom();
            navigation.navigate('PlayerScreen', { audioFileLocation: file });
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject} />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    barCodeView: {
        width: '100%',
        height: '50%',
        marginBottom: 40
    },
});