/**
 * Sample React Native Desktop App
 * https://github.com/ptmt/react-native-desktop
 */
'use strict';

var React = require('React');
var ReactNative = require('react-native-desktop');

var {AppRegistry, ListView, StyleSheet, View, NativeAppEventEmitter, Text, Dimensions, TouchableOpacity, ScrollView} = ReactNative;

var defaultLayout = Dimensions.get('window');

class OrbisMac extends React.Component {

    processPacket(packet) {
        var payload = packet.payload

        if (typeof payload === 'string' || payload instanceof String) {

        } else {
            payload.selected = false
            var requests = this.state.requests.concat([payload])
            if (requests.length> 200){
                requests.pop()
            }
            var datasource = this.state.dataSource.cloneWithRows(requests)
            this.setState({
                ...this.state,
                requests: requests,
                dataSource: datasource
            })
        }
    }

    constructor() {
        super();
        this.state = {
            component: Welcome,
            layout: defaultLayout,
            requests: [],
            selectedRequest: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
        };

        var that = this
        this.subscription = NativeAppEventEmitter.addListener('peertalk_new_packet', (packet) => {
            that.processPacket(packet)
        });
      this.renderRequestRow = this.renderRequestRow.bind(this);
    }

    componentWillUnmount() {
        this.subscription.remove()
    }

    onSelectRequest(request) {
        if (this.state.selectedRequest !== '') {
            this.state.selectedRequest.selected = false
        }
        
        request.selected = true
        this.setState({
            ...this.state,
            selectedRequest: request
        })
    }

    clearRequest() {
        var requests = []
            var datasource = this.state.dataSource.cloneWithRows(requests)
            this.setState({
                ...this.state,
                requests: requests,
                dataSource: datasource
            })
    }

    renderRequestRow(request) {
      var that = this
      var rowStyle = styles.touchableRow
      var textStyle = styles.rowText

      var path = request.path
      if(request.base_url){
        path = path.replace(request.base_url,'')
      }

      if (this.state.selectedRequest.id === request.id) {
        rowStyle = styles.touchedRow
      }

      if(request.error){
        textStyle = styles.rowFailText
      }

        return (
            <TouchableOpacity style={rowStyle} onPress={() => that.onSelectRequest(request)
            }>
        <Text style={textStyle} numberOfLines={1}>
        {request.method + ' ' + path}
        </Text>
      </TouchableOpacity>
            );
    }

    render() {
        var detail;
        var that = this

        if (this.state.selectedRequest === "") {
            detail = (<Welcome />);
        } else {
            if (this.state.selectedRequest.error) {

            detail = (

        <ScrollView showsVerticalScrollIndicator={true}>
                <View style={styles.detailContainer}> 
        <Text style={styles.welcomeText}>
        {this.state.selectedRequest.method + ' ' + this.state.selectedRequest.path}
        </Text>
        <Text style={styles.headerText}>
        Error
        </Text>
        <Text style={styles.contentText}>
        {this.state.selectedRequest.error}
        </Text>
        <Text style={styles.headerText}>
        Parameters
        </Text>
        <Text style={styles.contentText}>
        {this.state.selectedRequest.params}
        </Text>
        <Text style={styles.headerText}>
        Header
        </Text>
        <Text style={styles.contentText}>
        {this.state.selectedRequest.header}
        </Text>
        </View>
        </ScrollView>
            );
            } else {
            detail = (

        <ScrollView showsVerticalScrollIndicator={true}>
                <View style={styles.detailContainer}> 
        <Text style={styles.welcomeText}>
        {this.state.selectedRequest.method + ' ' + this.state.selectedRequest.path}
        </Text>
        <Text style={styles.headerText}>
        Response
        </Text>
        <Text style={styles.contentText}>
        {this.state.selectedRequest.response}
        </Text>
        <Text style={styles.headerText}>
        Parameters
        </Text>
        <Text style={styles.contentText}>
        {this.state.selectedRequest.params}
        </Text>
        <Text style={styles.headerText}>
        Header
        </Text>
        <Text style={styles.contentText}>
        {this.state.selectedRequest.header}
        </Text>
        </View>
        </ScrollView>
            );
            }
        }

        let sideWidth = 250
        return (
            <View style={styles.container} >
        <View style={[styles.leftPanel, {
                width: sideWidth
            }]}>

            <TouchableOpacity style={styles.touchableRow} onPress={() => that.clearRequest()
            }>
        <Text style={styles.clearText}>
        Clear All
        </Text>
      </TouchableOpacity>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRequestRow}
            enableEmptySections={true}
            />
            
        </View>
        <View style={[styles.rightPanel, {
                width: this.state.layout.width - sideWidth
            }]}>
            {detail}
        </View>
      </View>
            );
    }


}
;

class Welcome extends React.Component {
    render() {
        return (
            <View style={styles.welcomeWrapper}>
        <Text style={styles.welcomeText}>Welcome to Orbis!</Text>
      </View>
            );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    detailContainer: {
        flex: 1,
        margin: 8
    },
    itemWrapper: {
        backgroundColor: '#eaeaea',
    },
    leftPanel: {
        width: 300,
    },
    rightPanel: {
        flex: 1,
        backgroundColor: '#fff'
    },
    welcomeWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        color: '#999',
        fontSize: 20,
        marginTop: 8,
        marginBottom: 8
    },
    rowText: {
        color: '#999',
        fontSize: 15,
        marginTop: 8,
        marginBottom: 8
    },
    rowFailText: {
        color: '#db1414',
        fontSize: 15,
        marginTop: 8,
        marginBottom: 8
    },

    clearText: {
        color: '#999',
        fontSize: 20,
        marginTop: 16,
        marginBottom: 8,
        textAlign : 'center'
    },
    headerText: {
        color: '#6d7cff',
        fontSize: 15,
        paddingTop: 8
    },
    contentText: {
        fontSize: 13,
    },
    touchableRow: {
        paddingLeft: 8,
        paddingBottom: 4,
    },
    touchedRow: {
        paddingLeft: 8,
        paddingBottom: 4,
        backgroundColor: '#fff'
    },
});

AppRegistry.registerComponent('OrbisMac', () => OrbisMac);

