/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('BuyAndSellam.controllers')
    .controller('ArticlesController', function($scope,$rootScope,$stateParams,$filter, $state,$http,$timeout,$mdToast,$ionicPopup,$cordovaDevice,$cordovaFileTransfer,$localStorage, $ionicLoading,$ionicPlatform, $mdDialog, ArticlesService,Globals,Messages,$location) {


    var compteurImage=0;
    $scope.imgURI=[];
    $rootScope.image=[];
    $scope.nombreImage=0;
    $scope.$state=$state;
    $scope.url=Globals.urlServer+Globals.port+'/';
    $scope.cheminImage=Globals.cheminImage;
    var data=[];


    // Activate ink for controller
    ionic.material.ink.displayEffect();

    ionic.material.motion.pushDown({
        selector: '.push-down'
    });
    ionic.material.motion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });



    $scope.$parent.showHeader();

    /*Pull to refresh*/
    $scope.doRefresh = function() {
        ArticlesService.getAllArticles().then(function (response) {
            $scope.articles=[];
            $scope.articles=response.articles;
            alert(JSON.stringify($scope.articles));
            $scope.$broadcast('scroll.refreshComplete');
        });

    };
    $ionicLoading.show({
        template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
    })
    ArticlesService.getAllArticles().then(function (response) {
        $ionicLoading.hide();
        $scope.articles=response.articles;

        //filter and order
        var orderBy = $filter('orderBy');

    $scope.order = function(predicate, reverse) {
        $scope.articles = orderBy($scope.articles , predicate, reverse);
    };
        console.log(JSON.stringify($scope.articles));
        /* $scope.articles=response.articles;
         $scope.nombreArticles=response.nombreArticles;*/
    });

    $timeout(function() {
        $ionicLoading.hide();
        // $state.go('app.erreurchargement');
    }, 5000);
    //$state.transitionTo($state.current, $state.$current.params, { reload: false, inherit: true, notify: true });

    $scope.search=function(param)
    {
        alert(JSON.stringify(param));
    }


    /*$scope.loadCategorie=function()
    {
        alert("loadCategorie");
        return $timeout(function() {
            ArticlesService.getAllCategories().then(function () {
                $scope.categories=ArticlesService.getCategories();
                alert(JSON.stringify($scope.categories));

            });
        }, 650);
    }*/


    $scope.popover = function() {
        $scope.$parent.popover.show();
        $timeout(function () {
            $scope.$parent.popover.hide();
        }, 2000);
    };


    //Traitement ajout article
    if($state.current.name == 'app.addarticle')
    {
        ArticlesService.getDevise().then(function (response) {
            $scope.devises=response.devises;
        });
        ArticlesService.getAllCategories().then(function () {
            $scope.categories=ArticlesService.getCategories();
        });

        $scope.addArticle=function(article)
        {
            /*$mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content("<md-progress-circular class=\"md-warn md-hue-3\"  md-mode=\"indeterminate\"></md-progress-circular>"+Messages.ajoutDuProduitEnCours)
            );*/

            // article.img=$rootScope.image;
             article.utilisateur=$localStorage[Globals.USER_LOGGED].id;
             alert("Article "+JSON.stringify(article));
            $ionicLoading.show({
                template: '<md-progress-circular  md-mode="indeterminate"></md-progress-circular> '+Messages.ajoutDuProduitEnCours
            })
            $http.get(Globals.URL_JSON_IP).success(function(dataIP){
               //On recupère la position à partir de laquelle est ajouté l'article
                alert("dataIP "+JSON.stringify(dataIP));
                article.latitude=dataIP.lat;
                article.longitude=dataIP.lon;
                article.nomVille=dataIP.city;
                article.nompays=dataIP.country;
                ArticlesService.addArticle(article).then(function(response){
                    if(response.success==true)
                    {
                        alert("article ajouté==>"+JSON.stringify(response));
                        $scope.idArticle=response.article.idArticle;
                        alert("success true");
                        var keepGoing=true;
                        alert(JSON.stringify($rootScope.image));
                        for (var i = 0; i<$rootScope.image.length;  i++) {

                            if(keepGoing)
                            {

                                /*var options = new FileUploadOptions();
                                var params = new Object();*/
                                params.idArticle=$scope.idArticle;
                                var options = {
                                    fileKey:"file",
                                    fileName: $rootScope.image[i].substr($rootScope.image[i].lastIndexOf('/')+1),
                                    chunkedMode: false,
                                    mimeType: "image/png",
                                    article:$scope.idArticle
                                };
                                alert(Globals.urlServer+Globals.port+"/article/uploadImage");

                                var success=function(result) {
                                    console.log("SUCCESS: " + JSON.stringify(result.response));
                                };
                                 var failed=function() {
                                     ArticlesService.rollBackArticle($scope.idArticle).then(function (success) {
                                         if (success) {
                                             console.log("ERROR: " + JSON.stringify(err));
                                             keepGoing = false;
                                         }

                                     })
                                 };
                                $cordovaFileTransfer.upload($rootScope.image[i],Globals.urlServer+Globals.port+"/article/uploadImage", success,failed,  options);

                                /*var ft = new FileTransfer();
                                ft.upload($rootScope.image[i],Globals.urlServer+Globals.port+"/article/uploadImage",success,fail, options);

                                var fail=function()
                                {
                                    ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                                        if(success)
                                        {
                                            console.log("ERROR: " + JSON.stringify(err));
                                            keepGoing=false;
                                        }

                                    })
                                }
                                var success=function()
                                {
                                    console.info("SUCCESS: " + JSON.stringify(result.response));
                                    if(success!=true)
                                    {
                                        //En cas de success==false on fait un rollback pour supprimer l'article qui as été ajouté ainsi que les eventuelle images inserés
                                        ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                                            if(success)
                                            {
                                                keepGoing=false;
                                            }

                                        })
                                    }
                                }*/
                            }

                        }

                    }
                    else
                    {
                       // $mdDialog.hide();
                        $ionicLoading.hide();
                        erreurAjoutArticle();

                    }

                }).catch(function(response) {
                    //$mdDialog.hide();
                    ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                        if(success)
                        {
                            console.log("ERROR: " + JSON.stringify(err));
                        }

                    });
                    $ionicLoading.hide();
                    alert("dans catch");
                   erreurAjoutArticle();

                    console.error('L\'ajout d\'article a echoué', response.status, response.data);

                })

            }).error(function(err){
                var fail=function()
                {
                    ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                        if(success)
                        {
                            console.log("ERROR: " + JSON.stringify(err));
                            keepGoing=false;
                        }

                    })
                }
                var success=function()
                {
                    console.info("SUCCESS: " + JSON.stringify(result.response));
                    if(success!=true)
                    {
                        //En cas de success==false on fait un rollback pour supprimer l'article qui as été ajouté ainsi que les eventuelle images inserés
                        ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                            if(success)
                            {
                                keepGoing=false;
                            }

                        })
                    }
                }

                //$mdDialog.hide();
                $ionicLoading.hide();
               internetError()

            })
        }

        $scope.addImage=function(key,event)
        {
            $mdDialog.show({
                controller: ImageController,
                templateUrl: 'uploadImageChoice.html',
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


        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };
        //Modification ou suppression d'une image
        $scope.onHold=function(key)
        {
            $mdDialog.show({
                controller: ImageController,
                templateUrl: 'editImage.html',
                parent:angular.element(document.body),
                targetEvent:event
            }).then(function(answer) {
                if(answer=='edit')
                {
                    $scope.addImage(key,event);
                }else
                {
                    $rootScope.image;splice(key,1);
                    $scope.imgURI.splice(key, 1);
                    compteurImage--;
                    $scope.nombreImage=compteurImage;
                    $mdDialog.cancel();

                }
            })
        }
        function ImageController($scope,$mdDialog) {
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

        }


    }

    $scope.saveStat=function(article)
    {
        $http.get(Globals.URL_JSON_IP).success(function(dataIP){
            var succ = function (data) {
                var statArticle={};
                statArticle.device = $cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
                statArticle.os = $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
                statArticle.uuid=$cordovaDevice.getUUID();
                statArticle.adresseIp = dataIP.query;
                statArticle.dateVue = new Date();
                statArticle.article = article;
                statArticle.operateur=data['carrierName'];
                statArticle.phoneNumber=data['lineNumber'];
                statArticle.codePays=dataIP['country'];
                ArticlesService.addStatArticle(statArticle).then(function(response){
                    console.log("StatArticle response"+response);
                })

            };
            var err = function () {
                console.log("erreur lors dela recuperation du fai");
            };
            window.plugins.carrier.getCarrierInfo(succ, err);


        }).error(function(err){
            alert("erreur get IP "+err);
        })
       $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
    }

    var internetError=function()
    {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.internetErrorTitle)
                .content(Messages.internetErrorContent)
                .ok('OK')
        );
    }

    var erreurAjoutArticle=function()
    {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.erreurAjoutArticleTitre)
                .content(Messages.erreurAjoutArticle)
                .ok('OK')
        );
    }


});