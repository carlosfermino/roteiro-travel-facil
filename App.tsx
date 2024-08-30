import { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, TextInput, Platform, Pressable, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// Para usar com API key local
//const API_KEY= ''
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


const statusBarHeight = StatusBar.currentHeight
//const KEY = 'Digite aqui a sua chave APIKey do OpenAI';

export default function App() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");

  async function handleGenerate() {
    if(city === ""){
      Alert.alert("Atenção", "Preencha o nome da cidade!")
      return
    }
    setLoading(false)
    setTravel("")
    setLoading(true)
    Keyboard.dismiss()

    const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    setTravel(text) 
    
    try {
      console.log("Sucesso no envio do roteiro!")
      setLoading(false)      
    } catch (error) {

        console.log(error)
    }  
}

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.heading}>Roteiros Travel Fácil</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Cidade destino</Text>
        <TextInput 
          placeholder="Ex: São Sebastião, SP" 
          style={styles.input} 
          value={city}  
          onChangeText={ (text) => setCity(text)}
          />
        <Text style={styles.label}>Tempo de estadia: <Text style={styles.days}> {days.toFixed(0)} </Text> dias</Text>
        <Slider
          //style={{width: 200, height: 40}}
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value) }
        />
      </View>
      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Gerar roteiro</Text>
        <MaterialIcons name='travel-explore' size={24} color='#fff' />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll}       showsVerticalScrollIndicator={false}>
        {loading && (
            <View style={styles.content}>
            <Text style={styles.title}>Carregando roteiro...</Text>
            <ActivityIndicator color='#000' size='large' />
          </View>
        )}

        {travel && (
            <View style={styles.content}>
            <Text style={styles.title}>Roteiro da viagem 👇</Text>
            <Text>{travel}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    paddingTop: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54,
  },
  form: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    padding: 16, 
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,

  }, 
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: '#F1F1F1',
  },
  button: {
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center'
  },

  containerScroll: {
    width: '90%',
    marginTop: 8
  }

})
