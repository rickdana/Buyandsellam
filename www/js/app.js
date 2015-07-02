// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('BuyAndSellam', ['ionic','BuyAndSellam.controllers','BuyAndSellam.services','BuyAndSellam.constants'])
.run(function($ionicPlatform,Messages,$rootScope,$cordovaStatusbar, $state,UtilisateursService,Globals,$localStorage,$mdDialog,$mdToast) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required

      //StatusBar.styleDefault();
      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.styleHex('#c62828')

    }

      /*Verifie si le device est offline*/
    document.addEventListener("offline", onOffline, false);

     /* function onOnline() {*/
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
              if (toState.requiresLogin && typeof $localStorage["logged"] == "undefined") {
                  // no logged user, we should be going to #login
                  event.preventDefault();

                  $state.go('app.login');
              }
              if (typeof $localStorage["logged"] != "undefined" && toState.name == 'app.login') {
                  $state.go('app.articles');
              }
          });
      //}
      function onOffline() {
          /*$mdToast.show({
              template: '<md-toast class="md-toast error">' + "Vous n\'êtes pas connecté à internet. Resssayer"+ '</md-toast>',
              hideDelay: 100000,
              position: 'bottom right left'
          });*/
          $mdDialog.show(
              $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .title(Messages.internetErrorTitle)
                  .content(Messages.internetErrorContent)
                  .ok('Ok')
          );
      }

  });
})

.config(function($stateProvider, $urlRouterProvider,$mdGestureProvider) {
  $mdGestureProvider.skipClickHijack();

  $stateProvider

  .state('app', {
    cache: false,
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
    requiresLogin:false
  })
  .state('app.aide', {
      url: "/aide",
      views: {
          'menuContent': {
              templateUrl: "templates/aide.html",
              controller:'AideController'
          }
      },
      requiresLogin:false
  })
  .state('app.conditionutilisation', {
      url: "/conditionutilisation",
      views: {
          'menuContent': {
              templateUrl: "templates/conditionutilisation.html",
              controller:'CguController'
          }
      },
      requiresLogin:false
  }).state('app.politiqueconfidentialite', {
      url: "/politiqueconfidentialite",
      views: {
          'menuContent': {
              templateUrl: "templates/politiqueconfidentialite.html",
              controller:'PolitiqueConfidentialiteController'
          }
      },
     requiresLogin:false
  })
  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html",
        controller:'UtilisateurController'
      }
    }
  }).state('app.logout', {
          url: "/logout",
          controller:'UtilisateurController'
  })
      .state('app.profile',{
          url:"/profile/:utilisateur",
          views:{
              'menuContent':{
                  templateUrl:"templates/profile.html",
                  controller:'ProfileController'
              }
          },
          requiresLogin:false
      })
      .state('app.editProfile',{
          url:"/editprofile/:utilisateur",
          views:{
              'menuContent':{
                  templateUrl:"templates/editerProfil.html",
                  controller:'ProfileController'
              }
          },
          requiresLogin:true
      })
    .state('app.articles', {
      cache:false,
      url: "/articles",
      views: {
        'menuContent': {
          templateUrl: "templates/articles.html",
          controller: 'ArticlesController'
        }
      },
          requiresLogin:false
    }).state('app.addarticle', {
          cache:false,
          url: "/addarticle",
          views: {
              'menuContent': {
                  templateUrl: "templates/addArticle.html",
                  controller: 'ArticlesController'
              }
          },
          requiresLogin:true
      }).state('app.filtres', {
          url: "/filtres",
          views: {
              'menuContent': {
                  templateUrl: "templates/filtres.html",
                  controller: 'ArticlesController'
              }
          },
          requiresLogin:false

      }).state('app.categories', {
          url: "/categories",
          views: {
              'menuContent': {
                  templateUrl: "templates/categories.html",
                  controller: 'CategoriesController'
              }
          },
          requiresLogin:false
      }).state('app.collections', {
          url: "/collections",
          views: {
              'menuContent': {
                  templateUrl: "templates/collections.html",
                  controller: 'CollectionsController'
              }
          },
          requiresLogin:false
      }).state('app.messages', {
          url: "/messages",
          views: {
              'menuContent': {
                  templateUrl: "templates/messages.html",
                  controller: 'MessageController'
              }
          },
          requiresLogin:true
      })
      .state('app.articlebycat', {
          url: "/categories/:categorie/:libelle",
          views: {
              'menuContent': {
                  templateUrl: "templates/categorieDetails.html",
                  controller: 'CategorieDetailsController'
              }
          }
      })
      .state('app.articledetails',{
          url:"/article/:article",
          views:{
              'menuContent':{
                  templateUrl:"templates/articleDetails.html",
                  controller:'ArticleDetailsController'
              }
          }
      })
  .state('app.friends', {
      url: "/inviteFriends",
      views: {
          'menuContent': {
              templateUrl: "templates/inviteFriends.html",
              controller: 'InviteFriendsController'
          }
      },
      authenticate:false
  }).state('app.erreurchargement', {
          url:'/erreurchargement',
          views:{
              'menuContent':{
                  templateUrl:"templates/erreurChargement.html",
                  controller:'ArticleController'
              }
          }
      });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/articles');
});
