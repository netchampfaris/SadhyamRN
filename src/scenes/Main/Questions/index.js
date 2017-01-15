import React, { Component, PropTypes } from 'react';
import {
    View,
    WebView,
    Text
} from 'react-native';
import {
	Container, Header, Title, Content,
    Footer, FooterTab, Button,
    Badge, Icon, Card
} from 'native-base';
import HTMLView from 'react-native-htmlview';
import { getQuestions } from 'Sadhyam/src/services/api';

class Questions extends Component {
	constructor(props) {
		super(props);
        this.state = {
            questions: [],
            qhtml: '<h1>Test</h1>'
        }
	}

    componentDidMount () {
        getQuestions().then((data) => {
            // this.setState({ questions: data.objects });
            // console.log(this.state.questions)
            let html = `<!DOCTYPE html>
                <html><head></head><body>`;
            html += data.objects.reduce((a, b) => {
                return a + `<div class='card' style='padding: 20px'>
                        ${b.question}
                    </div>`;
            }, '');
            html += `<body></html>`;
            console.log(html)
            this.setState({ qhtml: html });
        });
    }

	render() {
		return (
            <WebView
                style={{
                    backgroundColor: '#ccc',
                    width: 400
                }}
                source={{uri: 'https://facebook.github.io/react/'}}
                scalesPageToFit={true}
            />
		);
	}
}

export default Questions;
