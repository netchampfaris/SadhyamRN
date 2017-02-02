import React, { Component, PropTypes } from 'react';
import {
    View,
    WebView,
    Text,
    StyleSheet,
    Dimensions,
    AsyncStorage
} from 'react-native';
import {
    Container, Header, Title, Content,
    Footer, FooterTab, Button,
    Badge, Icon, Card, CardItem
} from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { getQuestions, submitAnswers } from 'Sadhyam/src/services/api';

class Questions extends Component {
    constructor(props) {
        super(props);
        this.questions = [];
        this.state = {
            currentQuestion: {
                number: -1,
                html: '<p>Loading questions...</p>',
                selectedOption: 'Z'
            }
        }
    }

    getHTML(number, content) {
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
                    <h3>Question ${number}</h3>
                    ${content}
                </div>
            <body>
        </html>`;
    }

    getQuestion(number) {
        const question = this.questions[number - 1];
        return {
            number,
            html: question.questionHTML,
            selectedOption: question.selectedOption
        }
    }

    componentDidMount() {
        getQuestions().then(data => {
            console.log(data);
            this.setupQuestions(data.objects);
            this.showQuestion(1);
        });
    }

    setupQuestions(questions) {
        this.questions = questions.map((q, i) =>
            Object.assign(q, {
                questionHTML: this.getHTML(i + 1, q.question),
                selectedOption: 'Z'
            })
        )
    }

    showQuestion(number) {
        if (number > this.questions.length ||
            number < 1) return;

        const currentQuestion = this.getQuestion(number);
        this.setState({ currentQuestion });
        setTimeout(() => this.refs['WebView'].reload(), 10);
        setTimeout(() => this.refs['WebView'].reload(), 500);
        // setTimeout(() => this.refs['WebView'].reload(), 1000);
    }

    nextQuestion() {
        const nextIndex = this.state.currentQuestion.number + 1;
        this.showQuestion(nextIndex);
    }

    prevQuestion() {
        const prevIndex = this.state.currentQuestion.number - 1;
        this.showQuestion(prevIndex);
    }

    optionClicked(option) {
        this.questions[this.state.currentQuestion.number - 1].selectedOption = option;
        this.setState({
            currentQuestion: Object.assign({}, this.state.currentQuestion, {
                selectedOption: option
            })
        });
    }

    allQuestionsSolved() {
        return this.questions
            .filter(q => q.selectedOption !== 'Z').length ===
                this.questions.length;
    }

    submitButtonClicked() {
        console.log(this.questions)
        const marksObtained = this.questions
            .filter(q => q.selectedOption === q.correct_ans).length;
        const totalQuestions = this.questions.length;
            
            submitAnswers({
                marksObtained,
                totalQuestions
            })
            .then(console.log);
        
    }

    renderOptionButtons() {
        const options = ['A', 'B', 'C', 'D', 'E'];
        const styles = StyleSheet.create({
            optionButton: {
                width: 50,
                marginLeft: 15,
                marginRight: 15
            }
        });

        return options.map((opt, i) => {
            let style = [styles.optionButton];
            return <Col key={opt}>
                <Button
                    bordered={this.state.currentQuestion.selectedOption !== opt}
                    style={style}
                    onPress={this.optionClicked.bind(this, opt)}
                    >
                    {opt}
                </Button>
            </Col>;
        })
    }

    render() {
        
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    ref='WebView'
                    style={styles.webviewWrapper}
                    source={{ html: this.state.currentQuestion.html }}
                    />
                <Grid style={styles.optionsWrapper}>
                    {this.renderOptionButtons()}
                </Grid>
                <Grid style={styles.actionsWrapper}>
                    <Col>
                    {
                        this.state.currentQuestion.number !== 1
                        ? <Button bordered rounded
                            style={styles.actionButton}
                            onPress={this.prevQuestion.bind(this)}
                            >
                            Prev
                        </Button>
                        : null
                    }
                    </Col>
                    <Col>
                    {
                        this.allQuestionsSolved()
                        ? <Button bordered rounded
                            style={styles.actionButton}
                            onPress={this.submitButtonClicked.bind(this)}
                            >
                            Submit
                        </Button>
                        : null
                    }
                    </Col>
                    <Col>
                    {
                        this.state.currentQuestion.number !== this.questions.length
                        ? <Button bordered rounded
                            style={styles.actionButton}
                            onPress={this.nextQuestion.bind(this)}
                            >
                            Next
                        </Button>
                        : null
                    }
                    </Col>
                </Grid>
            </View>
        );
    }
}
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    webviewWrapper: {
        width: width,
        height: height
    },
    optionsWrapper: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionsWrapper: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        width: 80,
        marginLeft: 28,
        marginRight: 28
    }
});



export default Questions;
