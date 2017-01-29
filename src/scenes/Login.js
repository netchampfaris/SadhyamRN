import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {
	TouchableWithoutFeedback,
	StyleSheet,
	Navigator,
	AsyncStorage
} from 'react-native';
import {
	Container, Header, Title,
	InputGroup, Input, Button, Icon,
	H2, Text, View, Spinner,
} from 'native-base';
import { getLoginUrl } from 'Sadhyam/src/services/api';

class Login extends Component {
	constructor(props) {
		super(props);
		console.log(props.navigator.getCurrentRoutes())
		this.initialState = {
			isLoading: false,
			error: null,
			username: 'netchamp.faris@gmail.com',
			password: 'qwe',
			token: null,
			user: null,
			badLogin: null
		};
		this.state = this.initialState;
	}

	componentWillMount () {
		// check if already logged in
		AsyncStorage.multiGet(['user', 'api_key'])
			.then(res =>res.map(val => val[1]))
			.then(userdata => {
				if(userdata[0] && userdata[1]) {
					this.navigateToMain()
				}
			});
	}	

	onPressLogin() {
		this.setState({
			isLoading: true,
			error: '',
		});
		dismissKeyboard();
		this.submitCredentials();
	}

	submitCredentials() {
		const { username, password } = this.state;
		this.login({ username, password })
			.then(res => {
				console.log('Login Success', res);
				this.setState({
					isLoading: false
				});
				this.navigateToMain();
			})
			.catch((error) => {
				console.log(error)
				this.setState({
					badLogin: true,
					errorMessage: error
				});
			});
	}

	login(user) {
		return fetch(getLoginUrl(), {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then(res => res.json())
		.then(res => {
			if(res.success) {
				return AsyncStorage.multiSet([
					['user', res.subscriber.user],
					['api_key', res.subscriber.api_key]
				]);
			} else {
				throw new 'Authentication Error'
			}
		});
	}

	renderError() {
		if (this.state.error) {
			return (
				<Text style={styles.error}>
					{this.state.error}
				</Text>
			);
		}
	}

	navigateToMain() {
		const routes = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routes[1]);
	}

	test() {
		AsyncStorage.clear();
	}

	render() {
		return (
			<Container>
				<View style={styles.container}>
					<H2 style={styles.hero}>Welcome to Sadhyam</H2>
					<TouchableWithoutFeedback onPress={dismissKeyboard}>
						<View style={styles.content}>
							<InputGroup style={styles.input}>
								<Icon style={styles.inputIcon} name="md-person" />
								<Input
									placeholder="Username"
									keyboardType="email-address"
									autoCorrect={false}
									autoCapitalize="none"
									onChangeText={username => this.setState({ username })}
									value={this.state.username}
								/>
							</InputGroup>
							<InputGroup style={styles.input}>
								<Icon style={styles.inputIcon} name="md-unlock" />
								<Input
									placeholder="Password"
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
									secureTextEntry
								/>
							</InputGroup>
							{this.state.isLoading ? (
								<Spinner size="small" color="#000000" />
							) : (
								<Button
									style={styles.button}
									onPress={() => this.onPressLogin()}
								>
									Signin
								</Button>

							)}
							<Button
								style={styles.button}
								onPress={() => this.test()}
							>
								Signup
							</Button>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#fafbfc',
	},
	content: {
		padding: 50,
		flex: 1,
	},
	hero: {
		paddingTop: 100,
		paddingBottom: 50,
		textAlign: 'center',
	},
	shadow: {
		flex: 1,
		width: null,
		height: null,
	},
	inputIcon: {
		width: 30,
	},
	input: {
		marginBottom: 20,
	},
	button: {
		marginTop: 20,
		alignSelf: 'center',
		width: 150,
	},
	error: {
		color: 'red',
		marginBottom: 20,
	},
});

export default Login;
