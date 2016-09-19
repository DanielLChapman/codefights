//Passes sample tests, passes one hidden test, too inefficient for the other hidden tests. Too many loops yo. How do I make it better?
//Needed a way to reproduce the B array, from http://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//moved the calculating functions to a seperate area
function calculate(a, b) {
    var total = 0;
    //error control
    if (a.length <= b.length) {
      for(var temp = 0; temp<a.length;temp++) {
       total += Math.abs(a[temp]-b[temp]);
      }
    }
    return total;
}

//This mess man. 
//So this is a longabout way of doing it. I make arrays of each 
//possible combination of numbers. The number of numbers is equal to the difference between the two arrays (diff).  
function closestSequence2(a, b) {
	this.a = a;
	this.b = b;
	var fluid = [];
	var originalArray = [];
	var diff = b.length-a.length;
	var max=b.length - 1;
    //I create an initial array of [0,1,2,3,...] and a copy which I call original. 
	for (var temp = 0; temp < diff; temp++) {
		fluid.push(temp);
		originalArray.push(temp);
	}
	
	//initialize counter for the loop and a "min" number to compare to
	var counter = 0;
	var min = 1000;
    //check to make sure there is a diff, if not, just calculate
	if (diff != 0) { 
    //while the counter is less then the max length of array b raised to the power of the difference, divided by the difference. It goes over the amount of arrays needed but not by much. Couldnt figure out the formula for the exact number. This also misses the calculation for [0,1,2,3..], instead if starts at [0,1,2,4,...]. I had a few lines in here to correct it but they were ultimately not needed. 
	while (counter < (Math.pow(max,diff)/diff)) {
        //if its the last column and under max, then incrememnt it
		if (fluid[fluid.length-1] < max) {
      			fluid[fluid.length-1]++;
    		}
		else {
            //otherwise, figure out how far back in the area we have to go to find a number not near its max (for an array b of length 13 and a diff of 4, max of each number in the area would be [10, 11, 12, 13]), and adjust the number and the number after it. 
			for (var temp = fluid.length-2; temp >= 0; temp--) {
         			 	if (fluid[temp] < max-(fluid.length-temp-1)) {
                				fluid[temp]++;
                				fluid[temp+1] = fluid[temp]+1;
                				break;
            			}
            			else {
                				if (temp-1 >= 0 && fluid[temp-1] < max-(fluid.length-temp) ) {
                  			 		fluid[temp-1] = fluid[temp-1] + 1;
                    					fluid[temp] = originalArray[temp-1] + 1;
                    					break;
                				}
            			}
        			}
		}
        // for calculating
		var total = 0;
        //clone the array b.
		var tempArray = clone(b);
        //take the array we generated and slash the indexes from b
		for (var i = diff-1; i >= 0; i--) {
			tempArray.splice(fluid[i], 1);
		}
        //calculate
		total = calculate(a, tempArray);
        //if its below the min, congrats we have a new min
		if (total < min) { min = total; }
		counter++;
	}
	}
	else {
		min = calculate(a, b);
	}
	return(min);

}
