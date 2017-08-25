window.globalPoints = [];

window.globalPointsChecked = [0];

window.globalCountPointsTMP = [];
window.globalStep = 0;

window.globalLopKey = true;

class CreatePoint{
	constructor( map ){
		this.map = map;
	}

	getField(){
		let field = document.getElementById(this.map);
		return field;
	}

	boundingClientRect(){		
		let boundingRect = this.getField().getBoundingClientRect();
		return boundingRect;
	}

	createPoint(event){
		// find all point
		let allPoint = document.getElementsByClassName('mx-point');
		let countPoints = 0;

		for(let i=0; i<=allPoint.length; i++){
			countPoints = i;
		}

		// for button count===================
		if(countPoints===2){
			let button = document.getElementById('count');
			button.removeAttribute('disabled');
		}

		// position point
		let posX = event.clientX - this.boundingClientRect().left;
		let posY = event.clientY - this.boundingClientRect().top;

		// create element
		let el = document.createElement('div');
		el.className = 'mx-point';
		el.style.left = posX + 'px';
		el.style.top = posY + 'px';

		el.setAttribute('data-number-element', countPoints);
		el.setAttribute('data-x', posX);
		el.setAttribute('data-y', posY);

		this.getField().appendChild(el);

		// push to array
		globalPoints.push(el);
		
	}
}

class CalculateRoute{

	constructor(button){
		this.button = button;		
	}

	getButton(){
		let button = document.getElementById(this.button);
		return button;
	}

	findCoordinatesPointFirst(_pointFirst){

		let posX = globalPoints[_pointFirst].getAttribute('data-x');
		let posY = globalPoints[_pointFirst].getAttribute('data-y');

		return{
			positionX: posX,
			positionY: posY
		};
	}

	findCoordinatesPointSecond(_secondPoint){

		let posX = globalPoints[_secondPoint].getAttribute('data-x');
		let posY = globalPoints[_secondPoint].getAttribute('data-y');

		return{
			positionX: posX,
			positionY: posY
		};
	}

	maxDistance(arrayDistances){
		let maxDistance = Math.max.apply(null, arrayDistances);
		return maxDistance;
	}

	distanceToPoint(firstPoint, secondPoint){
		//console.log( firstPoint + ' -> ' + secondPoint );


// 1 step find x and y

	
	let coordinatesFirstPoint = this.findCoordinatesPointFirst(firstPoint);
	let coordinatesSecondPoint = this.findCoordinatesPointSecond(secondPoint);

	// console.log(coordinatesFirstPoint);
	// console.log(coordinatesSecondPoint);
		

// 2 step
		// count distance

	// difference X
	let xFirstPoint = coordinatesFirstPoint.positionX;
	let xSecondPoint = coordinatesSecondPoint.positionX;

	// find cathetus 1
	let differenceX = 0;
	if(xFirstPoint > xSecondPoint){
		differenceX = xSecondPoint - xFirstPoint;
	} else{
		differenceX = xFirstPoint - xSecondPoint;
	}

	let cathetus1 = Math.pow(differenceX, 2);
	// ______________________________________________

	// difference Y
	let yFirstPoint = coordinatesFirstPoint.positionY;
	let ySecondPoint = coordinatesSecondPoint.positionY;

	// find cathetus 2
	let differenceY = 0;
	if(yFirstPoint > ySecondPoint){
		differenceY = ySecondPoint - yFirstPoint;
	} else{
		differenceY = yFirstPoint - ySecondPoint;
	}

	let cathetus2 = Math.pow(differenceY, 2);

	console.log(differenceY + ' ' + differenceX);

	// distance to point
	let dToPoint = cathetus1 + cathetus2;
	dToPoint = Math.sqrt(dToPoint);


	// push to array
	globalCountPointsTMP.push([secondPoint, dToPoint]);






	// 
	// 
	// нужно узнать номер точки к которой самая короткая
	// дистанция и запушить ее в масив globalPointsChecked
	// 
	// 
	// проверить переменные difference(X/Y) чтобы небыло отрецательного значения
	// 
	// 
	// 











// 3 step
		// let arrayDistances = [];
		// let _arr = globalCountPointsTMP.map(function(el){
		// 	arrCount.push(el[1]);	
		// });
		// maxDistance(arrayDistances);

// 4 step
		// globalCountPointsTMP = []; // clear array

	}

	dataNumberElement(){
		let _index = globalPointsChecked.length - 1;
		let _number = globalPointsChecked[_index];

		return _number;
	}

	distanceToNeighboringPoint(){
		
		// от данной точки идет измерение длины к следующим
		if(globalStep === globalPoints.length){
			globalStep = globalPoints.length;
			globalLopKey = false;
		} else{
				

			
			// Calculate distance to points
			for(let i=0; i<globalPoints.length; i++){

				if(globalPointsChecked.indexOf(i) !== -1){
					continue;
				} else{					
					this.distanceToPoint(this.dataNumberElement(), i);
				}
				// globalPointsChecked.push(i);

				
			}



			// next step
			globalStep++;

		}
		
	}

}

// ----------------------------------

let newPoint = new CreatePoint('map');

let arrPoint = new CalculateRoute('count');

// set points
newPoint.getField().onclick = function(event){
	newPoint.createPoint(event);
}

// count points
let loop = '';
arrPoint.getButton().onclick = function(){
	loop = setInterval(countPointsInterval, 1000);
}

function countPointsInterval(){

	arrPoint.distanceToNeighboringPoint();

	if(globalLopKey === false){
		clearInterval(loop);
	}

}


// let arr = [
// 	[1,543],
// 	[3,234],
// 	[6,76]
// ];
// let arrCount = [];
// let _arr = arr.map(function(el){
// 	arrCount.push(el[1]);	
// });
// console.log(arrCount);

// let _max = Math.max.apply(null, arrCount);

// console.log(_max);