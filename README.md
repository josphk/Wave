# Wave

Wave is an RoR application that provides rehabilitation for people with poor motor control. It leverages IoT technology with a custom-made motion sensor to produce and consume positional data in real-time. Every user session processes this data to generate metrics such average time and accuracy, which are visualized to show trends over time using D3.js.

Watch a [demo](https://youtu.be/VSNmgCS7qPw)!

Learn to build a Wave Motion Tracker [here](https://www.hackster.io/jkim0120/wave)!

Software:

* Built on Ruby on Rails
* Motion test and user statistics UI made with D3.js
* Real-time updates on tracker and user status using Firebase

Hardware:

* IoT interfaced with Particle Photon
* Infrared Sensor taken from a Wii Remote (connected via I2C/TWI)
