on run argv
    tell application "System Events"
        tell process "Adobe Illustrator"
            set frontmost to true
            click menu item "Package..." of menu "File" of menu bar 1
            delay 1
            keystroke "" & item 1 of argv & ""
            delay 1
            key code 48
            key code 48
            delay 1
            keystroke "" & item 2 of argv & ""
            key code 48
            key code 48
            key code 48
            key code 48
            key code 48
            key code 48
            key code 48
            delay 1
            keystroke space
            delay 10
            click menu item "Close" of menu "File" of menu bar 1
        end tell
    end tell
end run
