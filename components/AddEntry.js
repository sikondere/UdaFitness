import React, { Component } from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaSlider from './UdaSlider';
import UdaStepper from './UdaStepper';
import DateHeader from './DateHeader';
import TextButton from './TextButton';

function SubmitButton({ onPress }) {
    return (
        <TouchableOpacity onPress={ onPress }>
                <Text>SUBMIT</Text>
        </TouchableOpacity>
    )
}

export default class AddEntry extends Component {

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
        this.setState(() => ({ run:0, bike:0, swim:0, sleep:0, eat:0,}));

        //natigate to home

        //save to db

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

        //route to home

        //update db
    }

    render() {
        const metaInfo = getMetricMetaInfo();

        if(this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons 
                        name='ios-happy-outline'
                        size={100}
                    />
                    <Text>you already logged your information today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            );
        }

        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
               {Object.keys(metaInfo).map((key) => {
                   const { getIcon, type, ...rest } = metaInfo[key];
                   const value = this.state[key];

                   return (
                        <View key={key}>
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