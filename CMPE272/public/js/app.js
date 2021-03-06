var cmpe = angular.module('cmpe', ['ui.router', 'uiGmapgoogle-maps', 'ui.bootstrap']);

cmpe.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('root',{
			url: '',
			abstract: true,
			views: {
				'header': {
					templateUrl: 'views/header.html',
					controller: 'headerCtrl'
				}
			}
		})
		.state('root.base', {
			url: '/',
			views: {
				'container@': {
					templateUrl: 'views/base.html',
					controller: 'baseCtrl'
				}
			}
		})
		.state('root.base.search', {
			url: 'search/:lat/:lng/:universityName',
			templateUrl : 'views/search.html',
			controller : 'searchCtrl'
		})
		.state('root.base.apartment', {
			url: 'apartment/:placeID/:uniLat/:uniLong',
			templateUrl : 'views/apartment.html',
			controller : 'apartmentCtrl'
		})
		.state('root.base.team', {
			url: 'aboutus',
			templateUrl : 'views/team.html'
		});
	
});