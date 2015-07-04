/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('BuyAndSellam.controllers')
    .controller('ProfileController', function($scope,$stateParams,$state,$http,$timeout,UtilisateursService,Globals,$ionicLoading,$ionicPlatform,Messages, $mdDialog,ArticlesService,$localStorage) {


        // Set Header
        //$scope.$parent.showHeader();
       // $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        var user={};

        /* $scope.$parent.setExpanded(false);
         $scope.$parent.setHeaderFab(false);*/

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

        if($state.current.name=='app.profile')
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            })
            UtilisateursService.getUtilisateurById(utilisateur).then(function(response){
                $scope.utilisateur=response.utilisateur;

                ArticlesService.getArticlesByUser(response.utilisateur.id).then(function(result){
                    // alert(JSON.stringify(result.articles));

                    $scope.articles=result.articles;
                    ArticlesService.getArticleVenduByUser(response.utilisateur.id).then(function(result){
                        $ionicLoading.hide();
                        $scope.articlesvendu=result.articles;
                    })
                })

            });

            $timeout(function() {
                $ionicLoading.hide();
                // $state.go('app.erreurchargement');
            }, 10000);
        }


        //Modification du prolfil
        //On test si le $state correspond à celui de l'édition du profil
        if($state.current.name=='app.editProfile')
        {
            //Si oui on lieu de faire une nouvelle requete en base on recupère directement les informations depuis le localstorage
            user.id=$scope.infoUserLogged.id;
            user.nom=$scope.infoUserLogged.nom;
            user.prenom=$scope.infoUserLogged.prenom;
            user.datedenaissance=$scope.infoUserLogged.dateDeNaissance;
            user.sexe=$scope.infoUserLogged.sexe;
            $scope.user=user;

            $scope.editUser=function(user)
            {
                $ionicLoading.show({
                    template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
                })
                UtilisateursService.editUtilisateur(user).then(function(response) {


                    $localStorage[Globals.USER_LOGGED].nom=response.utilisateur.nom;
                    $localStorage[Globals.USER_LOGGED].prenom=response.utilisateur.prenom;
                    $localStorage[Globals.USER_LOGGED].dateDeNaissance=response.utilisateur.dateDeNaissance;
                    $localStorage[Globals.USER_LOGGED].sexe=response.utilisateur.sexe;
                    $localStorage[Globals.USER_LOGGED].photo=response.utilisateur.photo;
                    $scope.infoUserLogged.nom=response.utilisateur.nom;
                    $scope.infoUserLogged.prenom=response.utilisateur.prenom;
                    $scope.infoUserLogged.dateDeNaissance=response.utilisateur.dateDeNaissance;
                    $scope.infoUserLogged.sexe=response.utilisateur.sexe;
                    $scope.infoUserLogged.photo=response.utilisateur.photo;
                    $scope.infoUserLogged.id=response.utilisateur.id;

                    $scope.$apply();
                    $ionicLoading.hide();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title(Messages.miseAjoutProfilTitre)
                            .content(Messages.misAJourProfilSuccess)
                            .ok('Ok')
                    );

                })

            };
            $scope.editPhoto=function(key,event)
            {
                $mdDialog.show({
                    controller: PhotoController,
                    templateUrl: 'editPhoto.html',
                    parent:angular.element(document.body),
                    targetEvent:event
                })
                    .then(function(answer) {

                        if(answer=='photo')
                        {
                            var cameraOptions = {
                                quality: 50,
                                destinationType: Camera.DestinationType.NATIVE_URI,
                                sourceType : Camera.PictureSourceType.CAMERA,
                                encodingType: Camera.EncodingType.PNG,
                                targetWidth: 80,
                                targetHeight: 80,
                                popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false
                            };
                            var success = function(data){

                                $mdDialog.hide();
                                if(key==null)
                                {
                                    compteurImage =compteurImage+1;
                                    $scope.$apply(function () {
                                        $scope.imgURI.push(data);

                                    });
                                    $scope.nombreImage=compteurImage;
                                }
                                else
                                {
                                    $scope.$apply(function () {
                                        $scope.imgURI[key]=data;

                                    });
                                }
                                $rootScope.image=$scope.imgURI;

                            };
                            var failure = function(message){
                                alert('Failed because: ' + message);
                            };
                            //call the cordova camera plugin to open the device's camera
                            navigator.camera.getPicture( success , failure , cameraOptions );

                        }else
                        {
                            var cameraOptions = {
                                quality: 100,
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                                encodingType: Camera.EncodingType.PNG,
                                targetWidth: 80,
                                targetHeight: 80,
                                // popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false
                            };
                            var success = function(data){
                                if(key==null)
                                {
                                    compteurImage =compteurImage+1;
                                    $scope.$apply(function () {
                                        $scope.imgURI.push(data);

                                    });
                                    $scope.nombreImage=compteurImage;
                                }
                                else
                                {

                                    $scope.$apply(function () {
                                        $scope.imgURI[key]=data;

                                    });
                                }
                                $rootScope.image=$scope.imgURI;


                            };
                            var failure = function(message){
                                $mdDialog.hide();
                                alert('Failed because: ' + message);
                            };
                            //call the cordova camera plugin to open the device's camera
                            navigator.camera.getPicture( success , failure , cameraOptions );

                        }
                    });
            };

            function PhotoController($scope,$mdDialog) {
                $ionicPlatform.on('backbutton', function() {
                    $mdDialog.hide();
                });

                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.closeDialog = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };

            };


        }




    });