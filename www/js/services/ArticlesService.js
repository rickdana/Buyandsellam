/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('BuyAndSellam.services',['BuyAndSellam.constants','ngStorage'])
    .service('ArticlesService', function(Globals,$http,$q,$timeout) {
        var url=Globals.urlServer+Globals.port;
        var categorie=null;
        var articles=[];
        var articlesByCategorie=[]
        var articleDetails=[];
        /*On remonte la liste des categories*/
        this.getAllCategories=function()
        {
            var deferred=$q.defer();
            $http.get(url+'/categorie/getAllCategorie').success(function(response){
                if(response)
                {
                    categorie=response.categories;
                    deferred.resolve();
                }
            })
            return deferred.promise;
        }

        this.getAllArticles=function()
        {
            var deferred=$q.defer();
            $http.get(url+'/article/getAllArticle').success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }

            });
            return deferred.promise;
        }

        this.getArticleByCategorie=function(categorie)
        {
            var deferred=$q.defer();
            $http.get(url+'/article/getArticleByCategorie?idcategorie='+categorie).success(function(response){
                if(response)
                {
                    articlesByCategorie=response;
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }

        this.addArticle=function(article)
        {
            alert("Addarticle "+JSON.stringify(article));
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:url+'/article/createArticleP',
                data:article
            }
            $http(req).success(function(response){

                deferred.resolve(response);

            }).error(function(error){
                messageAuthErreur="Une erreur est survenue lors de l'ajout de l'article";
                deferred.reject(error)
            })
            return deferred.promise;

        }

        this.deleteArticle=function(article)
        {
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:baseUrl+'/article/rollBackArticle',
                data:article
            }
            $http(req).success(function(response){

                deferred.resolve(response);

            }).error(function(error){
                deferred.reject(error)
            })
            return deferred.promise;
        }
        this.rollBackArticle=function(article)
        {
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:baseUrl+'/article/rollBackArticle',
                data:article
            }
            $http(req).success(function(response){

                deferred.resolve(response);

            }).error(function(error){
                deferred.reject(error)
            })
            return deferred.promise;
        }

        this.getArticleById=function(article)
        {
            var deferred=$q.defer();
            $http.get(url+'/article/getArticleById?idarticle='+article).success(function(response){
                if(response)
                {
                    deferred.resolve(response)
                }

            });
            return deferred.promise;
        }

        /*getters*/
        this.getCategories=function(){
            return categorie;
        }

        this.getArticles=function(){
            return articles;
        }

        this.getArticlesByCategorie=function(){
            return articlesByCategorie;
        }

        this.getArticlesByUser=function(user)
        {
            var deferred=$q.defer();
            $http.get(url+'/article/getArticlesByUser?iduser='+user).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }

        this.getArticleVenduByUser=function(user)
        {
            var deferred=$q.defer();
            $http.get(url+'/article/getArticlesVenduByUser?iduser='+user).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }

        this.getDevise=function()
        {
            var deferred=$q.defer();
            $http.get(url+'/devise/getActiveDevise').success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }

        this.addStatArticle=function(statArticle)
        {
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:url+'/statArticle/saveStat',
                data:statArticle
            }
            $http(req).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }

});