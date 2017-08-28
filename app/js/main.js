window.globalPoints = [];
window.globalPointsChecked = [0];
window.globalCountPointsTMP = [];
window.globalStep = 0;
window.globalLopKey = true;
window.openMap = true;
window.distanceCountKey = true;

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

		// for button count
		if(countPoints===2){
			let button = document.getElementById('count');
			button.removeAttribute('disabled');
		}

		// position point
		let posX = event.clientX - this.boundingClientRect().left;
		let posY = event.clientY - this.boundingClientRect().top;

		posX = parseInt(posX);
		posY = parseInt(posY);

		// create element
		let el = document.createElement('div');
		el.className = 'mx-point';
		el.style.left = posX + 'px';
		el.style.top = posY + 'px';

		el.setAttribute('data-number-element', countPoints);
		el.setAttribute('id', 'point_' + countPoints);
		el.setAttribute('data-x', posX);
		el.setAttribute('data-y', posY);

		this.getField().appendChild(el);

		// push to array
		globalPoints.push(el);
		
	}
}

class ShowInfo{
	constructor(idElement, orderNumber, distance){
		this.idElement = idElement;
		this.orderNumber = orderNumber;
		this.distance = distance;
	}

	createInfo(){
		// find point
		let point = document.getElementById(this.idElement);

		// add counter
		let counter = document.createElement('div');
		counter.className = 'mx_order_number';

		let _span = document.createElement('span');
		_span.innerHTML = this.orderNumber;

		counter.appendChild(_span);

		point.appendChild(counter);

		// add distance
		let distanceToPoint = document.createElement('div');
		distanceToPoint.className = 'mx-distance';

		if(this.idElement !== 'point_0'){
			distanceToPoint.innerHTML = 'D: ' + (this.orderNumber-1) + ' -> ' + this.orderNumber + ' = ' + this.distance + 'px';
		}

		point.appendChild(distanceToPoint);

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

		// posX = parseInt(posX);
		// posY = parseInt(posY);

		return{
			positionX: posX,
			positionY: posY
		};
	}

	findCoordinatesPointSecond(_secondPoint){

		let posX = globalPoints[_secondPoint].getAttribute('data-x');
		let posY = globalPoints[_secondPoint].getAttribute('data-y');

		// posX = parseInt(posX);
		// posY = parseInt(posY);

		return{
			positionX: posX,
			positionY: posY
		};
	}

	minDistance(){

		let arrayDistances = [];
		let _arr = globalCountPointsTMP.map(function(el){
			arrayDistances.push(el[1]);	
		});

		let minDistance = Math.min.apply(null, arrayDistances);
		return minDistance;

	}

	distanceToPoint(firstPoint, secondPoint){

		// 1 step find x and y
		let coordinatesFirstPoint = this.findCoordinatesPointFirst(firstPoint);
		let coordinatesSecondPoint = this.findCoordinatesPointSecond(secondPoint);

		// console.log(coordinatesFirstPoint);
		// console.log(coordinatesSecondPoint);

		// count distance

		// difference X
		let xFirstPoint = coordinatesFirstPoint.positionX;
		let xSecondPoint = coordinatesSecondPoint.positionX;

		// find cathetus 1
		let differenceX = xSecondPoint - xFirstPoint;
		differenceX = Math.abs(differenceX);

		let cathetus1 = Math.pow(differenceX, 2);

		// difference Y
		let yFirstPoint = coordinatesFirstPoint.positionY;
		let ySecondPoint = coordinatesSecondPoint.positionY;

		// find cathetus 2
		let differenceY = ySecondPoint - yFirstPoint;
		differenceY = Math.abs(differenceY);

		let cathetus2 = Math.pow(differenceY, 2);

		// console.log(differenceX);

		// distance to point
		let dToPoint = cathetus1 + cathetus2;
		dToPoint = Math.sqrt(dToPoint);
		dToPoint = parseInt(dToPoint);

		// push to array
		globalCountPointsTMP.push([secondPoint, dToPoint]);

	}

	dataNumberElement(){
		let _index = globalPointsChecked.length - 1;
		let _number = globalPointsChecked[_index];

		return _number;
	}

	distanceToNeighboringPoint(){

		if(distanceCountKey === true){

			distanceCountKey = false;
			// ____________________

			// от данной точки идет измерение длины к следующим
			if(globalStep === globalPoints.length-1){
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
					
				}

				// min distance
				let minDistance = this.minDistance();
				// console.log(minDistance);

				// find in array globalCountPointsTMP point
				let numEl = 0;
				let _arr = globalCountPointsTMP.map(function(el){

					if(el[1] === minDistance){
						globalPointsChecked.push(el[0]);
						numEl = el[0];
					}
					
				});

				// clear tmp array
				globalCountPointsTMP = [];

				// console.log(globalPointsChecked);

				// next step
				globalStep++;

				// show info
				let showInfo = new ShowInfo('point_' + numEl, globalStep, minDistance);
				showInfo.createInfo();

				// ___________________
				distanceCountKey = true;

			}			

		}		

	}

}

// ----------------------------------

let newPoint = new CreatePoint('map');

let arrPoint = new CalculateRoute('count');

// set points
newPoint.getField().onclick = function(event){

	if(openMap === true){
		newPoint.createPoint(event);
	}
	
}

// count points
let loop = '';
arrPoint.getButton().onclick = function(){

	// disabled button
	this.setAttribute('disabled', 'disabled');

	// closed map
	openMap = false;

	// show info
	let showInfo = new ShowInfo('point_0', 0, 0);
	showInfo.createInfo();

	loop = setInterval(countPointsInterval, 1500);
}

function countPointsInterval(){

	arrPoint.distanceToNeighboringPoint();

	if(globalLopKey === false){
		clearInterval(loop);
	}

}