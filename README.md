d3.spinner
==========

Spin the wheel!

Dependencies:
http://d3js.org/d3.v3.zip

How to use:

Construct a new Wheel
var foo = new Spinner(element, configObj); 

element is the DOM node to attach the wheel to. Required.
configObj is optional. 
The text on the pie slices is initialized via this object {configObj.data}
using a simple array.


Spin the Wheel
call the .spin method.
return value is an object containing two properties:
duration
selection


Update the wheel
call the .update(newData) method
provide new values as an array



