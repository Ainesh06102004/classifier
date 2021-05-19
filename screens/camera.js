import * as React from 'react';
import { StyleSheet, Text, View, Button, Platform, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class PickImage extends React.Component {
    constructor() {
        super();
        this.state = {
            image: ''
        }
    }
    componentDidMount() {
        this.getpermission()
    }

    getpermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        }
        if (status !== "granted") {
            Alert.alert("Sorry we need access to camera roll in order to make this work")
        }
    }

    selectimage = async () => {
        try {
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.mediaTypes.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });
            if (!result.cancelled) {
                this.setState({ image: result.data });
                this.uploadimage(result.uri);
            }
        }

        catch (error) {
            console.log(error)
        }
    }

    selectimage = (uri) => {
        const data = new FormData();
        var filename = uri.split("/")[uri.split("/").length - 1]
        var type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const filetoupload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append("digit", filetoupload);
        fetch('https://83d2af0891ce.ngrok.io/predict-digit', {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then((response) => response.json())
            .then((result) => {
                console.log("Success: ", result)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (<View>
            <Button title="Pick any image from gallery" onPress={() => {
                this.selectimage();
            }} color="black" />
        </View>)
    }
}