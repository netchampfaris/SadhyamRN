import React, { Component, PropTypes } from 'react';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import {
	TouchableWithoutFeedback,
	StyleSheet,
	Navigator,
} from 'react-native';
import {
	Container,
	Header,
	Title,
	InputGroup,
	Input,
	Button,
	Icon,
	H2,
	Text,
	View,
	Spinner,
} from 'native-base';

class Login extends Component {
	constructor(props) {
		super(props);
		console.log(props.navigator.getCurrentRoutes())
		this.initialState = {
			isLoading: false,
			error: null,
			email: 'user1@facebook.com',
			password: '12345678',
		};
		this.state = this.initialState;
	}

	onPressLogin() {
		this.setState({
			isLoading: true,
			error: '',
		});
		dismissKeyboard();
		const routes = this.props.navigator.getCurrentRoutes();
		this.props.navigator.jumpTo(routes[1]);
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
									placeholder="Email"
									keyboardType="email-address"
									autoCorrect={false}
									autoCapitalize="none"
									onChangeText={email => this.setState({ email })}
									value={this.state.email}
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
								onPress={() => this.onPressLogin()}
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
