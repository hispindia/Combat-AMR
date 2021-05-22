import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@dhis2/ui-core'
import { Icon, LoadingIcon, icons } from '@hisp-amr/icons'
import { Table } from './Table'
import { followEvent } from '@hisp-amr/app'
import Link from '@material-ui/core/Link';


export const TableList = (props) => {
    const dispatch = useDispatch()
    var rows = props.rows
    var title = props.title
    var isFollowUp = useSelector(state => state.data.followup)
    var eventStatus = props.eventStatus
    var code = props.code
    var [followupMaps, setFollowupMaps] = useState(isFollowUp);
    var [followValues, setFollowValues] = useState([]);
    var headers = []
    var isPink = eventStatus == "COMPLETED" && code == "GP"?true:false


    const starbuttons = async (e, tableMeta,isFollowUp) => {
        var registration = tableMeta.rowData[0].toString();
        var followValue = !isFollowUp[tableMeta.rowData[0]];
        setFollowupMaps({ ...followupMaps, [registration]: followValue })
        var trackedType = tableMeta.rowData[8].toString();
        var trackedID = tableMeta.rowData[7].toString();
        var trackedOrg = tableMeta.rowData[6].toString();
        var trackedProgram = tableMeta.rowData[9].toString();
        setFollowValues([trackedOrg,trackedID,trackedType,followValue,trackedProgram])
    }

    useEffect(() => {
    dispatch(followEvent(followupMaps,followValues))
    }, [followupMaps,isFollowUp,followValues])

    if (eventStatus == "COMPLETED" && code == "GP") {
        headers = [
            {
                name: 'Registration Number',
                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Link
                                component="button"
                                variant="body2"
                                color = "inherit"
                                onClick={() => {
                                    onEventClick(tableMeta.rowData,tableMeta.rowData[6], tableMeta.rowData[7])
                                }}
                            >
                                {tableMeta.rowData[0]}
                            </Link>
                        );
                    }
                }
            },
            {
                name: 'Name of the Patient',
                                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Link
                                component="button"
                                variant="body2"
                                color = "inherit"
                                onClick={() => {
                                    onEventClick(tableMeta.rowData,tableMeta.rowData[6], tableMeta.rowData[7])
                                }}
                            >
                                {tableMeta.rowData[1]}
                            </Link>
                        );
                    }
                }
            },
            {
                name: 'Ward',
                options: { display: false },
            },
            {
                name: 'Age',
                                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Link
                                component="button"
                                variant="body2"
                                color = "inherit"
                                onClick={() => {
                                    onEventClick(tableMeta.rowData,tableMeta.rowData[6], tableMeta.rowData[7])
                                }}
                            >
                                {tableMeta.rowData[3]}
                            </Link>
                        );
                    }
                }
            },
            {
                name: 'Sex',
                                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Link
                                component="button"
                                variant="body2"
                                color = "inherit"
                                onClick={() => {
                                    onEventClick(tableMeta.rowData,tableMeta.rowData[6], tableMeta.rowData[7])
                                }}
                            >
                                {tableMeta.rowData[4]}
                            </Link>
                        );
                    }
                }
            },
            {
                name: 'Address',
                                options: {
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Link
                                component="button"
                                variant="body2"
                                color = "inherit"
                                onClick={() => {
                                    onEventClick(tableMeta.rowData,tableMeta.rowData[6], tableMeta.rowData[7])
                                }}
                            >
                                {tableMeta.rowData[5]}
                            </Link>
                        );
                    }
                }
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
                name: 'Tracked Entity Type',
                options: { display: false },
            },
            {
                name: 'Program',
                options: { display: false },
            },
            {
                name: 'Follow up',
                options: {
                    display: eventStatus == "COMPLETED" && code == "GP" ? true : false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        var opt = {}
                        var rowVal = tableMeta.rowData[0] + ''
                        if (Object.keys(followupMaps).length == 0) {
                            opt['destructive'] = true;
                        }
                        else if ((followupMaps[rowVal] == true) && (Object.keys(followupMaps).includes(rowVal))) {
                            opt['destructive'] = true;
                        }
                        else if ((followupMaps[rowVal] == false) && (Object.keys(followupMaps).includes(rowVal))) {
                            opt['secondary'] = true;
                        }
                        else {
                            opt['destructive'] = true;
                        }
                        return (
                            <Button {...opt}
                                icon={"star_filled" && <Icon icon={icons["star_filled"]} />}
                                className="FollowUp"
                                tooltip="Mark for un follow"
                                id="mybutton"
                                onClick={(e) => starbuttons(e, tableMeta, isFollowUp)}
                                size={15}
                            ></Button>
                        )
      
                    }
                }
            }]
    }
    else {
                headers = [
            {
                name: 'Registration Number',
            },
            {
                name: 'Name of the Patient',
            },
            {
                name: 'Ward',
                options: { display: false },
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
                name: 'Tracked Entity Type',
                options: { display: false },
            },
            {
                name: 'Program',
                options: { display: false },
            },
            {
                name: 'Follow up',
                options: {
                    display: eventStatus == "COMPLETED" && code == "GP" ? true : false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        var opt = {}
                        var rowVal = tableMeta.rowData[0] + ''
                        if (Object.keys(followupMaps).length == 0) {
                            opt['destructive'] = true;
                        }
                        else if ((followupMaps[rowVal] == true) && (Object.keys(followupMaps).includes(rowVal))) {
                            opt['destructive'] = true;
                        }
                        else if ((followupMaps[rowVal] == false) && (Object.keys(followupMaps).includes(rowVal))) {
                            opt['secondary'] = true;
                        }
                        else {
                            opt['destructive'] = true;
                        }
                        return (
                            <Button {...opt}
                                icon={"star_filled" && <Icon icon={icons["star_filled"]} />}
                                className="FollowUp"
                                tooltip="Mark for un follow"
                                id="mybutton"
                                onClick={(e) => starbuttons(e, tableMeta, isFollowUp)}
                                size={15}
                            ></Button>
                        )
      
                    }
                }
            }]
    }

    const onEventClick = (row, org, tei) => {
        props.onEventClick(row,org,tei)
    }

    return (
        <Table
        rows={rows}
        headers={headers}
        onEventClick={!isPink && onEventClick}
        title={title}
        />
    )

}
