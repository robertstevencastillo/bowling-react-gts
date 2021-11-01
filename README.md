# gts-bowling
A bowling game built with react

Improvements needed:
  * Handle the case where more someone scores more than two consecutive strikes
  * Calculate the game score prop for the Frame component a little better. Right now it doesn't do anything. The current game score is being tracked using a global state variable.
  * The bonus roll for the last frame, in the event the user rolled a spare or strike, isn't being added to the total game score.
