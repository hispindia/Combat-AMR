import React, {useState,useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    MainSection,
    LoadingSection,
    TitleRow,
    RichButton,
    CardSection,
    followEvent
} from '@hisp-amr/app'
import { Table } from './Table'
import { useEvents } from './useEvents'
import { icmr, tanda } from 'config'
import "./styles.css";
import Tabs from "./Tabs";
import TabPane from "./Tab-Pane";
import styled from 'styled-components'
import { Button } from '@dhis2/ui-core'
import { Icon, LoadingIcon, icons } from '@hisp-amr/icons'
import {TableList} from './TableList'

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
    // var isFollowUp = useSelector(state => state.data.followup)
    var [eventstatus, setEventstatus] = useState('ACTIVE')
    var [code, setCode] = useState(SAMPLEPROGRAMCODE)
    const { rows, loading, addButtonDisabled, error } = useEvents(status, eventstatus, code)

    // const starbuttons = async (e, tableMeta,isFollowUp) => {
    //     console.log(" Event Target ID ", e);
    //        console.log(" Table MEta ", tableMeta);
    //        console.log(" IS Follow Up in start button ",isFollowUp)
    //     setFollowup(!isFollowUp)
    //     return followup;
    // }

    // useEffect(() => {
    //     console.log(" IS Follow Up in start button after changes ",followup)
    //     dispatch(followEvent(followup))
    // }, [followup])


    // var starData = {
    // name: "Follow up",
    // options: {
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //         console.log(" After renderings ",isFollowUp)
    //         var opt = {}
    //         if (isFollowUp) {
    //             opt['destructive'] = true;
    //         }
    //         else {
    //             opt['primary'] = true;
    //         }
    //         return isFollowUp? (
    //             <Button destructive={true}                        
    //                 icon={"star_filled" && <Icon icon={icons["star_filled"]} />}
    //                 className="FollowUp"
    //                 tooltip="Mark for un follow"
    //                 id="mybutton"
    //                 onClick={(e) => starbuttons(e, tableMeta,isFollowUp)}
    //             ></Button>
    //         ) :
    //         (
    //             <Button primary={true}                     
    //                 icon={"star_filled" && <Icon icon={icons["star_filled"]} />}
    //                 className="FollowUp"
    //                 tooltip="Mark for un follow"
    //                 id="mybutton"
    //                 onClick={(e) => starbuttons(e, tableMeta,isFollowUp)}
    //             ></Button>
    //         )      
    //     }
    // }
    // }
    
    // var isFolloup = headers.find(({ name }) => name == 'Follow up');
    
    // if (isFolloup == undefined) {
    //     headers.push(starData)
    // }
    
    
    const tabValue = [
        { "name": "Pending sample result", "key": "pending", "code": "ST" },
        { "name": "Pending antibiotics result", "key": "pending", "code": "GP" },
        { "name": "Antibiotics result received", "key": "complete", "code": "GP" },
        { "name": "Sterile/NA samples", "key": "complete", "code": "ST" },
                                        
    ]
    const handleChange = (returnValue) => {
        var programCode = returnValue[2];
        var programStatus = returnValue[1]
        if (programCode == SAMPLEPROGRAMCODE && programStatus == "pending") {
            setEventstatus('ACTIVE');
            setCode(SAMPLEPROGRAMCODE);
        }
        if (programCode == SAMPLEPROGRAMCODE && programStatus == "complete") {
            setEventstatus('COMPLETED');
            setCode(SAMPLEPROGRAMCODE);
        }
        if (programCode == PROGRAMCODE && programStatus == "pending") {
            setEventstatus('ACTIVE');
            setCode(PROGRAMCODE);
        }
        if (programCode == PROGRAMCODE && programStatus == "complete") {
            setEventstatus('COMPLETED');
            setCode(PROGRAMCODE);
        }
    };

    /**
     * Called when table row is clicked.
     */
    const onEventClick = row => {
        // history.push(`/orgUnit/${row[6]}/trackedEntityInstances/${row[7]}`)
    }

    const onRowClickSelect = (curRowSelected, allRowsSelected) => {
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
                            onRowClickSelect={onRowClickSelect}
                        />                        
                    ))}
            </CardSection>
        </MainSection>
    )
}
