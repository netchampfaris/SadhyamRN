import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {
	TouchableWithoutFeedback,
	StyleSheet,
	Navigator,
	AsyncStorage,
	StatusBar
} from 'react-native';
import {
	Container, Header, Title,
	InputGroup, Button, Icon,
	H2, Text, View, Spinner,
	Grid, Col,
	Form, Item, Input,
	StyleProvider
} from 'native-base';
import GoogleSignIn from 'react-native-google-sign-in';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import LinearGradient from 'react-native-linear-gradient';
import getTheme from 'Sadhyam/native-base-theme';

import { getLoginUrl } from 'Sadhyam/src/services/api';

class Login extends Component {
	constructor(props) {
		super(props);
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

	componentWillMount() {
		// check if already logged in
		AsyncStorage.multiGet(['user', 'api_key'])
			.then(res => res.map(val => val[1]))
			.then(userdata => {
				if (userdata[0] && userdata[1]) {
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
				if (res.success) {
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

	async onPressGoogleLogin() {
		await GoogleSignIn.configure({
			scopes: ['openid', 'email', 'profile'],
			shouldFetchBasicProfile: true,
		});
		console.log('configured')
		let user;
		try {
			user = await GoogleSignIn.signInPromise();
			console.log(user)
		} catch(e) {
			console.log(e)
		}
		
	}

	onPressFacebookLogin() {

	}

	render() {
		return (
			<Container>
				<View style={styles.container}>
					<LinearGradient colors={['#fff', '#bbb']}
						style={[styles.gradientContainer]}
					>
						<StatusBar
							backgroundColor="#00000033"
							translucent={true}
							barStyle="light-content"
						/>
						<TouchableWithoutFeedback onPress={dismissKeyboard}>
							<View style={[styles.content]}>
								<SadhyamHero />
								<View style={[styles.loginForm]}>
									<InputGroup style={styles.input}>
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
										<Input
											placeholder="Password"
											onChangeText={password => this.setState({ password })}
											value={this.state.password}
											secureTextEntry
										/>
									</InputGroup>
								</View>
								<LoginButtons onGoogleLogin={() => this.onPressGoogleLogin()} />
							</View>
						</TouchableWithoutFeedback>
					</LinearGradient>
				</View>
			</Container>
		);
	}
}

const SadhyamHero = () => {
	return (
		<View style={[styles.hero]}>
			<Text style={{fontSize: 32, lineHeight: 32, height: 42, borderColor: 'white', borderWidth: 1}}>
				Sadhyam
			</Text>
		</View>
	)
}

const LoginButtons = ({showLogin, showSignup, onGoogleLogin}) => {
	return (
		<View style={[styles.loginButtons]}>
			<Button style={[styles.loginButton]}
				block rounded>
				Login
			</Button>
			<Button style={[styles.loginButton]}
				block rounded bordered>
				Signup
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
	},
	content: {
		flex: 1,
		paddingLeft: 50,
		paddingRight: 50
	},
	hero: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loginButtons: {
		flex: 2,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	loginForm: {
		
	},
	socialButton: {
		// flex: 1,
		height: 48,
		marginTop: 15,
		// marginLeft: 35,
		// marginRight: 35
	},
	loginButton: {
		marginBottom: 10
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
	gradientContainer: {
		flex: 1
	},
	buttonText: {
		fontSize: 18,
		fontFamily: 'Gill Sans',
		textAlign: 'center',
		margin: 10,
		color: '#ffffff',
		backgroundColor: 'transparent',
	}
});

const debugBorder = color => {
	return {
		borderColor: color,
		borderWidth: 1
	};
}

export default Login;
