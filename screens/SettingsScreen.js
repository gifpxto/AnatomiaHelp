
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SettingsScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [itensSalvos, setItensSalvos] = useState([]);

    useEffect(() => {
        carregarItensSalvos();
    }, []);

    useEffect(() => {
        salvarItens();
    }, [itensSalvos]);

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


    const handleDeleteItem = (itemId) => {
        let texto = "Deseja realmente apagar o item '" + itemId + "'?"
        Alert.alert(
            'Confirmação',
            texto,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Apagar',
                    onPress: async () => {
                        try {
                            const novoItensSalvos = itensSalvos.filter((item) => item.idItem !== itemId);
                            setItensSalvos(novoItensSalvos);
                            salvarItens();
                        } catch (error) {
                            console.log('Erro ao remover dado:', error);
                        }
                    },
                },
            ]);
    };
    const handleEditItem = (idItem) => {
        navigation.navigate('ItemFormScreen', { idEditar: idItem });
    };

    const handleAddItem = () => {
        navigation.navigate('ItemFormScreen');
    };

    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <Text>Id: {item.idItem}</Text>
            <Text>Título do item: {item.tituloItem}</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleEditItem(item.idItem)}>
                    <Text style={{ marginRight: 10 }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteItem(item.idItem)}>
                    <Text>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={itensSalvos}
                renderItem={renderItem}
                keyExtractor={(item) => item.idItem}
            />
            <TouchableOpacity onPress={handleAddItem} style={{ backgroundColor: 'lightgray', padding: 10, alignItems: 'center' }}>
                <Text style={{ color: 'black' }}>Adicionar item</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SettingsScreen;
