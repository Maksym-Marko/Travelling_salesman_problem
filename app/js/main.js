window.app = {};

class CreatePoint{
	constructor( map ){
		this.map = map;

		app.globalPoints = [];
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
		app.globalPoints.push(el);
		
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

		app.globalPointsChecked = [0];
		app.globalCountPointsTMP = [];
		app.globalStep = 0;
		app.globalLopKey = true;
		app.openMap = true;
		app.distanceCountKey = true;
	}

	getButton(){
		let button = document.getElementById(this.button);
		return button;
	}

	findCoordinatesPointFirst(_pointFirst){

		let posX = app.globalPoints[_pointFirst].getAttribute('data-x');
		let posY = app.globalPoints[_pointFirst].getAttribute('data-y');

		// posX = parseInt(posX);
		// posY = parseInt(posY);

		return{
			positionX: posX,
			positionY: posY
		};
	}

	findCoordinatesPointSecond(_secondPoint){

		let posX = app.globalPoints[_secondPoint].getAttribute('data-x');
		let posY = app.globalPoints[_secondPoint].getAttribute('data-y');

		// posX = parseInt(posX);
		// posY = parseInt(posY);

		return{
			positionX: posX,
			positionY: posY
		};
	}

	minDistance(){

		let arrayDistances = [];
		let _arr = app.globalCountPointsTMP.map(function(el){
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
		app.globalCountPointsTMP.push([secondPoint, dToPoint]);

	}

	dataNumberElement(){
		let _index = app.globalPointsChecked.length - 1;
		let _number = app.globalPointsChecked[_index];

		return _number;
	}

	distanceToNeighboringPoint(){

		if(app.distanceCountKey === true){

			app.distanceCountKey = false;
			// ____________________

			// от данной точки идет измерение длины к следующим
			if(app.globalStep === app.globalPoints.length-1){
				app.globalStep = app.globalPoints.length;
				app.globalLopKey = false;
			} else{

				// Calculate distance to points
				for(let i=0; i<app.globalPoints.length; i++){

					if(app.globalPointsChecked.indexOf(i) !== -1){
						continue;
					} else{
						this.distanceToPoint(this.dataNumberElement(), i);
					}
					
				}

				// min distance
				let minDistance = this.minDistance();
				// console.log(minDistance);

				// find in array app.globalCountPointsTMP point
				let numEl = 0;
				let _arr = app.globalCountPointsTMP.map(function(el){

					if(el[1] === minDistance){
						app.globalPointsChecked.push(el[0]);
						numEl = el[0];
					}
					
				});

				// clear tmp array
				app.globalCountPointsTMP = [];

				// console.log(app.globalPointsChecked);

				// next step
				app.globalStep++;

				// show info
				let showInfo = new ShowInfo('point_' + numEl, app.globalStep, minDistance);
				showInfo.createInfo();

				// ___________________
				app.distanceCountKey = true;

			}			

		}		

	}

}

// ----------------------------------

let newPoint = new CreatePoint('map');

let arrPoint = new CalculateRoute('count');

// set points
newPoint.getField().onclick = function(event){

	if(app.openMap === true){
		newPoint.createPoint(event);
	}
	
}

// count points
let loop = '';
arrPoint.getButton().onclick = function(){

	// disabled button
	this.setAttribute('disabled', 'disabled');

	// closed map
	app.openMap = false;

	// show info
	let showInfo = new ShowInfo('point_0', 0, 0);
	showInfo.createInfo();

	loop = setInterval(countPointsInterval, 1500);
}

function countPointsInterval(){

	arrPoint.distanceToNeighboringPoint();

	if(app.globalLopKey === false){
		clearInterval(loop);
	}

}