/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('BuyAndSellam.controllers')
    .controller('ArticleDetailsController', function($scope,$stateParams,$state,$mdDialog, $ionicPlatform,$http,$timeout,ArticlesService,Globals,$ionicLoading,$cordovaSocialSharing) {

        // Delay expansion
       /* $timeout(function() {
            $scope.isExpanded = true;
        }, 300);

        // Set Motion
        ionic.material.motion.fadeSlideInRight();

        // Set Ink
        ionic.material.ink.displayEffect();
        /*On recupère la categorie envoyé en paramètre*/
       /* var categorie=$stateParams.categorie;
        $scope.libellecategorie=$stateParams.libelle

        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminImage=Globals.cheminImage+'/';
        ArticlesService.getArticleByCategorie(categorie).then(function(){
            $scope.articles=ArticlesService.getArticlesByCategorie();
        })*/

        /*get Id article from url*/
        var article=$stateParams.article;
        var logged=true;
        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminImage=Globals.cheminImage;
        $scope.cheminPhoto=Globals.cheminPhoto;


        $ionicLoading.show({
            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
        })
        ArticlesService.getArticleById(article).then(function (article) {

            $ionicLoading.hide();

            $scope.article = article;

            var imageF="";
            var articleTitre="";
            var articleDetails="";

            angular.forEach(article,function(art){
                articleTitre=art.titre;
                articleDetails=art.details;
                imageF=art.images[0].cheminImage;

            })


            /*Social Sharing*/
            var message=articleTitre +" sur BuyAndSellam <br/><i>Regardez ce que je viens de trouver sur BuyAndSellam</i>";
            var messageT=articleTitre +" sur BuyAndSellam  Regardez ce que je viens de trouver sur BuyAndSellam";
            var image= "<img src='"+$scope.cheminImage +imageF+"'/>" ;
            var link="";
            var number="";
            var toArr="";
            var ccArr="";
            var bccArr="";
            var file="";
            var subject="";

            $scope.shareTwitter=function()
            {
                /*$cordovaSocialSharing
                    .shareViaTwitter(message, image, link)
                    .then(function(result) {
                        // Success!
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });*/
                window.plugins.socialsharing.shareViaTwitter(messageT,  $scope.url+$scope.cheminImage +imageF /* img */, 'http://www.x-services.nl', function()
                {console.log('share ok')}, function(errormsg){console.log(errormsg)})
            }


            $scope.shareMail=function()
            {
                var messageMail="Ce produit pourrait t\'interesser : "+articleTitre+"<br/><br/>"+articleDetails;
                var subjectMail=articleTitre +" sur BuyAndSellam";
                $cordovaSocialSharing
                    .shareViaEmail(messageMail, subjectMail, toArr, ccArr, bccArr, file)
                    .then(function(result) {
                        // Success!
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });
            }

            $scope.shareWhatsapp=function()
            {
                /*$cordovaSocialSharing
                    .shareViaWhatsApp(message, image, link)
                    .then(function(result) {
                        // Success!
                    }, function(err) {
                        // An error occurred. Show a message to the user
                        alert(err);
                    });*/
                window.plugins.socialsharing.shareViaWhatsApp(message,  $scope.url+$scope.cheminImage +imageF /* img */, null /* url */, function()
                {console.log('share ok')}, function(errormsg){console.log(errormsg)})

            }

            $scope.shareFacebook=function()
            {

                window.plugins.socialsharing.shareViaFacebook(message,  $scope.url+$scope.cheminImage +imageF /* img */, null /* url */, function(){
                    console.log('share ok')}, function(errormsg){alert(errormsg)});
                /*$cordovaSocialSharing
                    .shareViaFacebook(message +" "+image, image, link)
                    .then(function(result) {
                        // Success!
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });*/
            }

            $scope.shareSMS=function()
            {
                /*$cordovaSocialSharing
                    .shareViaSMS(message, number)
                    .then(function(result) {
                        // Success!
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });*/
                window.plugins.socialsharing.shareViaSMS(message, null /* see the note below */, function(msg)
                {console.log('ok: ' + msg)}, function(msg) {console.log('error: ' + msg)})
            };

            $scope.contrOffre=function(ev)
            {
                if(logged)
                {
                    $mdDialog.show({
                        templateUrl: 'contreOffre.html',
                        scope: $scope,
                        targetEvent: ev
                    })
                        .then(function() {
                            $ionicPlatform.on('backbutton', function() {
                                $mdDialog.hide();
                            });

                        });
                }
                else
                {
                    $state.go("app.login");
                }

            }

            $scope.jachete=function(ev)
            {
                if(logged)
                {
                    $mdDialog.show({
                        templateUrl: 'jachete.html',
                        scope: $scope,
                        targetEvent: ev
                    })
                        .then(function() {
                            $ionicPlatform.on('backbutton', function() {
                                $mdDialog.cancel();
                            });
                            $mdDialog.cancel();

                        });
                }
                else
                {
                    $state.go("app.login");
                }
            }

            $scope.chat=function(ev)
            {
                if(logged)
                {

                }
                else
                {
                    $state.go("app.login");
                }
            }

            $scope.close=function()
            {
                $mdDialog.cancel();
            }



        });
        $timeout(function() {
            $ionicLoading.hide();
            // $state.go('app.erreurchargement');
        }, 10000);









    })
