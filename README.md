#  Apps and libs for the AMR Surveillance System
#test commit for notify
# Developer Guide for AMR Data Entry app

# Technical Skills required:

DHIS2 Platform Knowledge 
JavaScript 
React
Redux 
Postgres 
Java
Basics of Node

# Set up on Operating System   

# For Windows & IOS

You need to set env variable inside script of package.json file which highlight with yellow color (eg "build:tanda": "cross-env REACT_APP_DHIS2_TABLE_CONFIG=tanda react-scripts build")

# For Linux 

You need to set env variable inside script of package.json file which highlight with yellow color (eg "build:tanda": "env REACT_APP_DHIS2_TABLE_CONFIG=tanda react-scripts build")

# app-icons
  Contain all icons  and path to used   
# apps
# apps/entry
# apps/entry/public
All statics content for app (like logo and image)
# apps/entry/src/index.js
 start point of AMR app 
# apps/entry/src/store.js
 To store global state of AMR app 
# apps/entry/src/store.js
 To store global state of AMR app 
# apps/entry/src/.env
 To set version of dhis2 api use in AMR 
# apps/entry/src/.env.development
 To set development environment using Developement link (eg http://172.105.47.158/amrhp_pilot)
# apps/entry/src/.env.production
 To set production environment 
# apps/entry/src/jsconfig.json
App compile configuration
 # apps/entry/src/Actions/index.js
To export all files of Actions folder
# apps/entry/src/Actions/orgUnits.js
To get selected org unit details
# apps/entry/src/Actions/types.js
To provide action types 
# apps/entry/src/api/types.js
To provide action types 
# Scripts
# Scripts/bump.js
To controlled version of app


# Custom library 
# @hisp-amr/api (npm) 

Once you run yarn install. It will install @hisp-amr/api library from (https://classic.yarnpkg.com/en/ )  on your node_modules 
You can see folder with name libs 
# libs/api/src/crud.js
Base of crud operation set  (GET, POST, PUT, DELETE) and BaseUrl Set
# libs/api/src/
Inside the src folder there are some test js files with the extension of .test.js. You can neglect these files.
# libs/api/src/deleteEvent.js
To Delete event one by one
# libs/api/src/deleteTEI.js
To Delete Tracked Entity Instances one by one
# libs/api/src/getEvent.js
To get particular event  detail 
# libs/api/src/index.js
Export js file overall project 
# libs/api/src/postDateElement.js
To post Data element value of Entered DataElement
# libs/api/src/postEvent.js
To create event 
# libs/api/src/putEvent.js
To update event data 
# libs/api/src/request.js
To send data for header during api call 

# @hisp-amr/icons

# libs/icons/src/colors.js
To decorate icons with better color
# libs/icons/src/icons.js
To  present all icons
# libs/icons/src/index.js
To  export all file over the project 
# libs/icons/src/proTypes.js
To pass pros of icons
# libs/icons/components/src/Icon.js
To get icon for relative contain
# libs/icons/components/src/LoadingIcon.js
To load icons while rendering component
# libs/icons/components/src/styledSvg.js
To styled icons for better view of icons 

# @hisp-amr/inputs
# libs/inputs/src/index.js
To export component for entire AMR project 
# libs/inputs/src/setupTests.js
To set up library for AMR project integration
# libs/inputs/src/components/index.js
To export files which present inside index files
# libs/inputs/src/components/label.js
To maintain lebal of div 
# libs/inputs/src/components/MinWidth.js
To Validate minimum width
# libs/inputs/src/components/optionSpacer.js
To styled space of options 
# libs/inputs/src/components/Row.js
To styled for Row contain
# libs/inputs/src/components/selectInput.js
To select input from form and validate input value
# libs/inputs/src/components/SwitchInput.js
To switch input fields from form and validate input value
# libs/inputs/src/components/AgeInput/AgeField.js
To  age pick from calendar and validate
# libs/inputs/src/components/AgeInput/AgeInput.js
To count and show age in input field 
# libs/inputs/src/components/AgeInput/DateOfBirth.js
To pick value from calendar and set into age fields
# libs/inputs/src/components/AgeInput/index.js
To export all files of CheckBoxInputs folder
# libs/inputs/src/components/CheckBoxInputs/CheckBoxInput.js
To check the input box and get input box value
# libs/inputs/src/components/CheckBoxInputs/checkboxInputs.js
To check input box group and get the value of checked input box
# libs/inputs/src/components/DateInput/index.js
To export all files of Date Input folder
# libs/inputs/src/components/DateInput/DateInput.js
To pick date and filled with value
# libs/inputs/src/components/DateInput/textField.js
To set selected date into text and validate
# libs/inputs/src/components/RadoiInputs/index.js
To export all files of Radio Input folder
# libs/inputs/src/components/RadoiInputs/RadoiInput.js
To select radio button input and set selected
# libs/inputs/src/components/RadoiInputs/RadoiInputs.js
To select radio buttons from group of radio button, set selected and get value 
# libs/inputs/src/components/textInput/index.js
To export all files of textInput folder
# libs/inputs/src/components/textInput/constants.js
To provide kind of texts, types and statuses 
# libs/inputs/src/components/textInput/StyledInputField.js
To decorate text field 
# libs/inputs/src/components/textInput/textInput.js
To set value in  text field and validated value of input field
# libs/inputs/src/components/textInput/useDebounce.js
To update value in  text field and validated value of input field
# libs/inputs/src/components/textInput/useValues.js
To controlled input value of input text
# libs/inputs/src/components/TransferList/index.js
To export all files of Transfer List folder
# libs/inputs/src/components/TransferList/multiSelect.js
To select multiple times in same field
# libs/inputs/src/components/TransferList/transferButtons.js
To provide all button, align button and controlled enable and disable buttons
# libs/inputs/src/components/TransferList/transferlist.js
To align options value and options set

# @hisp-amr/org-unit-tree (npm)

# libs/org-unit-tree/src/index.js
To export all files of src folder for entire AMR App
# libs/org-unit-tree/src/api/index.js
To export all files of api folder 
# libs/org-unit-tree/src/api/getOrgUnits.js
To get all org units in hierarchical  structure
# libs/org-unit-tree/src/api/getUserOrgUnits.js
To get org units assigned to user
# libs/org-unit-tree/src/components/index.js
To export all files of components folder 
# libs/org-unit-tree/src/components/caret.js
To styled selected org units and open all child org unit
# libs/org-unit-tree/src/components/childTree.js
To styled child of org units 
# libs/org-unit-tree/src/components/Label.js
To arrange label of org units in lists
# libs/org-unit-tree/src/components/noCaret.js
To styled for last level on org Units
# libs/org-unit-tree/src/components/orgUnitNode.js
To show list of selected org units
# libs/org-unit-tree/src/components/orgUnitTree.js
To get all hierarchical org units 
# libs/org-unit-tree/src/components/Row.js
To arrange org unit in row 
# libs/org-unit-tree/src/components/useOrgUnits.js
To manage org units  and provide detail of selected org units
# libs/org-unit-tree/src/utils/index.js
To export toOrgunitTree files
# libs/org-unit-tree/src/utils/toOrgUnitTree.js
To load hierarchical list of tree and sort it 
'
