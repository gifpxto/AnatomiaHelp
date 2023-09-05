/* export default function ({ route }) {
    const navigation = useNavigation();
    const qrCodeData = route.params;

} */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';


const ItemFormScreen = ({ route }) => {
    const idEditar = route.params?.idEditar;
    let itemSubstituir = {};

    const navigation = useNavigation();
    const [idItem, setIdItem] = useState('');
    const [tituloItem, setTituloItem] = useState('');
    const [localizacaoAudio, setLocalizacaoAudio] = useState('');

    const [itensSalvos, setItensSalvos] = useState([]);

    useEffect(() => {
        carregarItensSalvos();
    }, []);

    useEffect(() => {
        salvarItens();
    }, [itensSalvos]);

    useEffect(() => {
        if (idEditar) {
            const itemSubstituir = itensSalvos.find(item => item.idItem === idEditar);
            if (itemSubstituir) {
                setIdItem(itemSubstituir.idItem)
                setTituloItem(itemSubstituir.tituloItem);
                setLocalizacaoAudio(itemSubstituir.localizacaoAudio);
            }
        }
    }, [idEditar, itensSalvos]);


    const carregarItensSalvos = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@itensSalvos');
            const itens = jsonValue != null ? JSON.parse(jsonValue) : [];
            setItensSalvos(itens);
        } catch (error) {
            console.error('Erro ao carregar itens salvos:', error);
        }
    };

    const salvarItens = async () => {
        try {
            const jsonValue = JSON.stringify(itensSalvos);
            await AsyncStorage.setItem('@itensSalvos', jsonValue);
        } catch (error) {
            console.error('Erro ao salvar itens:', error);
        }
    };

    const handleFormItem = async () => {
        console.log("'" + localizacaoAudio + "'");
        if (tituloItem === "" || localizacaoAudio === "" || localizacaoAudio === undefined || idItem === "") {
            Alert.alert(
                'Alerta',
                'Um ou mais campos estão vazios. Preencha-os para salvar!',
                [
                    {
                        text: 'OK',
                        style: 'ok'
                    }
                ]);
            return;
        }
        if (itensSalvos.some((item) => { return idItem == item.idItem }) && idItem != idEditar) {
            Alert.alert(
                'Alerta',
                "O id '" + idItem + "' já foi usado. Escolha outro para salvar!",
                [
                    {
                        text: 'OK',
                        style: 'ok'
                    }
                ]);
            return;
        }

        if (idEditar) {
            const itemIndex = itensSalvos.findIndex(item => item.idItem === idEditar);
            if (itemIndex !== -1) {
                const itemAtualizado = {
                    idItem: idItem,
                    tituloItem: tituloItem,
                    localizacaoAudio: localizacaoAudio
                };

                const novosItensSalvos = [...itensSalvos];
                novosItensSalvos.splice(itemIndex, 1, itemAtualizado);

                setItensSalvos(novosItensSalvos);
            }
        } else {
            const novoItem = { idItem, tituloItem, localizacaoAudio };
            setItensSalvos((prevItensSalvos) => [...prevItensSalvos, novoItem]);
        }

        Alert.alert(
            'Alerta',
            'Item salvo com sucesso!',
            [
                {
                    text: 'OK',
                    style: 'ok',
                    onPress: async () => {
                        setTituloItem("");
                        setLocalizacaoAudio("");
                        navigation.navigate("SettingsScreen");
                    }
                }
            ]);
        return;
    }

    const openFilePicker = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: "audio/*"
            });

            // Lógica para tratar o arquivo selecionado
            setLocalizacaoAudio(res.uri);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Caso o usuário tenha cancelado a seleção do arquivo
                setLocalizacaoAudio("");
            } else {
                // Tratar outros erros
                setLocalizacaoAudio("");
            }
        }
    };

    if (idEditar) {
        itemSubstituir = itensSalvos.find(item => item.idItem === idEditar);
    }

    return (
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                Id
            </Text>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 }}
                value={idItem}
                onChangeText={setIdItem}
            />

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                Título
            </Text>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 }}
                value={tituloItem}
                onChangeText={setTituloItem}
            />

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                Localização do áudio
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <TextInput
                    style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8 }}
                    value={localizacaoAudio}
                    onChangeText={setLocalizacaoAudio}
                    editable={false}
                />
                <Button
                    title="Selecionar"
                    onPress={openFilePicker}
                />
            </View>

            <Button
                title="Salvar"
                onPress={handleFormItem}
            />
        </View>
    );
};

export default ItemFormScreen;
