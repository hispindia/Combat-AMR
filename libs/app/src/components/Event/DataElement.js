import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { string, object } from "prop-types";
import { Padding, MaxWidth } from "../Padding";
import {
  SAMPLE_ID_ELEMENT,
  ORGANISM_DETECTED,
  SAMPLE_TESTING_PROGRAM,
  ADDITIONAL,
} from "constants/dhis2";
import {
  TextInput,
  RadioInputs,
  SelectInput,
  SwitchInput,
  DateInput,
} from "@hisp-amr/inputs";
import { setEventValue, AddAndSubmit, addNotes } from "actions";
import TextField from "@material-ui/core/TextField";

import * as DUPLICACY from "constants/duplicacy";
import {
  LABTECH,
  CLINICIAN,
  PATHOGEN_DETECTED,
  RESULTS,
  NOTES,
  CLINICIAN_G,
} from "./../../../../../apps/entry/src/components/EventForm/Entity/constants";

export const DataElement = ({ id }) => {
  const dispatch = useDispatch();
  var { program, organism, sampleDate } = useSelector(
    (state) => state.data.panel
  );
  const optionSets = useSelector((state) => state.metadata.optionSets);
  const completed = useSelector((state) => state.data.event.status.completed);
  var value = useSelector((state) => state.data.event.values[id]);
  const programId = useSelector((state) => state.data.panel.program);
  const preValues = useSelector((state) => state.data.previousValues);
  const programStage = useSelector((state) => state.data.event.programStage);
  const username = useSelector((state) => state.metadata.user.username);
  var notes = useSelector((state) => state.data.notes);
  const userGroup = useSelector((state) => state.metadata.userGroup);
  var printValues = useSelector((state) => state.data.printValues);

  // if (id == "yMKFqLn9LBx") {
  //     value = value.split("-")[0]
  // }
  if (Object.keys(preValues).length && id in preValues) {
    value = preValues[id];
  }
  const color = useSelector(
    (state) => state.data.event.programStage.dataElements[id].color
  );
  var disabled = useSelector(
    (state) => state.data.event.programStage.dataElements[id].disabled
  );
  if (
    userGroup == LABTECH &&
    programStage.displayName.toLowerCase().includes(CLINICIAN)
  ) {
    disabled = true;
  }
  if (
    userGroup == CLINICIAN_G &&
    !programStage.displayName.toLowerCase().includes(CLINICIAN)
  ) {
    disabled = true;
  }
  const displayFormName = useSelector(
    (state) => state.data.event.programStage.dataElements[id].displayFormName
  );
  const displayHospitalSort = useSelector(
    (state) => state.data.event.programStage.dataElements["Gkmu7ySPxjb"]
  );
  const sampleResultDataElement = useSelector(
    (state) => state.data.event.programStage.dataElements["VbUbBX7G6Jf"]
  );
  const ReasonDataElement = useSelector(
    (state) => state.data.event.programStage.dataElements["Oziw3yNGpiD"]
  );
  const ReasonDataElement1 = useSelector(
    (state) => state.data.event.programStage.dataElements
  );
  if (displayFormName == NOTES) {
    value = value.split("-")[0];
  }
  const error = useSelector(
    (state) => state.data.event.programStage.dataElements[id].error
  );
  const hide = useSelector(
    (state) => state.data.event.programStage.dataElements[id].hide
  );
  const optionSet = useSelector(
    (state) => state.data.event.programStage.dataElements[id].optionSet
  );
  const optionSetValue = useSelector(
    (state) => state.data.event.programStage.dataElements[id].optionSetValue
  );
  const required = useSelector(
    (state) => state.data.event.programStage.dataElements[id].required
  );
  var valueType = useSelector(
    (state) => state.data.event.programStage.dataElements[id].valueType
  );

  if (programStage.displayName.toLowerCase().includes(CLINICIAN)) {
    if (valueType == "LONG_TEXT") {
      valueType = "TEXTAREA";
    }
  }
  const numType = valueType.toUpperCase();
  const warning = useSelector(
    (state) => state.data.event.programStage.dataElements[id].warning
  );
  const warningSampleResult = useSelector(
    (state) => state.data.event.programStage.dataElements['VbUbBX7G6Jf']?.warning
  );
  const eventValPassed = useSelector((state) => state.data.event.values);
  const sampleRecivedDate = useSelector(
    (state) => state.data.event.values["N2f6uoy2zqE"]
  );
  const samplecollectedDate = useSelector(
    (state) => state.data.event.values["Xxn6IK3L34r"]
  );
  const calculateDayDifference = (date1, date2) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  };
  console.log("ReasonDataElement1=============", ReasonDataElement1)
  console.log("warning=============", warning)
  console.log("ReasonDataElement==============", ReasonDataElement)
  const updateDaysDifference = (receivedDate, collectedDate) => {
    if (receivedDate && collectedDate) {
      const daysDifference = calculateDayDifference(
        new Date(receivedDate),
        new Date(collectedDate)
      ).toString();
      dispatch(setEventValue("KRzP6XOv1mH", daysDifference, false));
    }
  };
  useEffect(() => {
    if (
      eventValPassed &&
      eventValPassed["N2f6uoy2zqE"] &&
      eventValPassed["Xxn6IK3L34r"] &&
      !eventValPassed["KRzP6XOv1mH"]
    ) {
      updateDaysDifference(sampleRecivedDate, samplecollectedDate);
      //   const receivedDate = new Date(sampleRecivedDate);
      //   const collectedDate = new Date(samplecollectedDate);

      //   const daysDifference = calculateDayDifference(receivedDate, collectedDate).toString();

      //   dispatch(setEventValue("KRzP6XOv1mH", daysDifference, false));
    }
  }, [eventValPassed, sampleRecivedDate, samplecollectedDate, dispatch]);

  // useEffect(() => {
  //     if (eventValPassed && eventValPassed["N2f6uoy2zqE"] && !eventValPassed['KRzP6XOv1mH']) {

  //       let sampleDates = new Date(sampleRecivedDate);
  //       let values = new Date(eventValPassed["Xxn6IK3L34r"]);
  //       const calculateDay = (val, sd) => {
  //         let difference = sd.getTime() - val.getTime();
  //         return Math.ceil(difference / (1000 * 3600 * 24));
  //       };

  //       dispatch(
  //         setEventValue(
  //           "KRzP6XOv1mH",
  //           calculateDay(values, sampleDates).toString(),
  //           false
  //         )
  //       );

  //     }

  //   }, [eventValPassed]);

  const duplicate =
    id === SAMPLE_ID_ELEMENT &&
    SAMPLE_TESTING_PROGRAM["0"].value == programId &&
    useSelector((state) => state.data.event.duplicate);
  const required1 = useSelector(
    (state) => state.data.event.programStage.dataElements["KRzP6XOv1mH"]
  );

  const onChange = (key, value, unique, label) => {
    // if (key === "N2f6uoy2zqE" || key ==="Xxn6IK3L34r") {

    //     let sampleDates = new Date(sampleRecivedDate);
    //     let values = new Date(value);
    //     const calculateDay = (val, sd) => {
    //       let difference = sd.getTime() - val.getTime();
    //       return Math.ceil(difference / (1000 * 3600 * 24));
    //     };

    //     dispatch(
    //       setEventValue(
    //         "KRzP6XOv1mH",
    //         calculateDay(values, sampleDates).toString(),
    //         false
    //       )
    //     );
    //   }
    if (key === "N2f6uoy2zqE" || key === "Xxn6IK3L34r") {
      // const receivedDate = new Date(sampleRecivedDate);
      // const newDate = new Date(value);

      // const daysDifference = calculateDayDifference(receivedDate, newDate).toString();

      // dispatch(setEventValue("KRzP6XOv1mH", daysDifference, false));
      const updatedEventValues = {
        ...eventValPassed,
        [key]: value,
      };
      const receivedDate = updatedEventValues["N2f6uoy2zqE"];
      const collectedDate = updatedEventValues["Xxn6IK3L34r"];
      updateDaysDifference(receivedDate, collectedDate);
    }
    var results = RESULTS;
    if (
      (key == ORGANISM_DETECTED && value == PATHOGEN_DETECTED) ||
      key == ADDITIONAL
    ) {
      dispatch(AddAndSubmit(true));
      dispatch(setEventValue(key, value, false));
    } else if (key == ORGANISM_DETECTED && results.indexOf(value) > -1) {
      dispatch(AddAndSubmit(false));
      dispatch(setEventValue(key, value, false));
    } else {
      var lB = label;

      if (!printValues) {
        printValues = {
          program: program,
          organism: organism,
          sampleDate: sampleDate,
          [lB]: value,
        };
      } else {
        for (var prkey in printValues) {
          if (lB == prkey) {
            printValues = { ...printValues, [lB]: value };
          } else {
            printValues = { ...printValues, [lB]: value };
          }
        }
      }
      dispatch(setEventValue(key, value, false, printValues));
    }
  };

  const handleChange = (event) => {
    console.log("event+++++++++++++++++", event)
    if (id == "TcThq7OLuKf") {
      dispatch(setEventValue(id, event.target.value, false, printValues));//add code for Additonal comment
    } else dispatch(addNotes(id, event.target.value));
    // dispatch(addNotes(id, event.target.value));
    // onChange(id, event.target.value);
  };

  if (hide) return null;
  
  //function for sortig the option set values according to alphabetical order for this DataElement Gkmu7ySPxjb
  function sortAlphabetically(arr) {
    return arr.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
  }


  // console.log(sortedData,"Mixed flora");
  return (
    <Padding>
      {optionSetValue ? (
        optionSets[optionSet].length < 5 ? (

          <RadioInputs
            objects={optionSets[optionSet]}
            name={id}
            label={displayFormName}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled || completed}
          />
        ) : (
          <SelectInput
            objects={displayHospitalSort?.id == "Gkmu7ySPxjb" ? sortAlphabetically(optionSets[optionSet]) : optionSets[optionSet]}
            name={id}
            label={displayFormName}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled || completed}
          />
        )
      ) : valueType === "TRUE_ONLY" ? (
        <SwitchInput
          name={id}
          label={displayFormName}
          checked={value}
          onChange={onChange}
          required={required}
          value={value}
          disabled={disabled || completed}
        />
      ) : valueType === "DATE" ? (
        <DateInput
          name={id}
          label={displayFormName}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled || completed}
        />
      ) : valueType == "TEXTAREA" || valueType == "LONG_TEXT" ? (
        <TextField
          id="outlined-multiline-static"
          label={displayFormName}
          multiline
          rows={5}
          variant="outlined"
          required={required}
          name={id}
          onChange={handleChange}
          className="textArea"
          disabled={disabled || completed}
          defaultValue={value}
        />
      ) : (
        <TextInput
          name={id}
          label={displayFormName}
          value={value}
          required={required}
          onChange={onChange}
          disabled={disabled || completed}
          type={valueType}
          color={numType == "NUMBER" && value && color}
          unique={id === SAMPLE_ID_ELEMENT}
          error={
            error
              ? error
              : id === SAMPLE_ID_ELEMENT &&
                duplicate === DUPLICACY.DUPLICATE_ERROR
                ? duplicate
                : ""
          }
          warning={
            warning
              ? warning
              : id === SAMPLE_ID_ELEMENT &&
                duplicate === DUPLICACY.DUPLICATE_WARNING
                ? duplicate
                : ""
          }
          loading={
            id === SAMPLE_ID_ELEMENT &&
              duplicate === DUPLICACY.DUPLICATE_CHECKING
              ? true
              : false
          }
        />
      )}



      {/* {(id == "VbUbBX7G6Jf" && value == "Mixed flora") || ((id == "VbUbBX7G6Jf" && value == "Rejected" && (id == "Oziw3yNGpiD" && value !== ""))) ? <div style={{ color: '#D9534F', textAlign: 'center' }}>Please repeat sample1111111</div> : ""} */}
      {(sampleResultDataElement?.id === "VbUbBX7G6Jf" && value == "Mixed flora") || (sampleResultDataElement?.id === "VbUbBX7G6Jf" && value == "Rejected") ? (<div style={{ color: '#D9534F', textAlign: 'center' }}>{warningSampleResult}</div>) : ""}
    </Padding>
  );
};
// (values['Oziw3yNGpiD'] != '') || (values['VbUbBX7G6Jf'] == 'Mixed flora')
DataElement.propTypes = {
  id: string.isRequired,
};
