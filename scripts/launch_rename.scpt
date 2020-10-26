on run argv
    tell application "System Events"
        tell process "Adobe Illustrator"
            set frontmost to true
            click menu item "rename" of menu of menu item "Scripts" of menu "File" of menu bar 1
            delay 1
            keystroke "" & item 1 of argv & ""
            delay 1
            key code 36
            delay 1
            click menu item "Save" of menu "File" of menu bar 1
            delay 5
            click menu item "Close" of menu "File" of menu bar 1
        end tell
    end tell
end run
