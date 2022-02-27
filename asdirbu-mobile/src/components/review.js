import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { defaultFormatUtc } from 'moment';
import Rating from 'react-native-star-rating';
const { width, height } = Dimensions.get('window');
function Review({ data }) {
    const { name, title, description, rate, date } = data;
    const [more, setMore] = React.useState(false)
    const reaMorePress = () => setMore(!more)
    return (
        <View style={styles.container}>
            <View style={styles.flexDirection}>
                <Text style={styles.font15}>{name}</Text>
                <Rating
                    maxStars={5} iconSet='Ionicons' fullStar='ios-star'
                    emptyStar='ios-star-outline' rating={rate}
                    fullStarColor='#e80606' emptyStarColor='#bfbfbf'
                    starStyle={{ marginHorizontal: 5 }} starSize={20}
                />
            </View>
            <Text style={[styles.font21, { marginTop: 6 }]}>{title}</Text>
            <Text numberOfLines={more?10:3} style={[styles.font13, { marginTop: 13, marginTop: 9 }]}>{description}</Text>
            <Text style={[styles.font13, styles.readmore]} onPress={reaMorePress}>{more?'Show less':'Read more...'}</Text>
            <Text style={[styles.font13, { color: '#bfbfbf' }]}>{date}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width - 40,
        paddingHorizontal: 23,
        paddingVertical: 15,
        borderRadius: 17,
        backgroundColor: 'white',
        shadowColor: "rgba(0,0,0,0.15)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 8,
        shadowOpacity: 1,
        elevation: 3,
        marginTop: 22
    },
    font15: {
        fontSize: 15,
        lineHeight: 24,
        color: '#2d2d2d',
        letterSpacing: 0.24
    },
    font13: {
        fontSize: 13,
        lineHeight: 24,
        color: '#2d2d2d',
        letterSpacing: 0.24
    },
    font21: {
        fontSize: 21,
        lineHeight: 24,
        color: '#2d2d2d',
        letterSpacing: 0.24,
        fontWeight: '800'
    },
    flexDirection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    readmore: {
        color: '#e80606',
        marginTop: -22,
        left: width - 170,
        backgroundColor: 'white',
        width: 100
    }
});

export default Review;