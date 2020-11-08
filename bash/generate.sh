#!/bin/bash

cp ./scripts/rename.jsx '/Applications/Adobe Illustrator 2020/Presets.localized/en_US/Scripts/rename.jsx'
cp ./scripts/export.jsx '/Applications/Adobe Illustrator 2020/Presets.localized/en_US/Scripts/export.jsx'
cp ./scripts/json2.js '/Applications/Adobe Illustrator 2020/Presets.localized/en_US/Scripts/json2.js'

TEMPLATE_PATH=$1
DESTINATION_FOLDER=$2
CLIENT_IDENTIFIER=$3
DATA=$4

mkdir -p $DESTINATION_FOLDER
open $TEMPLATE_PATH/declinaisons.ai
sleep 5
osascript ./scripts/duplicate.scpt "$DESTINATION_FOLDER" "$CLIENT_IDENTIFIER"
sleep 5
open "$DESTINATION_FOLDER/$CLIENT_IDENTIFIER/Links/Elements.ai"
sleep 5
osascript ./scripts/launch_rename.scpt "$DATA"
sleep 5
open "$DESTINATION_FOLDER/$CLIENT_IDENTIFIER/declinaisons.ai"
sleep 5
osascript ./scripts/export.scpt
$
