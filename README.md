# Event CountDown APP

## Intro

CountDown App serves as a countdown timer for events, allowing users to specify the event's date 
and name. It shows the remaining time until the event in Days, Hours (h), Minutes (m), and Seconds (s).
The event title adjust its display to fit the screen width.

## Installation

Run app using following commands in terminal :
```
git clone git@github.com:kumarsanjay435/FrontendChallenge.git
cd countdown
npm install
ng serve

```
Go to web browser and navigate to `http://localhost:4200/`.


## Improvements / Suggestions

### Design Improvements:
- **Improve UI Flickering:** The UI readjusts due to font size
  changes in title after the elements are rendered.

### Business Logic Improvements:
- **Font size Calulation:** Currently algo uses binary search but it can improve to use multiple algo based on context (i.e screen size, etc).
- **Restrict Past Dates:** Restrict date selection for past dates
- **Event Status button functionality:** After date and title selection a submit button to show the countdown timer to event.
- **Error Handling by showing user messages:** Submit button allows to show error messages to user in a nice way unlike subscription subject based approach 

## Github Pages Deployment 
https://kumarsanjay435.github.io/FrontendChallenge/

