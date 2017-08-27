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
			el.setAttribute('id', 'point_' + countPoints);
			el.setAttribute('data-x', posX);
			el.setAttribute('data-y', posY);

			this.getField().appendChild(el);

			// push to array
			globalPoints.push(el);
		}
	}]);

	return CreatePoint;
}();

var ShowInfo = function () {
	function ShowInfo(idElement, orderNumber, distance) {
		_classCallCheck(this, ShowInfo);

		this.idElement = idElement;
		this.orderNumber = orderNumber;
		this.distance = distance;
	}

	_createClass(ShowInfo, [{
		key: 'createInfo',
		value: function createInfo() {
			// find point
			var point = document.getElementById(this.idElement);

			// add counter
			var counter = document.createElement('div');
			counter.className = 'mx_order_number';

			var _span = document.createElement('span');
			_span.innerHTML = this.orderNumber;

			counter.appendChild(_span);

			point.appendChild(counter);

			// add distance
			var distanceToPoint = document.createElement('div');
			distanceToPoint.className = 'mx-distance';

			if (this.idElement !== 'point_0') {
				distanceToPoint.innerHTML = 'D: ' + (this.orderNumber - 1) + ' -> ' + this.orderNumber + ' = ' + this.distance + 'px';
			}

			point.appendChild(distanceToPoint);
		}
	}]);

	return ShowInfo;
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
		key: 'minDistance',
		value: function minDistance() {

			var arrayDistances = [];
			var _arr = globalCountPointsTMP.map(function (el) {
				arrayDistances.push(el[1]);
			});

			var minDistance = Math.min.apply(null, arrayDistances);

			return minDistance;
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


			// count distance

			// difference X
			var xFirstPoint = coordinatesFirstPoint.positionX;
			var xSecondPoint = coordinatesSecondPoint.positionX;

			// find cathetus 1
			var differenceX = xSecondPoint - xFirstPoint;
			differenceX = Math.abs(differenceX);

			var cathetus1 = Math.pow(differenceX, 2);

			// difference Y
			var yFirstPoint = coordinatesFirstPoint.positionY;
			var ySecondPoint = coordinatesSecondPoint.positionY;

			// find cathetus 2
			var differenceY = ySecondPoint - yFirstPoint;
			differenceY = Math.abs(differenceY);

			var cathetus2 = Math.pow(differenceY, 2);

			// console.log(differenceX);

			// distance to point
			var dToPoint = cathetus1 + cathetus2;
			dToPoint = Math.sqrt(dToPoint);
			dToPoint = parseInt(dToPoint);

			// push to array
			globalCountPointsTMP.push([secondPoint, dToPoint]);
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
			if (globalStep === globalPoints.length - 1) {
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
				}

				// Min distance
				var minDistance = this.minDistance();
				//console.log(minDistance+'--------------');

				// find in array point globalCountPointsTMP
				var numEl = 0;
				var _arr = globalCountPointsTMP.map(function (el) {

					if (el[1] === minDistance) {
						globalPointsChecked.push(el[0]);
						numEl = el[0];
					}
				});

				// cleat tmp array
				globalCountPointsTMP = [];

				//console.log(globalPointsChecked);

				// next step
				globalStep++;

				// show info
				var showInfo = new ShowInfo('point_' + numEl, globalStep, minDistance);
				showInfo.createInfo();
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

	// show info
	var showInfo = new ShowInfo('point_0', 0, 0);
	showInfo.createInfo();

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

// 	if(el[1] === 234){
// 		console.log(el[0]);	
// 	}

// });