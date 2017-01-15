import React, { Component } from 'react';
import {
	StyleSheet,
	Navigator,
	TouchableHighlight
} from 'react-native';
import {
    Container, Content, View,
	H2, Text, Icon,
	List, ListItem,
	Input, InputGroup
} from 'native-base';
import Login from './scenes/Login';
import Main from './scenes/Main';

const routes = [
	{ title: 'Login', component: Login },
	{ title: 'Main', component: Main },
]

class App extends Component {

	render() {
		return (
			<Navigator
				initialRoute={routes[0]}
				initialRouteStack={routes}
				renderScene={this.renderScene}
			/>
		);
	}

	renderScene(route, navigator) {
		return <route.component navigator={navigator}/>
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee',
	},
});

export default App;