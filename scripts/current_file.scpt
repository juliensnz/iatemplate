tell application "System Events"
	tell process "Adobe Illustrator 2020"
		set thefile to value of attribute "AXDocument" of window 1
	end tell
end tell
