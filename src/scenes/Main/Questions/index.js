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
import { getQuestions } from 'Sadhyam/src/services/api';

class Questions extends Component {
	constructor(props) {
		super(props);
        this.questions = [];
        this.state = {
            currentQuestion: {
                index: -1,
                html: '<p>Loading questions...</p>'
            },
            selectedButton: 'Z'
        }
	}

    getHTML(index) {
        const q = this.questions[index];
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

    getQuestion(index) {
        return {
            index,
            html: this.getHTML(index)
        }
    }

    componentDidMount () {
        getQuestions().then(data => {
            console.log(data)
            this.questions = data.objects;
            this.showQuestion(0);
        });
    }

    showQuestion(index) {
        if(index > this.questions.length - 1 ||
            index < 0) return;
        console.log('showing ', index)

        const currentQuestion = this.getQuestion(index);
        this.setState({ currentQuestion });
        setTimeout(() => this.refs['WebView'].reload(), 10);
        setTimeout(() => this.refs['WebView'].reload(), 500);
    }

    nextQuestion() {
        const nextIndex = this.state.currentQuestion.index + 1;
        this.showQuestion(nextIndex);
    }
    
    prevQuestion() {
        const prevIndex = this.state.currentQuestion.index - 1;
        this.showQuestion(prevIndex);
    }

    optionClicked(option) {
        this.setState({selectedButton: option});
    }

    renderOptionButtons() {
        const options = ['A', 'B', 'C', 'D', 'E'];
        const styles = StyleSheet.create({
            optionButton: {
                marginLeft: 5
            }
        });

        return options.map((opt, i) => {
            let style = [styles.optionButton];
            if(opt.length - 1 === i) {
                style = style.push({marginRight: 5});
            }
            return <Col key={opt}>
                <Button
                    bordered={this.state.selectedButton !== opt}
                    block style={style}
                    onPress={this.optionClicked.bind(this, opt)}
                >
                    {opt}
                </Button>
            </Col>;
        })
    }

	render() {
        const {height, width} = Dimensions.get('window');
		return (
            <View style={{flex: 1}}>
                <WebView
                    ref='WebView'
                    style={[{
                        width: width,
                        height: height
                    }]}
                    source={{html: this.state.currentQuestion.html }}
                />
                <Grid style={{flex: 0.1}}>
                    { this.renderOptionButtons() }
                </Grid>
                <Grid style={{flex: 0.1}}>
                    <Col>
                        <Button block bordered rounded
                            style={styles.option}
                            onPress={this.prevQuestion.bind(this)}
                        >
                            Prev</Button></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                        <Button block bordered rounded
                            style={[styles.option, {marginRight: 5}]}
                            onPress={this.nextQuestion.bind(this)}
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
});



export default Questions;
