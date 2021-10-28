import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import { Agenda } from 'react-native-calendars'

class History extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        fetchCalendarResults()
            .then((entries) => dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                if(!entries[timeToString()]) {
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })
            .then(() => this.setState(() => ({ready: true})))
    }

    renderItem = ({today, ...metrics}, formattedDate, key) => {
        <View>
            {today
                ?<Text>{JSON.stringify(today)}</Text>
                :<Text>{JSON.stringify(metrics)}</Text>}
        </View>
    };

    renderEmptyDate(formattedDate) {
        return (
            <View>
                <Text>no data for this day</Text>
            </View>
        )    
    }

    render() {
        const { entries } = this.props;
        return (
            <View>
                <Agenda 
                    items={entries}
                    renderItem={this.renderItem}
                    renderEmptyDate={this.renderEmptyDate}
                />
            </View>
        )
    }
}

function mapStateToProps(entries) {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)