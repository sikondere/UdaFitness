import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getMetricMetaInfo, timeToString, getDailyRemiindervalue } from '../utils/helpers';
import UdaSlider from './UdaSlider';
import UdaStepper from './UdaStepper';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { removeEntry, submitEntry } from '../utils/api';
import { addEntry } from '../actions';
import { purple, white } from '../utils/colors';

function SubmitButton({ onPress }) {
    return (
        <TouchableOpacity 
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={ onPress }>
                <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    };

    submit = () => {
        const key = timeToString();
        const entry = this.state

        //update redux
        this.props.dispatch(addEntry({
            [key]: entry,
        }))

        //natigate to home

        //save to db
        submitEntry({key, entry})

        //clear local notication
    };

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric);
        this.setState((prevState) => {
            const count = prevState[metric] + step;
            return {
                ...prevState,
                [metric]: count > max ? max : count,
            }
        });
    };

    decrement = (metric) => {
        const { step } = getMetricMetaInfo(metric);
        this.setState((prevState) => {
            const count = prevState[metric] - step;
            return {
                ...prevState,
                [metric]: count < 0 ? 0 : count,
            }
        });
    };

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value,
        }))
    };

    reset = () => {
        const key = timeToString();

        //update redux
        this.props.dispatch(addEntry({
            [key]: getDailyRemiindervalue()
        }))

        //route to home

        //update db
        removeEntry({key})
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        if(this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons 
                        name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy-outline'}
                        size={100}
                    />
                    <Text>you already logged your information today</Text>
                    <TextButton style={{padding:10}} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()} />
               {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest } = metaInfo[key];
                   const value = this.state[key];

                   return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {
                                type === 'slider'
                                ? <UdaSlider 
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                                : <UdaStepper 
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />
                            }
                        </View>)
               })}
               <SubmitButton onPress={this.submit} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight:40,
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
        marginLeft: 30,
    },
});

function mapStateToProps(state) {
    const key = timeToString();
    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry);