Assumptions
===========

1. By requesting a mechanism to handle streaming-service disconnects, I assumed you wanted something other than reconnection available in the Socket.io. I used the same approach as I used for throttling for the sake of consistency.

2. I also assumed that the point of this exercise is to highlight coding style / philosophy, so I'd like to point out a few things:

  - I prefer a concise codebase, so I fixed a few lint issues and cleaned up most console.logs and bloated code.
  - I try to be up to date with standards, i.e. static propTypes and arrow functions for class methods instead of binding.
  - I also removed the build-ui directory from the repo and would expect a separate deployment strategy.
  - I'm a big fan of lodash, and favor loops with map and reduce over repeated blocks of code (see src/helpers/Html.js for example).
  - I favor templates over concatenation (see src/helpers/ApiClient.js for example).
  - In general I'm not a fan of using timers, but in this case it can be used for a simple and effective solution to both throttling and reconnecting issues and there's certainly value in consistency.
  - I'm a fan of uncluttered interfaces, so since I was already using a color metaphore (green/red) I decided to use gray to have a "disabled" look when the streamer is disconnected instead of some awkward messaging (which would need to be revisited later for internationalization).
  - I'm a big fan of flexibility and reuseability, so I implemented my throttling solution as a wrapper component which can be used to throttle any container or component. By having the refresh interval a prop, it can easily be implemented as a user configurable option. I settled on 750 ms because it seemed the most comfortable to me.
  - I also believe in being as unobtrusive as possible when modifying code, so my new logic for trend calculation (up/down) fits in relatively seamlessly with the existing logic.

Most of these points aresn't specific to React or even Javascript, and reflect my approach in general, no matter the language or platform.
