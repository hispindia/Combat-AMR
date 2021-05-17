import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@dhis2/ui-core'
import { Icon, LoadingIcon, icons } from '@hisp-amr/icons'
import { Table } from './Table'
import {  followEvent } from '@hisp-amr/app'

export const TableList = (props) => {
    const dispatch = useDispatch()
    var rows = props.rows
    var title = props.title
    var isFollowUp = useSelector(state => state.data.followup)
    // var [followup, setFollowup] = useState(true)
    // var [registration, setRegistration] = useState([]);
    var [followupMaps, setFollowupMaps] = useState({});


    const starbuttons = async (e, tableMeta,isFollowUp) => {
        console.log(" IS Follow Up in start button ", isFollowUp)
        var registration = tableMeta.rowData[0].toString();
        var followValue = !isFollowUp[tableMeta.rowData[0]];
        setFollowupMaps({[registration]:followValue})
    }

    useEffect(() => {
    console.log(" IS Follow Up in start button after changes ",followupMaps)
    dispatch(followEvent(followupMaps))
    }, [followupMaps])


    var headers= [
        {
            name: 'Registration Number',
        },
        {
            name: 'Name of the Patient',
        },
        {
            name: 'Ward',
            options : {display:false},
        },
        {
            name: 'Age',
        },
        {
            name: 'Sex',
        },
        {
            name: 'Address',
        },
        {
            name: 'Organisation unit ID',
            options: { display: false },
        },
        {
            name: 'Tracked Entity Instance ID',
            options: { display: false },
        },
        {
            name: 'Follow up',
            options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            var opt = {}
            if (isFollowUp) {
                opt['destructive'] = true;
            }
            else {
                opt['primary'] = true;
            }
            return isFollowUp[tableMeta.rowData[0].toString()] ? (
                <Button destructive={true}                        
                    icon={"star_filled" && <Icon icon={icons["star_filled"]} />}
                    className="FollowUp"
                    tooltip="Mark for un follow"
                    id="mybutton"
                    onClick={(e) => starbuttons(e, tableMeta,isFollowUp)}
                ></Button>
            ) :
            (
                <Button primary={true}                     
                    icon={"star_filled" && <Icon icon={icons["star_filled"]} />}
                    className="FollowUp"
                    tooltip="Mark for un follow"
                    id="mybutton"
                    onClick={(e) => starbuttons(e, tableMeta,isFollowUp)}
                ></Button>
            )      
        }
    }
    }]

    const onEventClick = row => {
        // history.push(`/orgUnit/${row[6]}/trackedEntityInstances/${row[7]}`)
    }
    
    return (
        <Table
        rows={rows}
        headers={headers}
        onEventClick={onEventClick}
        title={title}
        />
    )

}
