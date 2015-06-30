/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('BuyAndSellam.controllers')
    .controller('UtilisateurController', function($scope,$stateParams,$ionicLoading,$location, $timeout,UtilisateursService,$rootScope,$mdDialog,$http,$cordovaDevice,$ionicPopup,$ionicPlatform,$mdToast,$localStorage,$cordovaOauth,$ionicHistory,Globals,$state,Messages) {
        $scope.$parent.showHeader();

        $scope.$parent.clearFabs();

        ionic.material.ink.displayEffect();


        $scope.doLogin=function(credentials)
        {
            $scope.$parent.showHeader();

            var credentials = {
                email: credentials.email,
                password: credentials.motdepasse
            };
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            })
            UtilisateursService.signin(credentials).then(function(response) {
                if (response.success == false) {

                    $ionicLoading.hide();
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">' + Messages.authenticationFailed + '</md-toast>',
                        hideDelay: 20000,
                        position: 'bottom right left'
                    });
                } else {
                    //To remove back button on header

                    $scope.logged=$localStorage['logged'];
                    $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                    $ionicHistory.nextViewOptions({
                        disableAnimate:true,
                        disableBack: true
                    });
                    $state.transitionTo('app.articles', $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                    //$state.go('app.articles',{inherit:true},{reload:true});
                    $ionicLoading.hide();

                }
            }, function(error) {
                $rootScope.logged=false;
            })

            $timeout(function() {
                $ionicLoading.hide();
                // $state.go('app.erreurchargement');
            }, 7000);
        };

        $scope.doInscription=function(utilisateur)
        {
           /* alert("doInscription");
            var onSuccess = function(position) {
                alert("onSuccess");
                alert($cordovaDevice.getPlatform() + " "+$cordovaDevice.getVersion());
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=AIzaSyAkU6bg0esJBmaMui6d2sp1NrzZUOjsSLY")
                .success(function(response){*/
            var succ=function(data)
            {
                var formData = {
                    email: utilisateur.email,
                    password: utilisateur.motdepasse,
                    nom:utilisateur.nom,
                    prenom:utilisateur.prenom,
                    dateDeNaissance:utilisateur.datenaissance,
                    telephone:data['lineNumber'],
                    /* nomville:response.results[0].address_components[2].short_name,
                     nompays:response.results[0].address_components[5].long_name,*/
                    device:  $cordovaDevice.getDevice().manufacturer+" "+$cordovaDevice.getModel(),
                    os: $cordovaDevice.getPlatform() + " "+$cordovaDevice.getVersion()
                };
                UtilisateursService.signup(formData).then(function(res) {
                    if (res.success) {
                        $scope.logged= window.localStorage.getItem("logged");
                        $scope.userLogged=window.localStorage.getItem(Globals.USER_LOGGED);
                        $state.go('app.articles');
                        $mdToast.show({
                            template: '<md-toast class="md-toast success">' + Messages.welcome + '</md-toast>',
                            hideDelay: 10000,
                            position: 'bottom right left'
                        });

                    } else {
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">' + Messages.inscriptionFailed + '</md-toast>',
                            hideDelay: 20000,
                            position: 'bottom right left'
                        });
                    }
                }, function(err) {
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">' + Messages.inscriptionFailed + '</md-toast>',
                        hideDelay: 20000,
                        position: 'bottom right left'
                    });
                });

            };
            var err=function()
            {
                console.log("erreur lors dela recuperation du numéro de téléphone");

            }

            window.plugins.carrier.getCarrierInfo(succ, err);

            /*  })
              .error(function(error){
                  alert(error);
              })

          }*/
            /*function onError(error) {
                alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
            }
            var options = {maximumAge: 0, timeout: 100000,enableHighAccuracy:true};
            navigator.geolocation.getCurrentPosition(onSuccess, onError,options);*/

        }




        $scope.loggedWithFacebook=function()
        {
            $cordovaOauth.facebook("CLIENT_ID_HERE", ["email"]).then(function(result) {
                // results
            }, function(error) {
                // error
            });
        }

        $scope.loggedWithGoogle=function()
        {
            alert('log with google');
            $cordovaOauth.google(Globals.GOOGLECLIENTID, ["profile","email"]).then(function(result) {
                alert(JSON.stringify(result));
            }, function(error) {
                alert(error);
            });
        }

        if($state.name==='app.logout')
        {

            UtilisateursService.doLogout().then(function(res){
                if(res)
                {
                    $state.transitionTo('app.articles', $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });
                    $mdToast.show({
                        template: '<md-toast class="md-toast success">' + Messages.deconnexion + '</md-toast>',
                        hideDelay: 50000,
                        position: 'bottom right left'
                    });
                }
            });

        }

       /* $scope.motdepasseoublie=function(ev)
        {*/
        $scope.showPopup = function() {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'motdepasseoublie.html',
                title: 'Mot de passe oublié',
                subTitle: 'Saisir votre adresse email',
                scope: $scope

            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });
                myPopup.close();
        };
            /*$mdDialog.show({
                targetEvent:ev,
                controller:PasswordController,
                templateUrl: 'motdepasseoublie.html',
                scope: $scope
            })
            .then(function() {
                alert($scope.email);
                $mdDialog.cancel();
            });*/
       // }
        function PasswordController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.recuperermotdepasse = function() {
                $mdDialog.hide(email);
            };
        }

        $scope.recuperermotdepasse=function()
        {

        }

        $scope.close=function()
        {
            $mdDialog.hide();
        }
    });