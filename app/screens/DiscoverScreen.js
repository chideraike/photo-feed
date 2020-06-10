import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

class DiscoverScreen extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>Discover Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default DiscoverScreen;