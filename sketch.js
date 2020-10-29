//so the weather station updates about once every five minutes, so its definitely accurate

//so what i want to do is check... yeah, actually, how DO i want to structure this?
//i think the "changes" should be relative to... this day and the previous day? would that really work if there's so much data...
//what i could do is... there needs to be some statistics involved here.
//map definitely needs to be used. question is, what am i mapping between?
//the past week seems fine, right? then take the most recent data point.
//5 minutes into seven days... 5 minutes is 120 times per hour. 
//2880 times per day
//20160 times per week. that's... doable, though it'd need to load.

//so we want to find the min and the max and map those between... whatever we decide. 
//then use the mapped value as the speed of the rain and clouds. :3
//then change the colors...

//FOR MOVING THE SUN 
//god do i need to find the like index of the timestamp... this timestamp is formatted v poorly
//it starts at the 12th 1

//so i guess i could turn them into dates and then... get the hours and... minutes part from the date. then i need to turn them into point things.
//i can remap the minutes from 0 to 1. then... add them to the hours?

//well, whats next. most important is to fix the sun angle. i want the highest point of the sun to be... yeah, like 200 pixels below the height 
//of the screen. so it'd be making an ellipse angle based on that. im sure it's doable bc theres only one path an ellipse can take to go through 
//a set of four points, assuming it's still an ellipse.

//after sun angle, stars and moon. then we'll see, gotta add the spaces for input at some point.

//right, i think this is the last step
//we need to... so, right now... right. ok. so, right now midnight is the 0 and 24 (other midnight) is the end.
//... just change the initial position, right...?
//or no, bc init pos doesnt matter. its initial angle. then wouldnt i have to change final angle?

//changing final angle is the only way its gonna work, maybe just adding smthing to the value?

// TO-DO: stop moon from slamming into wall
// change colors on the mountains (don't want them all one-tone at night, can just stop the lerp before it completes by 
// changing the if conditions)
// pick a typeface
  // what impression do i want people to have? comfort? something warm? something a little calm? i think so. 
  // PUT THE BLINKING CURSOR AFTER IT? that's more... like, typewriter. typewriter can work?
  // they're kinda calming but also like, storytelling. yeah, this is about storytelling. like in jason's website, that's hot right now.
// im digging the airier fonts, maybe cause of weather. air is part of weather.

let canvas;

function dateConverter(array,newArray) {
    for (let i = 0; i<array.length; i++) {
      let date = new Date(array[i]);
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = `.0${minutes}`; 
      } else {
        minutes = `.${minutes}`;
      }
      newArray[i] = Number(`${date.getHours()-4}`+minutes);
      }    
    return newArray;
}
  
let weatha;
let weatha2;
let weatha3;
let weatha4;
let weatha5;
let weatha6;

let isLoaded = false;

let weathaList = {};

let windspeed = [];
let windavg = 0;
let rain = [];
let rainavg = 0;

let offset = -3;
let time = 0;
let date;

let finalWind = 0;
let finalAngle;
let currRain;
let finalRain = 0;
let temp = 0;
let humid = 0;
let pressure = 0;

  /*function mapper(array,mappedArray,lower,upper,constraint = 0) {
    console.log("hewf0");
    let maxValue = max(array);
    let minValue = min(array);
    for (let i =0; i<array.length; i++) {
      if (constraint != 0) {
        let mappedValue = constrain(map(array[i],minValue,maxValue,lower,upper,true),-1,constraint);
        mappedArray[i] = mappedValue;
      } else {
        let mappedValue = map(array[i],minValue,maxValue,lower,upper,true);
        mappedArray[i] = mappedValue;
      }
    }
    console.log("hewf");
  }*/
  
  /*let url = 'https://tigoe.io/itpower-data';
  let macID = 'F8:F0:05:F5:F8:51';
  let sessionKey = '90764572';
  let path = 'https://tigoe.io/itpower-data?macAddress=F8:F0:05:F5:F8:51&sessionKey=90764572';*/
  
  // make arrays to save each weather data
  
  function preload() {

    let now = Math.floor(Date.now() / 1000);
    let lat = 40.730610;
    let lon = -73.935242;
    let API_KEY = "d8c3d614b10e8af43f5b0ae8ee1eeeda";
    let urlNow =
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units={imperial}`;
    let minusOne = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${(now - 86400)}&appid=${API_KEY}&units={imperial}`;
    let minusTwo = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${(now - (86400*2))}&appid=${API_KEY}&units={imperial}`;
    let minusThree = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${(now - (86400*3))}&appid=${API_KEY}&units={imperial}`;
    let minusFour = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${(now - (86400*4))}&appid=${API_KEY}&units={imperial}`;
    let minusFive = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${(now - (86400*5))}&appid=${API_KEY}&units={imperial}`;

    const todayPromise = httpGet(urlNow, 'jsonp', false, function(response) {
        weatha = response;
        weathaList["Today"] = weatha;
    });

    const yestPromise = httpGet(minusOne, 'jsonp', false, function(response) {
        weatha2 = response;
        weathaList["Yesterday"] = weatha2;
    });

    const twoPromise = httpGet(minusTwo, 'jsonp', false, function(response) {
        weatha3 = response;
        weathaList["Two"] = weatha3;
    });

    const threePromise = httpGet(minusThree, 'jsonp', false, function(response) {
        weatha6 = response;
        weathaList["Three"] = weatha6;
    });

    const fourPromise = httpGet(minusFour, 'jsonp', false, function(response) {
        weatha4 = response;
        weathaList["Four"] = weatha4;
    });

    const fivePromise = httpGet(minusFive, 'jsonp', false, function(response) {
        weatha5 = response;
        weathaList["Five"] = weatha5;
    });

    Promise.all([todayPromise,yestPromise,twoPromise,threePromise,fourPromise,fivePromise]).then((weather) => {

        //console.log(weather);

        //making our wind and rain arrays
        for (let i = 1; i < weather.length-1; i++) {
            for (let j = 0; j < weather[i].hourly.length; j++) {
                if (weather[i].hourly[j].rain) {
                    rain.push(weather[i].hourly[j].rain["1h"])
                }
                windspeed.push(weather[i].hourly[j].wind_speed);
            }
        }

        //get the avg amount of rain
        for (let i=0; i<rain.length; i++) {
            rainavg += rain[i];
        }
        rainavg /= rain.length;

        //and map the rain
        if (weather[0].current.rain) {
            currRain = weather[0].current.rain["1h"];
            finalRain = map(currRain,min(rain),max(rain),0,2000);
        } else {
            finalRain = 0;
            currRain = 0;
        }

        date = new Date();
        time = (date.getUTCHours() + offset);
        time += (date.getUTCMinutes() / 60);

        //console.log("time before mapping, "+time);

        //get the angle and mapped windspeed
        finalAngle = map(time,0,24,2*PI,4*PI) - (3.2*PI)/2;
        finalWind = weather[0].current.wind_speed;
        finalWind = map(finalWind,min(windspeed),max(windspeed),0.1,5);
        temp = (weather[0].current.temp * (9/5) - 459.67);
        humid = weather[0].current.humidity;
        pressure = weather[0].current.pressure;

        //console.log("final wind, "+finalWind);
        //console.log("final rain, "+finalRain);
        //console.log("final angle, "+finalAngle);

        document.getElementById("rain").innerHTML = "Rain: "+(currRain * 0.039370)+" inches";
        document.getElementById("wind").innerHTML = "Wind Speed: "+(weather[0].current.wind_speed * 2.236936)+" mph";
        document.getElementById("temperature").innerHTML = "Temperature: "+temp+" F";
        document.getElementById("humidity").innerHTML = "Humidity: "+humid+" %";
        document.getElementById("pressure").innerHTML = "Pressure: "+pressure;

        isLoaded = true;


    });

    //i might not need mapper for all of these, can i just do what i did for final angle?
    //sun: RISES AT 6 AND SETS AT 6
    //finalWind = map(windspeedmph[windspeedmph.length-1],min(windspeedmph),max(windspeedmph),0.1,5);
    //finalRain = map(rainin[rainin.length-1],min(rainin),max(rainin),0,2000);
    //recordedtime = dateConverter(recorded_at,recordedtime);
    //finalAngle = map(recordedtime[recordedtime.length-1],min(recordedtime),max(recordedtime),0,2*PI) - (3*PI)/2;
    //finalAngle = map(recordedtime[recordedtime.length-1],min(recordedtime),max(recordedtime),2*PI,4*PI) - (3*PI)/2;
  }

  //------------------------------------//
  //--------------SUN-------------------//
  //------------------------------------//
  let theSun;

  function Sun() {
    this.x = null;
    this.y = null;
    this.angle = PI / 12;
    this.r = 100;
    this.speed = 0.01
    this.a = null;
    this.b = null;

    this.newAngleMove = function() {
      this.a = width/4;
      //this.a = width/2;
      this.b = height-height/6;
  
      if (this.angle < finalAngle) {
        this.angle += this.speed;
        //this makes the speed horrendously high somehow
        //because when its negative they get divided to some insane amount
        this.speed = constrain(finalAngle/(pow(this.angle,5.3)),0.003,.01);
        //the problem is that for small angles even pow of this.angle won't be very high
        //so for those you'll need to... maybe pow of finalAngle-this.angle?
        //console.log(finalAngle/(pow(this.angle,5.3)));
      }

      this.x = (this.a*this.b) / sqrt((this.b*this.b) + ((this.a*this.a)*pow(tan(this.angle),2)));
      this.y = (this.a*this.b) / sqrt((this.a*this.a) + ((this.b*this.b)/pow(tan(this.angle),2)));

      if(this.angle > PI/2 && this.angle < (3*PI)/2){
        this.x *= -1;
      }

      if(this.angle > PI && this.angle < 2*PI){
        this.y *= -1;
      }

      this.x += width/2;
      this.y += height;

      noStroke();
      fill("#FFC914");
      circle(this.x,this.y,this.r);

      /*console.log("SunXPos: "+this.x,"SunYPos: "+this.y, "SunSpeed: "+this.speed, "Sun Angle: "+this.angle,
                  "MoonXPos: "+theMoon.newX,"MoonYPos: "+theMoon.newY,"Moon Angle: "+theMoon.angle,
                  "The Final Angle: "+finalAngle, "Width of Screen: "+width/2,"Height of Screen: "+height);*/
    }
  }

  //------------------------------------//
  //--------------MOON-------------------//
  //------------------------------------//
 let theMoon;

  function Moon() {
    this.x = null;
    this.y = null;
    this.newX = -theSun.x + width;
    this.newY = -theSun.y + height*2;
    this.angle = theSun.angle + PI;
    this.r = 100;
    this.speed = 0.01
    this.a = null;
    this.b = null;

    this.newAngleMove = function(color) {

      this.newX = -theSun.x + width;
      this.newY = -theSun.y + height*2;

      noStroke();
      fill("white");
      circle(this.newX,this.newY,this.r);
      fill(color);
      circle(this.newX+20,this.newY,this.r-5);
    }
  }
  
  //------------------------------------//
  //-------------RAIN-------------------//
  //------------------------------------//
  let drops = []
  //let finalRain;
  
  function Drop() {
    this.x = random(0, width+200);
    this.initialX = this.x;
    this.y = random(0, -height);
    
    this.show = function() {
      noStroke();
      fill("#D8F0ED");
      ellipse(this.x, this.y, random(1, 4), random(1, 4));   
    }
    this.update = function() {
      this.speed = random(5, 10);
      this.gravity = 1.5;
      this.y = this.y + this.speed*this.gravity; 
      this.x += -2;
      
      if (this.y > height) {
        this.y = random(0, -height);
        this.x = this.initialX;
        this.gravity = 0;
  }
  }
  }

  //------------------------------------//
  //--------------STARS-----------------//
  //------------------------------------//
  let stars = [];

  function Star() {
    this.x = random(10,width-10)
    this.y = random(10,height-10)
    this.r = random(0.1,3);
    this.time = random(PI);

    this.show = function(color) {
      if (this.x < width/2 && this.y > height/1.5) {
        this.x = random(10,width-10)
        this.y = random(10,)
      }
      this.time += random(.05,.15);
      this.r = this.r + sin(this.time) / 15;
      fill(color);
      ellipse(this.x,this.y,this.r);
    }
  }

  //------------------------------------//
  //---------------CLOUDS---------------//
  //------------------------------------//

  let clouds = [];
  //let finalWind;
  
  function cloud(size,position) {
    fill(256, 150);
    noStroke();
    quad(position[0]-size,
         position[1],
         position[0],
         position[1]-size/2,
         position[0]+size,
         position[1],
         position[0],
         position[1]+size/2
         );
  }
  
  function Cloud(size, position, speed) {
    
    this.size = size;
    this.position = position;
    this.speed = 1;
    
    this.display = function(){
      cloud(this.size, this.position);
      this.position[0] += speed;
    }
  }
  
  function setup() {
    //canvas = createCanvas($(document).width(), $(document).height());
    //canvas = createCanvas($('#sketchHolder').width(),windowHeight);
    //canvas = createCanvas($('#sketchHolder').width(),$('#sketchHolder').height());
    canvas = createCanvas(windowWidth,windowHeight);
    //canvas.parent('sketchHolder')
    canvas.position(0,0);
    canvas.style('z-index','-1');

    theSun = new Sun();
    theMoon = new Moon();

    for (let i=0; i<100; i++) {
      stars.push(new Star);
    }
  }
  
  let bgColor; 

  function draw() {
    //-----------------------------//
    //------BACKGROUND COLOR-------//
    //-----------------------------//
    fromBG = color("#7BB2D9");
    toBG = color("#031C34");
    //-----------------------------//
    //------TRIANGLE COLORS--------//
    //-----------------------------//
    let BTColor1;
    let BTColor2;
    let TColor1;
    let TColor2;
    let FTColor1;
    let FTColor2;
    let starColor;

    let angleMeasure;

    if (theSun.angle > finalAngle) {

      const addFadeClass = elem => elem.classList.add("fadeIn3");

      document.getElementById("firstInput").classList.add("fadeIn");
      document.getElementById("secondInput").classList.add("fadeIn05");
      document.getElementById("thirdInput").classList.add("fadeIn1");
      document.getElementById("buttonz").classList.add("fadeIn3");

      document.querySelectorAll(".intro").forEach(addFadeClass);
    }

    if (theSun.angle > PI && theSun.angle < (3*PI)/2) {
      angleMeasure = (theSun.angle-PI)/(PI/2);

      bgColor = lerpColor(toBG,fromBG,(theSun.angle-PI)/(PI/2));
      BTColor1 = lerpColor(color("#353544"),color("#3E5899"),angleMeasure);
      BTColor2 = lerpColor(color("#3E5899"),color("#353544"),angleMeasure);

      TColor1 = lerpColor(color("#3D665C"),color("#3C4C39"),angleMeasure);
      TColor2 = lerpColor(color("#3C4C39"),color("#3D665C"),angleMeasure);

      FTColor1 = lerpColor(color("#578B8D"),color("#95C2A6"),angleMeasure);
      FTColor2 = lerpColor(color("#95C2A6"),color("#578B8D"),angleMeasure);

      //so the stars are out at 4pm here, which isnt a great look
      //i could... remap the sun position to a smaller range and then do white to bgcolor
      starColor = lerpColor(color("white"),bgColor,angleMeasure);
    } else if (theSun.angle > (3*PI)/2 && theSun.angle < 2*PI) {
      bgColor = lerpColor(fromBG,toBG,cos(theSun.angle));
      BTColor1 = lerpColor(color("#3E5899"),color("#353544"),constrain(cos(theSun.angle),0,.90));
      BTColor2 = color("#353544")

      TColor1 = color("#3C4C39");
      TColor2 = lerpColor(color("#3D665C"),color("#3C4C39"),constrain(cos(theSun.angle),0,.90));

      FTColor1 = lerpColor(color("#95C2A6"),color("#578B8D"),constrain(cos(theSun.angle),0,.90));
      FTColor2 = color("#578B8D");

      starColor = lerpColor(bgColor,color("white"),cos(theSun.angle));
    } else {
      bgColor = toBG;

      BTColor1 = lerpColor(color("#3E5899"),color("#353544"),.90);
      BTColor2 = color("#353544");
      TColor1 = color("#3C4C39");
      TColor2 = lerpColor(color("#3D665C"),color("#3C4C39"),.90);
      FTColor1 = lerpColor(color("#95C2A6"),color("#578B8D"),.90);
      FTColor2 = color("#578B8D");

      starColor = color("white");
    }
    background(bgColor);
    
    let tx1 = -100;
    let ty1 = height;
    let tx2 = width/2+tx1;
    let ty2 = height/4;
    let tx3 = width/2+tx2;
    let ty3 = height;

    theMoon.newAngleMove(bgColor);

    //-------------STARS-----------------------//
    for (let i=0; i<stars.length; i++) {
      stars[i].show(starColor);
    }
    
    //-------------SUN MOVES HERE--------------//
    theSun.newAngleMove();
    
    //background triangle 1
    let bt1x2 = width/5;
    let bt1x1 = bt1x2 - width/6;
    let bt1x3 = bt1x2 + width/8;
    //side 1
    fill(BTColor1);
    triangle(bt1x1, ty1, bt1x2, height/3, bt1x3, ty3);
    //side 2 
    fill(BTColor2);
    triangle(bt1x1, ty1, bt1x2, height/3, bt1x3-(bt1x3-bt1x1)/3, ty3);
    
    //background triangle 2 
    let bt2x2 = bt1x2/2;
    let bt2x1 = bt2x2 - width/4;
    let bt2x3 = bt2x2 + width/6;
    //side 1
    fill(BTColor1);
    triangle(bt2x1, ty1, bt2x2, height/2.3, bt2x3, ty3);
    //side 2
    fill(BTColor2);
    triangle(bt2x1, ty1, bt2x2, height/2.3, bt2x3-(bt2x3-bt2x1)/1.5, ty3);
    
    //first triangle
    //side 1
    fill(TColor2);
    triangle(tx1, ty1, tx2, ty2, tx3, ty3);
    //side 2
    fill(TColor1);
    triangle(tx1, ty1, tx2, ty2, tx3-((tx3-tx1)/1.5), ty3);
    
    //rain 
    if (finalRain > 0) {
      if (!(drops.length > 0)) {
        for(let i = 0; i < finalRain; i++) {
          drops[i] = new Drop();
        }
      }
    }
    for(let i = 0; i < drops.length; i++) {
      drops[i].show();
      drops[i].update();
    }
    
    //second triangle
    let t3x2 = tx2+(tx2/10);
    let t3x1 = t3x2-width/6;
    let t3x3 = t3x2+width/8;
    //side 1
    fill(FTColor1);
    triangle(t3x1,ty1,t3x2,ty2*2.2,t3x3,ty3);
    //side 2
    fill(FTColor2);
    triangle(t3x1,ty1,t3x2,ty2*2.2,t3x3-(t3x3-t3x1)/1.4,ty3);
    
    //third triangle
    let t2x1 = tx2+(tx2/7);
    let t2x2 = t2x1 + width/8;
    let t2x3 = t2x2 + width/6;
    //side 1
    fill(FTColor1);
    triangle(t2x1, ty1, t2x2, ty2+height/2, t2x3, ty3);
    //side 2
    fill(FTColor2);
    triangle(t2x1, ty1, t2x2, ty2+height/2, t2x3-((t2x3-t2x1)/3), ty3);
    
    //fourth triangle
    let t4x2 = tx2 - width/6;
    let t4x1 = t4x2 - width/7;
    let t4x3 = t4x2 + width/8;
    //side 1 
    fill(FTColor1);
    triangle(t4x1, ty1, t4x2, ty2+height/2.5, t4x3, ty3);
    //side 2 
    fill(FTColor2);
    triangle(t4x1, ty1, t4x2, ty2+height/2.5, t4x3-(t4x3-t4x1)/1.3, ty3);
    
    //clouds 
    //higher speed = higher chance of clouds spawning
    if (clouds.length < 10) {
      if (random(0,1000*(1/finalWind)) < 1) {
        clouds.push(new Cloud(random(50,width/13),[random(-100, -50),random(60,height/2)],finalWind));
      }
    }
    for (let i=0; i<clouds.length; i++) {
      clouds[i].display();
      if (clouds[i].position[0] > width+100) {
        clouds.splice(i,1);
      }
    }
    //console.log(theSun.angle);
  }
  
  function windowResized() {
    //resizeCanvas($('#sketchHolder').width(), $('#sketchHolder').height());
    resizeCanvas(windowWidth, windowHeight);
    //mapper(windspeedmph,mappedwindspeed,0.1,5);
    //mapper(rainin,mappedrainin,0,2000);
    //finalWind = map(windspeedmph[windspeedmph.length-1],min(windspeedmph),max(windspeedmph),0.1,5);
    //finalRain = map(rainin[rainin.length-1],min(rainin),max(rainin),0,2000);
  }