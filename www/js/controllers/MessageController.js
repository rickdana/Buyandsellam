/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('BuyAndSellam.controllers')
    .controller('MessageController', function($scope,$stateParams, $timeout) {

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.$parent.setHeaderFab('left');

        // Set Motion
        ionic.material.motion.fadeSlideInRight();

        // Set Ink
        ionic.material.ink.displayEffect();
});
