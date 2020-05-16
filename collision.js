// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight-30;
var score = 0; 

// Variables
const mouse = {
    x: 0,
    y: 0
};



 // Event Listeners
addEventListener('click',event =>{
  
   mouse.x = event.clientX;
   mouse.y = event.clientY;
  
   particles.forEach(particle => {
        if(distance(mouse.x,mouse.y,particle.x,particle.y) - particle.radius < 0){
           var item = particle.item ;
           particles.splice(item,1);
           mySound.play();
           circleArea-=Math.PI*particle.radius*particle.radius;
           sorting(item);
           score+=1;
        }
   }   
   );
}); 
        


addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight-30;

    init();
});


// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sorting(n){
    for(var i = n;i< particles.length;i++){
        particles[i].item--;
    }
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}
function getRandomColor() {
    
    var color,r ,g ,b ,a;
    r = randomIntFromRange(0, 255);
    g = randomIntFromRange(0, 255);
    b = randomIntFromRange(0, 255);
    a = randomIntFromRange(5, 7)*0.1;
    color = `rgba(${r}, ${g}, ${b}, ${a})`;
    return color;
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotateVelocities(velocity, theta) {
    const rotatedVelocity = {
        x: velocity.x * Math.cos(theta) - velocity.y * Math.sin(theta),
        y: velocity.x * Math.sin(theta) + velocity.y * Math.cos(theta)
    };
    return rotatedVelocity;
}


// Objects
function Particle(x, y, radius, item) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
    };
    this.radius = radius;
    this.mass = 1;
    this.item = item;
    this.color = getRandomColor();

    this.update = particles => {
        this.draw();

        for (let i = 0; i < particles.length; i++) {
            const otherParticle = particles[i];
            if (this.x === otherParticle.x) continue;
          var centerDist = this.radius+otherParticle.radius;
            if (distance(this.x, this.y, otherParticle.x, otherParticle.y) - centerDist < 0) {

                const res = {
                    x: this.velocity.x - otherParticle.velocity.x,
                    y: this.velocity.y - otherParticle.velocity.y
                };

                if (res.x * (otherParticle.x - this.x) + res.y * (otherParticle.y - this.y) >= 0) {

                    const m1 = this.mass;
                    const m2 = otherParticle.mass;
                    const theta = -Math.atan2(otherParticle.y - this.y, otherParticle.x - this.x);

                    const rotatedVelocity1 = rotateVelocities(this.velocity, theta);
                    const rotatedVelocity2 = rotateVelocities(otherParticle.velocity, theta);

                    const swapVelocity1 = { x: rotatedVelocity1.x * (m1 - m2) / (m1 + m2) + rotatedVelocity2.x * 2 * m2 / (m1 + m2), y: rotatedVelocity1.y };
                    const swapVelocity2 = { x: rotatedVelocity2.x * (m1 - m2) / (m1 + m2) + rotatedVelocity1.x * 2 * m2 / (m1 + m2), y: rotatedVelocity2.y };

                    const u1 = rotateVelocities(swapVelocity1, -theta);
                    const u2 = rotateVelocities(swapVelocity2, -theta);

                    this.velocity.x = u1.x;
                    this.velocity.y = u1.y;
                    otherParticle.velocity.x = u2.x;
                    otherParticle.velocity.y = u2.y;
                }
            }
        }
        

        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0)
            this.velocity.x = -this.velocity.x;

        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
            this.velocity.y = -this.velocity.y;

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = "black";
        c.stroke();
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    };
   
}


// Implementation
var particles;
var item = 0;
function init() {
    
    particles = [];
    

    for (let i = 0; i < 5; i++) {
        let radius = randomIntFromRange(25,35);
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);

        if (particles.length >= 1) {
            for (let j = 0; j < particles.length; j++) {
                var centerDist = radius+particles[j].radius;
                if (distance(x, y, particles[j].x, particles[j].y) - centerDist < 0) {
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);

                    j = -1;
                    continue;

                }
            }
        }
        circleArea+=Math.PI*radius*radius;
        particles.push(new Particle(x, y, radius, item));
        item++;
    }
}


// Animation Loop
var id;
var time =500;
function animate() {
    id = requestAnimationFrame(animate); 
    
    c.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update(particles);
    });
}
 var circleArea = 0;
 var canvasArea = canvas.width*canvas.height;
 
//interval for appearance of bubbles
function startInterval(){
interval = setInterval(function() {
    var ratio = circleArea/canvasArea;
    let radius = randomIntFromRange(25,35);
    
        let x = randomIntFromRange(radius, canvas.width - radius);
        let y = randomIntFromRange(radius, canvas.height - radius);

        if (particles.length >= 1) {
            for (let j = 0; j < particles.length; j++) {
                var centerDist = radius+particles[j].radius;
                if (distance(x, y, particles[j].x, particles[j].y) - centerDist < 0) {
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);

                    j = -1;
                    continue;

                }
            }
        }
    if(ratio <= 0.40){
        item = particles.length;
        circleArea+=Math.PI*radius*radius;
        particles.push(new Particle(x, y, radius, item));
       
    }
    
    else{
        localStorage.setItem("score",score);
        stopinterval();
        window.open("gameover.html");
        cancelAnimationFrame(id);
        mySound.stop();
        
    }
  
},time);
}
function stopinterval(){
    clearInterval(interval);
}
var mySound ;
var myBgm;
//start of the game
function startGame(){
init();
animate();
startInterval(); 
mySound = new sound("bubble.mp3");
myBgm = new sound("bgm.mp3");
myBgm.sound.setAttribute("loop","infinite");
myBgm.play();
}

//additional button functions
function pause(){
    stopinterval();
    cancelAnimationFrame(id);
    c.clearRect(0, 0, canvas.width, canvas.height);  
}

function resume(){
    animate();
    startInterval();
}

function restart(){
    stopinterval();
    cancelAnimationFrame(id);
    c.clearRect(0, 0, canvas.width, canvas.height);
    init();
    animate();
    startInterval(); 
}