import React, { Component, PropTypes } from 'react';
import {
    View,
    WebView,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';
import {
	Container, Header, Title, Content,
    Footer, FooterTab, Button,
    Badge, Icon, Card, CardItem
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import HTMLView from 'react-native-htmlview';
import { getQuestions } from 'Sadhyam/src/services/api';

class Questions extends Component {
	constructor(props) {
		super(props);
        this.state = {
            questions: [],
            currentQuestion: {
                index: -1,
                html: '<p>No questions found</p>'
            }
        }
	}

    getHTML(index) {
        const q = this.state.questions[index];
        return `<!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
            </head>
            <style>
                html {
                    zoom: 0.85;
                    background: #fbfafa;
                    font-size: 20px;
                }
                .card {
                    padding: 20px;
                    overflow: hidden;
                    background: #fff;
                    border-radius: 2px;
                    display: inline-block;
                    position: relative;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                }
            </style>
            <body>
                <div class='card'>
                    <h3>Question ${index+1}</h3>
                    ${q.question}
                </div>
            <body>
        </html>`;
    }

    componentDidMount () {
        getQuestions().then((data) => {
            console.log(data)
            this.setState({ questions: data.objects });
            this.showQuestion(3);
        });
    }

    showQuestion(index) {
        console.log(this.state.currentQuestion);
        if(index > this.state.questions.length ||
            index < 0) return;
        console.log('changing Question')
        const html = this.getHTML(index);
        this.setState({
            currentQuestion: {
                index: index,
                html: html
            }
        });
        console.log(this.state.currentQuestion);
    }

    nextQuestion() {
        this.showQuestion(this.state.currentQuestion.index + 1);
    }
    
    prevQuestion() {
        this.showQuestion(this.state.currentQuestion.index - 1);
    }


	render() {
        const {height, width} = Dimensions.get('window');
		return (
            <View style={{flex: 1}}>
                <WebView
                    style={[{
                        width: width,
                        height: height
                    }]}
                    source={{html: this.state.currentQuestion.html }}
                />
                <Grid style={{flex: 0.15}}>
                    <Col><Button block large style={styles.option}>A</Button></Col>
                    <Col><Button block large style={styles.option}>B</Button></Col>
                    <Col><Button block large style={styles.option}>C</Button></Col>
                    <Col><Button block large style={[styles.option, {marginRight: 5}]}>D</Button></Col>
                </Grid>
                <Grid style={{flex: 0.1}}>
                    <Col>
                        <Button block bordered rounded
                            style={styles.option}
                            onPress={this.nextQuestion.bind(this)}
                        >
                            Prev</Button></Col>
                    <Col>
                        <Button block bordered rounded
                            style={[styles.option, {marginRight: 5}]}
                            onPress={this.prevQuestion.bind(this)}
                        >
                            Next</Button></Col>
                </Grid>
            </View>
		);
	}
}

const styles = StyleSheet.create({
    option: {
        marginLeft: 5
    }
})

export default Questions;
