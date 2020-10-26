tell application "System Events"
    tell process "Adobe Illustrator"
        set frontmost to true
        click menu item "export" of menu of menu item "Scripts" of menu "File" of menu bar 1
    end tell
end tell
