// import React from 'react'
// import { arrayOf, func, object, shape, string } from 'prop-types'
// import styled from 'styled-components'
// import { Card } from '@dhis2/ui-core'
// import MUIDataTable from 'mui-datatables'

// const StyledCard = styled(Card)`
//     height: unset !important;
// `

// /**
//  * Table containg the persons events.
//  */
// export const Table = ({ title, rows, headers, onEventClick,onRowClickSelect }) => (
//     <StyledCard>
//         <MUIDataTable
//             title={title}
//             data={rows}
//             columns={headers}
//             options={{
//                 selectableRows: 'none',
//                 elevation: 0,
//                 onRowClick: onEventClick,
//                 onRowsSelect:onRowClickSelect,
//                 responsive: 'stacked',
//             }}
//         />
           
//     </StyledCard>
// )

// Table.propTypes = {
//     title: string,
//     onEventClick: func.isRequired,
//     onRowClickSelect:func.isRequired,
//     rows: arrayOf(arrayOf(string)).isRequired,
//     headers: arrayOf(
//         shape({
//             name: string.isRequired,
//             options: object,
//         })
//     ).isRequired,
// }
//========================original code 


// import React, { useEffect, useRef, useState } from 'react'
// import PropTypes from 'prop-types'
// import styled, { css } from 'styled-components'
// import { Card } from '@dhis2/ui-core'
// import MUIDataTable from 'mui-datatables'
// import { IconButton, Tooltip, TextField, Button } from '@mui/material'
// import { arrayOf, func, object, shape, string } from 'prop-types'
// import { ScanBarcode } from 'lucide-react'
// import {
//     BrowserMultiFormatReader,
//     BarcodeFormat,
//     DecodeHintType,
// } from '@zxing/library'

// // ✅ Fixed: ESLint warning-free styled component
// const StyledCard = styled(Card)`
//     height: unset !important;

//     ${({ noShadow }) =>
//         noShadow
//             ? css`
//                   box-shadow: none !important;
//               `
//             : ''}
// `

// export const Table = ({ rows, headers, onEventClick, title, noShadow,onRowClickSelect}) => {
//     const [filteredRows, setFilteredRows] = useState(rows)
//     const [barcodeValue, setBarcodeValue] = useState('')
//     const [showScanner, setShowScanner] = useState(false)
//     const [scannerReady, setScannerReady] = useState(false)
//     const videoRef = useRef(null)
//     const codeReaderRef = useRef(null)

//     const handleFilter = (value) => {
//         const lowerValue = value.toLowerCase()
//         const matched = rows.filter((row) =>
//             row.some((cell) =>
//                 String(cell).toLowerCase().includes(lowerValue)
//             )
//         )
//         setFilteredRows(matched)
//     }

//     const handleReset = () => {
//         setFilteredRows(rows)
//         setBarcodeValue('')
//     }

//     const handleScanResult = (text) => {
//         setBarcodeValue(text)
//         handleFilter(text)
//         setShowScanner(false)
//     }

//     useEffect(() => {
//         if (showScanner) {
//             const timeout = setTimeout(() => setScannerReady(true), 300)
//             return () => clearTimeout(timeout)
//         } else {
//             setScannerReady(false)
//         }
//     }, [showScanner])

//     useEffect(() => {
//         if (!(showScanner && scannerReady && videoRef.current)) return

//         const hints = new Map()
//         hints.set(DecodeHintType.POSSIBLE_FORMATS, [
//             BarcodeFormat.QR_CODE,
//             BarcodeFormat.CODE_128,
//             BarcodeFormat.EAN_13,
//             BarcodeFormat.UPC_A,
//             BarcodeFormat.CODE_39,
//         ])

//         const reader = new BrowserMultiFormatReader(hints)
//         codeReaderRef.current = reader

//         reader
//             .decodeFromConstraints(
//                 {
//                     video: {
//                         facingMode: 'environment',
//                         width: { ideal: 1280 },
//                         height: { ideal: 720 },
//                     },
//                 },
//                 videoRef.current,
//                 (result, err) => {
//                     if (result) {
//                         const text = result.getText()
//                         if (text?.trim()) {
//                             handleScanResult(text)
//                         } else {
//                             alert('Scanned value is empty.')
//                         }
//                     } else if (err && err.name !== 'NotFoundException') {
//                         console.warn('Scanner error:', err)
//                     }
//                 }
//             )
//             .catch((err) => {
//                 console.error('Camera error:', err)
//                 alert('Unable to access camera.')
//             })

//         return () => {
//             if (codeReaderRef.current) {
//                 codeReaderRef.current.reset()
//                 codeReaderRef.current = null
//             }
//         }
//     }, [showScanner, scannerReady])

//     const CustomToolbar = () => (
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <Tooltip title="Scan Barcode">
//                 <IconButton onClick={() => setShowScanner(true)}>
//                     <ScanBarcode size={20} />
//                 </IconButton>
//             </Tooltip>
//             <TextField
//                 size="small"
//                 variant="outlined"
//                 placeholder="Enter or scan barcode"
//                 value={barcodeValue}
//                 onChange={(e) => {
//                     const val = e.target.value
//                     setBarcodeValue(val)
//                     handleFilter(val)
//                 }}
//             />
//             <Button variant="outlined" onClick={handleReset}>
//                 Reset
//             </Button>
//         </div>
//     )

//     return (
//         <StyledCard noShadow={noShadow}>
//             <MUIDataTable
//                 title={title}
//                 data={filteredRows}
//                 columns={headers}
//                 options={{
//                     selectableRows: 'none',
//                elevation: 0,
//                onRowClick: onEventClick,
//                onRowsSelect:onRowClickSelect,
//                 responsive: 'stacked',
//                     customToolbar: CustomToolbar,
//                 }}
//                 // className={!onRowClick ? 'no-hover' : ''}
//             />

//             {showScanner && scannerReady && (
//                 <div
//                     style={{
//                         maxWidth: '320px',
//                         marginTop: '16px',
//                         border: '1px solid #ccc',
//                         borderRadius: '8px',
//                         overflow: 'hidden',
//                     }}
//                 >
//                     <video
//                         ref={videoRef}
//                         style={{ width: '100%', backgroundColor: '#000' }}
//                         autoPlay
//                         muted
//                     />
//                 </div>
//             )}
//         </StyledCard>
//     )
// }

// Table.propTypes = {
//     title: string,
//     onEventClick: func.isRequired,
//     onRowClickSelect:func.isRequired,
//     rows: arrayOf(arrayOf(string)).isRequired,
//     headers: arrayOf(
//         shape({
//             name: string.isRequired,
//             options: object,
//         })
//     ).isRequired,
// }


import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Card } from '@dhis2/ui-core'
import MUIDataTable from 'mui-datatables'
import CloseIcon from '@mui/icons-material/Close'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tooltip,
    TextField,
    Button,
} from '@mui/material'
import { arrayOf, func, object, shape, string } from 'prop-types'
import { ScanBarcode } from 'lucide-react'
import {
    BrowserMultiFormatReader,
    BarcodeFormat,
    DecodeHintType,
} from '@zxing/library'

const StyledCard = styled(Card)`
    height: unset !important;

    ${({ noShadow }) =>
        noShadow &&
        css`
            box-shadow: none !important;
        `}
`

export const Table = ({
    rows,
    headers,
    onEventClick,
    title,
    noShadow,
    onRowClickSelect,
}) => {
    const [filteredRows, setFilteredRows] = useState(rows)
    const [barcodeValue, setBarcodeValue] = useState('')
    const [showScanner, setShowScanner] = useState(false)
    const [scannerReady, setScannerReady] = useState(false)
    const videoRef = useRef(null)
    const codeReaderRef = useRef(null)

    const handleFilter = (value) => {
        const lowerValue = value.toLowerCase()
        const matched = rows.filter((row) =>
            row.some((cell) =>
                String(cell).toLowerCase().includes(lowerValue)
            )
        )
        setFilteredRows(matched)
    }

    const handleReset = () => {
        setFilteredRows(rows)
        setBarcodeValue('')
    }

    const handleScanResult = (text) => {
        setBarcodeValue(text)
        handleFilter(text)
        setShowScanner(false)
    }

    useEffect(() => {
        if (showScanner) {
            const timeout = setTimeout(() => setScannerReady(true), 300)
            return () => clearTimeout(timeout)
        } else {
            setScannerReady(false)
        }
    }, [showScanner])

    useEffect(() => {
        if (!(showScanner && scannerReady && videoRef.current)) return

        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.CODE_128,
            BarcodeFormat.EAN_13,
            BarcodeFormat.UPC_A,
            BarcodeFormat.CODE_39,
        ])

        const reader = new BrowserMultiFormatReader(hints)
        codeReaderRef.current = reader

        reader
            .decodeFromConstraints(
                {
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                },
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const text = result.getText()
                        if (text?.trim()) {
                            handleScanResult(text)
                        } else {
                            alert('Scanned value is empty.')
                        }
                    } else if (err && err.name !== 'NotFoundException') {
                        console.warn('Scanner error:', err)
                    }
                }
            )
            .catch((err) => {
                console.error('Camera error:', err)
                alert('Unable to access camera.')
            })

        return () => {
            if (codeReaderRef.current) {
                codeReaderRef.current.reset()
                codeReaderRef.current = null
            }
        }
    }, [showScanner, scannerReady])

    const CustomToolbar = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tooltip title="Scan Barcode">
                <IconButton onClick={() => setShowScanner(true)}>
                    <ScanBarcode size={20} />
                </IconButton>
            </Tooltip>
            <TextField
                size="small"
                variant="outlined"
                placeholder="Enter or scan barcode"
                value={barcodeValue}
                onChange={(e) => {
                    const val = e.target.value
                    setBarcodeValue(val)
                    handleFilter(val)
                }}
            />
            <Button variant="outlined" onClick={handleReset}>
                Reset
            </Button>
        </div>
    )

    return (
        <StyledCard noShadow={noShadow}>
            <MUIDataTable
                title={title}
                data={filteredRows}
                columns={headers}
                options={{
                    selectableRows: 'none',
                    elevation: 0,
                    onRowClick: onEventClick,
                    onRowsSelect: onRowClickSelect,
                    responsive: 'stacked',
                    customToolbar: CustomToolbar,
                }}
            />

            {/* Modal Dialog for Scanner */}
            {/* <Dialog
                open={showScanner}
                onClose={() => setShowScanner(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Scan Barcode</DialogTitle>
                <DialogContent>
                    {scannerReady ? (
                        <video
                            ref={videoRef}
                            style={{
                                width: '100%',
                                backgroundColor: '#000',
                                borderRadius: '8px',
                            }}
                            autoPlay
                            muted
                        />
                    ) : (
                        <div
                            style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#666',
                            }}
                        >
                            Loading camera...
                        </div>
                    )}
                </DialogContent>
            </Dialog> */}

            <Dialog
    open={showScanner}
    onClose={() => setShowScanner(false)}
    maxWidth="sm"
    fullWidth
>
    <DialogTitle
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
    >
        Scan Barcode
        <IconButton onClick={() => setShowScanner(false)} size="small">
            <CloseIcon />
        </IconButton>
    </DialogTitle>
    <DialogContent>
        {scannerReady ? (
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    backgroundColor: '#000',
                    borderRadius: '8px',
                }}
                autoPlay
                muted
            />
        ) : (
            <div
                style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#666',
                }}
            >
                Loading camera...
            </div>
        )}
    </DialogContent>
</Dialog>

        </StyledCard>
    )
}

Table.propTypes = {
    title: string,
    onEventClick: func.isRequired,
    onRowClickSelect: func.isRequired,
    rows: arrayOf(arrayOf(string)).isRequired,
    headers: arrayOf(
        shape({
            name: string.isRequired,
            options: object,
        })
    ).isRequired,
}
