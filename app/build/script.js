'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.globalPoints = [];

window.globalPointsChecked = [0];

window.globalCountPointsTMP = [];
window.globalStep = 0;

window.globalLopKey = true;

var CreatePoint = function () {
	function CreatePoint(map) {
		_classCallCheck(this, CreatePoint);

		this.map = map;
	}

	_createClass(CreatePoint, [{
		key: 'getField',
		value: function getField() {
			var field = document.getElementById(this.map);
			return field;
		}
	}, {
		key: 'boundingClientRect',
		value: function boundingClientRect() {
			var boundingRect = this.getField().getBoundingClientRect();
			return boundingRect;
		}
	}, {
		key: 'createPoint',
		value: function createPoint(event) {
			// find all point
			var allPoint = document.getElementsByClassName('mx-point');
			var countPoints = 0;

			for (var i = 0; i <= allPoint.length; i++) {
				countPoints = i;
			}

			// for button count===================
			if (countPoints === 2) {
				var button = document.getElementById('count');
				button.removeAttribute('disabled');
			}

			// position point
			var posX = event.clientX - this.boundingClientRect().left;
			var posY = event.clientY - this.boundingClientRect().top;

			// create element
			var el = document.createElement('div');
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
	}]);

	return CreatePoint;
}();

var CalculateRoute = function () {
	function CalculateRoute(button) {
		_classCallCheck(this, CalculateRoute);

		this.button = button;
	}

	_createClass(CalculateRoute, [{
		key: 'getButton',
		value: function getButton() {
			var button = document.getElementById(this.button);
			return button;
		}
	}, {
		key: 'findCoordinatesPointFirst',
		value: function findCoordinatesPointFirst(_pointFirst) {

			var posX = globalPoints[_pointFirst].getAttribute('data-x');
			var posY = globalPoints[_pointFirst].getAttribute('data-y');

			return {
				positionX: posX,
				positionY: posY
			};
		}
	}, {
		key: 'findCoordinatesPointSecond',
		value: function findCoordinatesPointSecond(_secondPoint) {

			var posX = globalPoints[_secondPoint].getAttribute('data-x');
			var posY = globalPoints[_secondPoint].getAttribute('data-y');

			return {
				positionX: posX,
				positionY: posY
			};
		}
	}, {
		key: 'maxDistance',
		value: function maxDistance(arrayDistances) {
			var maxDistance = Math.max.apply(null, arrayDistances);
			return maxDistance;
		}
	}, {
		key: 'distanceToPoint',
		value: function distanceToPoint(firstPoint, secondPoint) {
			//console.log( firstPoint + ' -> ' + secondPoint );


			// 1 step find x and y


			var coordinatesFirstPoint = this.findCoordinatesPointFirst(firstPoint);
			var coordinatesSecondPoint = this.findCoordinatesPointSecond(secondPoint);

			// console.log(coordinatesFirstPoint);
			// console.log(coordinatesSecondPoint);


			// 2 step
			// count distance

			// difference X
			var xFirstPoint = coordinatesFirstPoint.positionX;
			var xSecondPoint = coordinatesSecondPoint.positionX;

			// find cathetus 1
			var differenceX = 0;
			if (xFirstPoint > xSecondPoint) {
				differenceX = xSecondPoint - xFirstPoint;
			} else {
				differenceX = xFirstPoint - xSecondPoint;
			}

			var cathetus1 = Math.pow(differenceX, 2);
			// ______________________________________________

			// difference Y
			var yFirstPoint = coordinatesFirstPoint.positionY;
			var ySecondPoint = coordinatesSecondPoint.positionY;

			// find cathetus 2
			var differenceY = 0;
			if (yFirstPoint > ySecondPoint) {
				differenceY = ySecondPoint - yFirstPoint;
			} else {
				differenceY = yFirstPoint - ySecondPoint;
			}

			var cathetus2 = Math.pow(differenceY, 2);

			console.log(differenceY + ' ' + differenceX);

			// distance to point
			var dToPoint = cathetus1 + cathetus2;
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
	}, {
		key: 'dataNumberElement',
		value: function dataNumberElement() {
			var _index = globalPointsChecked.length - 1;
			var _number = globalPointsChecked[_index];

			return _number;
		}
	}, {
		key: 'distanceToNeighboringPoint',
		value: function distanceToNeighboringPoint() {

			// от данной точки идет измерение длины к следующим
			if (globalStep === globalPoints.length) {
				globalStep = globalPoints.length;
				globalLopKey = false;
			} else {

				// Calculate distance to points
				for (var i = 0; i < globalPoints.length; i++) {

					if (globalPointsChecked.indexOf(i) !== -1) {
						continue;
					} else {
						this.distanceToPoint(this.dataNumberElement(), i);
					}
					// globalPointsChecked.push(i);

				}

				// next step
				globalStep++;
			}
		}
	}]);

	return CalculateRoute;
}();

// ----------------------------------

var newPoint = new CreatePoint('map');

var arrPoint = new CalculateRoute('count');

// set points
newPoint.getField().onclick = function (event) {
	newPoint.createPoint(event);
};

// count points
var loop = '';
arrPoint.getButton().onclick = function () {
	loop = setInterval(countPointsInterval, 1000);
};

function countPointsInterval() {

	arrPoint.distanceToNeighboringPoint();

	if (globalLopKey === false) {
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