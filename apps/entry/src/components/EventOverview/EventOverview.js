import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    MainSection,
    LoadingSection,
    TitleRow,
    RichButton,
    CardSection,
} from '@hisp-amr/app'
import { useEvents } from './useEvents'
import { icmr, tanda } from 'config'
import "./styles.css";
import Tabs from "./Tabs";
import TabPane from "./Tab-Pane";
import { TableList } from './TableList'
import { TABVALUES } from './constants'

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
    const dispatch = useDispatch()
    var status = match.params.status
    var SAMPLEPROGRAMCODE = "ST";
    var PROGRAMCODE = "GP";
    const selected = useSelector(state => state.selectedOrgUnit)
    var isFollowUp = useSelector(state => state.data.followup)
    var [eventstatus, setEventstatus] = useState('ALL')
    var [code, setCode] = useState("ALL")
    const tabValue = TABVALUES
    const { rows, loading, addButtonDisabled, error } = useEvents(status, eventstatus, code, isFollowUp)
    
    const handleChange = (returnValue) => {
        var programCode = returnValue[2];
        var programStatus = returnValue[1]
        if (programCode == SAMPLEPROGRAMCODE && programStatus == "pending") {
            setEventstatus('ACTIVE');
            setCode(SAMPLEPROGRAMCODE);
        }
        else if (programCode == SAMPLEPROGRAMCODE && programStatus == "complete") {
            setEventstatus('COMPLETED');
            setCode(SAMPLEPROGRAMCODE);
        }
        else if (programCode == PROGRAMCODE && programStatus == "pending") {
            setEventstatus('ACTIVE');
            setCode(PROGRAMCODE);
        }
        else if (programCode == PROGRAMCODE && programStatus == "complete") {
            setEventstatus('COMPLETED');
            setCode(PROGRAMCODE);
        }
        else {
            setEventstatus('ALL');
            setCode('ALL');
        }
    };

    /**
     * Called when table row is clicked.
     */
    const onEventClick = (row, org, tei) => {
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
            <CardSection>
                <Tabs>
                    {tabValue.map((tabValues) => (
                        <TabPane
                            name={tabValues.name}
                            tabvalue={tabValues.key}
                            onClick={handleChange}
                            code={tabValues.code}
                        >
                        </TabPane>
                    ))}
                </Tabs> 
            {!error &&
                (loading ? (
                    <LoadingSection />
                ) : (
                        <TableList 
                            rows={rows}
                            onEventClick={onEventClick}
                            title={selected.displayName}
                            eventStatus={eventstatus}
                            code={code}
                        />                        
                    ))}
            </CardSection>
        </MainSection>
    )
}
