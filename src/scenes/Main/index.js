import React, { Component, PropTypes } from 'react';
import {
	TouchableWithoutFeedback,
	StyleSheet,
	Navigator,
} from 'react-native';
import {
	Container, Header, Title, Content,
    Footer, FooterTab, Button,
    Badge, Icon, Text, View
} from 'native-base';
import Questions from './Questions';

class Main extends Component {
	constructor(props) {
		super(props);
        this.state = {
            currentTab: null
        }
	}

	componentDidMount () {
		this.setState({
			currentTab: <Questions/>
		})
	}

	render() {
		return (
			<Container> 
                <Header>
                    <Title>Sadhyam</Title>
                </Header>

                <Content style={{'flex': 1}}>
                    { this.state.currentTab }
                </Content>

                <Footer >
                    <FooterTab>
                        <Button active>
                            Questions
                            <Icon name='md-chatbubbles' />
                        </Button>
                        <Button>
                            Feed
                            <Icon name='md-folder' />
                        </Button>
                        <Button>
                            Solutions
                            <Icon name='md-book' />
                        </Button>
                        <Button>
                            Profile
                            <Icon name='md-person' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
		);
	}
}

export default Main;
