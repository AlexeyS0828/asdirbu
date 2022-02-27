import React, {useEffect} from 'react';
import { View, Text, SafeAreaView, Image, FlatList,ScrollView,AsyncStorage, TouchableOpacity,LogBox } from 'react-native';
import Header from '../../../components/header';
import images from '../../../config/images'
import { useSelector } from 'react-redux';
import MapView, {Marker} from 'react-native-maps';
import SearchBar from '../../../components/search';
import { GetProfile,Getresult,Getcitys, GetMember } from '../../../reducers/session/action';
import styles from './style';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const tmp = [
    {
        id :1,
        image: 'https://i.imgur.com/UYiroysl.jpg',
        name: 'Santechnikas',
        price: "€40"
    },
    {
        id :2,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        price: "€40"
    },
    {
        id :3,
        image: 'https://i.imgur.com/MABUbpDl.jpg',
        name: 'Santechnikas',
        price: "€40"
    },
    {
        id :4,
        image: 'https://i.imgur.com/UPrs1EWl.jpg',
        name: 'Santechnikas',
        price: "€40"
    }
]
function Home({ navigation }) {
    const [search, setSearch] = React.useState('Ugnies');
    const [token, SetToken] = React.useState(null);
    const [page, setPage ] = React.useState(1);
    const onChangeSearch = (s) => setSearch(s);
    const result = useSelector(state => state.session.data);
    const clearSearch = () => setSearch('');
    const initialRegion = {
        latitude: 54.687157,
        longitude: 25.279652,
        latitudeDelta: 0.04,
        longitudeDelta:0.04 
    }
    useEffect(() => {
        AsyncStorage.getItem("Token").then((value) => {
            
            getprofile(value);
            getMenbership({page});
        })
        .then(res => {
            //do something else
        });
        
    });
    const getsearresult = async () =>{
        await getResults({search});
        getcity();
    } 
    const getcity =Getcitys();
    const getResults = Getresult();
    const getprofile = GetProfile();
    const getMenbership = GetMember();
    if(result){
        if(result.data){
            if(result.data.joblist){
                navigation.navigate('SearchResult', {
                });
            }
        }
    }
    const next = () => navigation.navigate('Members');
    const renderItem = ({ item, index }) => (
        <TouchableOpacity activeOpacity={0.8} style={[styles.flexDirection, styles.item]} 
        onPress={() => navigation.navigate('Itemdetails', {
            item: item
        })  }> 
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.imagecontainer}>
                <Text style={styles.font18}>{item.price}</Text>
                <Text style={styles.font12}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
    return (
        <SafeAreaView style={styles.container}>
            <Header title='Greiti Darbai' titleColor='#E57D33' smallColor='rgba(45,45,45,0.5)'/>
            <View style={[styles.flexDirection, styles.topView]}>
                <SearchBar search={search} onChangeText={onChangeSearch} clear={clearSearch} getresult={getsearresult} />
            </View>
            <View style={[styles.flexDirection, styles.tabtitle]}>
                <TouchableOpacity>
                <Text style={[styles.tabtext,{borderRightWidth:1}]}>Greiti darbai</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={next} >
                <Text style={styles.tabtext}>Nauji nariai</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.mapcontainer}>
            <MapView
                initialRegion={initialRegion}
                style={styles.map}
                provider='google'
                showsUserLocation
            >
                <Marker
                    coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
                    pinColor='#e80606'
                >
                    <Image source={images.pin} style={styles.pin} />
                </Marker>
            </MapView>
            </View>
            <ScrollView >
                    <FlatList
                        data={tmp}
                        renderItem={renderItem}
                        horizontal={false}
                        contentContainerStyle={styles.scrollView}
                        keyExtractor={item => item.id.toString()}
                    />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home
