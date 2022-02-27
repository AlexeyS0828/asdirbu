import React,{useEffect} from 'react';
import { View, Text, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import Header from '../../../components/header';
import images from '../../../config/images'
import MapView, {Marker} from 'react-native-maps';
import SearchBar from '../../../components/search';
import { useSelector } from 'react-redux';
import {Getresult1 } from '../../../reducers/session/action';
import styles from './style';

const initialRegion = {
    latitude: 52.438838,
    longitude: -1.847711,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08
}

function Search({ navigation }) {
    const [search, setSearch] = React.useState('Ugnies');
    const [filterModal, setFilterModal] = React.useState(false);
    const [radius, setRadius] = React.useState(10);
    const [budget, setBudget] = React.useState(20);
    const result = useSelector(state => state.session.search);
    const [rate, setRate] = React.useState(4)
    const onChangeSearch = (s) => setSearch(s);
    const clearSearch = () => setSearch('');
    const openFilterModal = () => setFilterModal(true);
    const closeFilterModal = () => setFilterModal(false);
    const changeRadius = value => setRadius(value);
    const changeBudget = v => setBudget(v);
    const clearRadius = () => setRadius(0);
    const clearBudget = () => setBudget(0);
    const selectRate = (r) => setRate(r);
    const clearRate = () => setRate(0);
    const next = () => navigation.navigate('Members');
    const getsearresult = async () =>{
        await getResults({search});
    } 
    const getResults = Getresult1();

    if(result){
        if(result.data.joblist){
            navigation.navigate('SearchResult');
        }
    }
    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    )
}

export default Search
