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
import Solutions from './Solutions';
import Feed from './Feed';
import Profile from './Profile';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: {
                name: '',
                component: null
            }
        }
    }

    componentDidMount() {
        this.changeTab({
            name: 'Questions',
            component: <Questions/>
        });
    }

    changeTab(tab) {
        this.setState({
            currentTab: tab
        });
    }

    render() {

        const footerTabs = [
            {
                name: 'Questions',
                icon: 'ios-apps-outline',
                component: <Questions/>
            },
            {
                name: 'Solutions',
                icon: 'ios-camera-outline',
                component: <Solutions/>
            },
            {
                name: 'Feed',
                icon: 'ios-compass',
                component: <Feed/>
            },
            {
                name: 'Profile',
                icon: 'ios-contact-outline',
                component: <Profile/>
            },
        ]

        return (
            <View style={styles.view}>
                <Header>
                    <Title>Sadhyam</Title>
                </Header>
                { this.state.currentTab.component }
                <Footer>
                    <FooterTab>
                    {
                        footerTabs.map(ft =>
                            <Button
                                key={ft.name}
                                active={ft.name === this.state.currentTab.name}
                                onPress={this.changeTab.bind(this, ft)}
                            >
                                {ft.name}
                                <Icon name={ft.icon} />
                            </Button>
                        )
                    }
                    </FooterTab>
                </Footer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#fbfafa',
        flex: 1
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0.3,
        }
    }
})

export default Main;
