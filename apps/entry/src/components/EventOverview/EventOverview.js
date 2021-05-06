import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import {
    MainSection,
    LoadingSection,
    TitleRow,
    RichButton,
} from '@hisp-amr/app'
import { Table } from './Table'
import { useEvents } from './useEvents'
import { icmr, tanda } from 'config'

if (!process.env.REACT_APP_DHIS2_TABLE_CONFIG)
    throw new Error(
        'The environment variable REACT_APP_DHIS2_TABLE_CONFIG must be set'
    )

const { titles, headers } = { icmr, tanda }[
    process.env.REACT_APP_DHIS2_TABLE_CONFIG
]

const title = {
    true: 'You cannot add records for the selected location',
    false: 'Add new record',
}

/**
 * Shows events by status.
 */
export const EventOverview = ({ match, history }) => {
    var status = match.params.status
    console.log("STATUSSSSS",status)
    const selected = useSelector(state => state.selectedOrgUnit)
    var [eventstatus, setEventstatus] = useState('ACTIVE')
    const { rows, loading, addButtonDisabled, error } = useEvents(status)
    var eventStatus = "ACTIVE"
    const tabValue = [
        { "name": "Pending sample result", "key": "pending", "code": "ST" },
        { "name": "Sample result received","key": "complete", "code": "ST" }
    ]
    var PROGRAMCODE = "ST"
    const handleChange = (returnValue) => {
        var programCode = returnValue[2];
        var programStatus = returnValue[1]
        if(programCode == PROGRAMCODE && programStatus == "pending")
            setEventstatus('ACTIVE');
        if(programCode == PROGRAMCODE && programStatus == "complete")
            setEventstatus('COMPLETE');

    };

    /**
     * Called when table row is clicked.
     */
    const onEventClick = row => {
        history.push(`/orgUnit/${row[6]}/trackedEntityInstances/${row[7]}`)
    }

    /**
     * On table add click.
     */
    const onAddClick = () =>history.push(`/orgUnit/${selected.id}/event/`)
    return (
        <MainSection>
            <TitleRow
                // title={titles[status]}
                button={
                    <div title={title[addButtonDisabled]}>
                        <RichButton
                            primary
                            large
                            icon="add"
                            label="Add record"
                            disabled={addButtonDisabled}
                            onClick={onAddClick}
                        />
                    </div>
                }
            />
            {!error &&
                (loading ? (
                    <LoadingSection />
                ) : (
                    <Table
                        rows={rows}
                        headers={headers}
                        onEventClick={onEventClick}
                        title={selected.displayName}
                    />
                ))}
        </MainSection>
    )
}
