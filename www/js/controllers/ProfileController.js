/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('BuyAndSellam.controllers')
    .controller('ProfileController', function($scope,$stateParams, $http,$timeout,UtilisateursService,Globals,$ionicLoading,ArticlesService,$localStorage) {


        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Motion
        $timeout(function() {
            ionic.material.motion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function() {
            ionic.material.motion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionic.material.ink.displayEffect();

        //On recupere l'id du user passez dans l'URL
        var utilisateur=$stateParams.utilisateur;
        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminPhoto=Globals.cheminPhoto;
        $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
        if($scope.infoUserLogged.id==utilisateur)
        {
            $scope.showEdit=true;
        }

        $ionicLoading.show({
            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
        })
        UtilisateursService.getUtilisateurById(utilisateur).then(function(response){
            $scope.utilisateur=response.utilisateur;

            //alert(response.utilisateur.id);
            ArticlesService.getArticlesByUser(response.utilisateur.id).then(function(result){
               // alert(JSON.stringify(result.articles));

                $scope.articles=result.articles;
                ArticlesService.getArticleVenduByUser(response.utilisateur.id).then(function(articles){
                    $ionicLoading.hide();
                    $scope.articlesvendu=articles;
                })
            })

        })

        $timeout(function() {
            $ionicLoading.hide();
            // $state.go('app.erreurchargement');
        }, 10000);


    });