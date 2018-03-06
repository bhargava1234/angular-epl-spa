var app = angular.module('tutorialWebApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/epl-2015-2016", {templateUrl: "partials/epl-2015-2016.html", controller: "epl1516Ctrl"})
    .when("/epl-2016-2017", {templateUrl: "partials/epl-2016-2017.html", controller: "epl1617Ctrl"})
	.when("/team/:teamcode/:teamkey", {templateUrl: "partials/team.html", controller: "teamCtrl"})
	.when("/matchview/:date/:team1code/vs/:team2code", {templateUrl: "partials/matchview.html", controller: "matchviewCtrl"})
	.when("/allteams", {templateUrl: "partials/allteams.html", controller: ""})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);


app.controller('epl1516Ctrl', function ($scope, $location, $http) {
	
	
	
	$http({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json'
    }).then(function success(response) {
        //console.log(response.data.rounds);
        $scope.allrounds = response.data.rounds;
    }, function error(response) {
        console.log('Error: ' + response.data);
    });
	
 
});


app.controller('epl1617Ctrl', function ($scope, $location, $http) {
	
	
	
	$http({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json'
    }).then(function success(response) {
        //console.log(response.data.rounds);
        $scope.allrounds = response.data.rounds;
    }, function error(response) {
        console.log('Error: ' + response.data);
    });
	
 
});


app.controller('matchviewCtrl', function($scope, $http, $timeout,$q,$routeParams) {
	$q.all([$http({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json'
      }),
      $http({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json'
      })
    ]).then(function(response) {
		 var roundsone = response[0].data.rounds;
		 var roundstwo = response[1].data.rounds;
		 var combinedall=roundsone.concat(roundstwo);
		 for (var i = 0; i < combinedall.length; i++) {
              var matchdata = combinedall[i];
			  for (var j = 0; j < matchdata.matches.length; j++) {
				  
				
                  var matchdate = matchdata.matches[j].date;
                  var matchdate_finale = matchdate.replace(/[^\/\d]/g, '');
				   if (matchdate_finale == $routeParams.date && matchdata.matches[j].team1.code == $routeParams.team1code && matchdata.matches[j].team2.code == $routeParams.team2code) {
					   
					    $scope.roundname=combinedall[i].name;
					    $scope.matchDate  = matchdata.matches[j].date;
                        $scope.t1  = matchdata.matches[j].team1.name;
                        $scope.t2  = matchdata.matches[j].team2.name;
                        $scope.c1  = matchdata.matches[j].team1.code;
                        $scope.c2  = matchdata.matches[j].team2.code;
                        $scope.k1   = matchdata.matches[j].team1.key;
                        $scope.k2   = matchdata.matches[j].team2.key;
                        $scope.s1 = matchdata.matches[j].score1;
                        $scope.s2 = matchdata.matches[j].score2;
						console.log($scope.s1);
						
						if ($scope.s1 > $scope.s2) {
                        $scope.winner = "" + $scope.t1 + " Won";
                    } else if ($scope.s1 < $scope.s2) {
                         $scope.winner = "" + $scope.t2 + " Won";
                    } else {
                        $scope.winner = "Match Drawn";

                    }
					   
				   }
				  
			  }  

		 }	   
		
})
})
app.controller('teamCtrl', function($scope, $http, $timeout,$q,$routeParams) {
 
 //alert($routeParams.teamcode);
    var dataone=[]
	var total_match_played_one=[];
	var team_name_one='';
	var total_goal_one=0;
	var total_wins_one=[];
	var total_tie_one=[];
	var total_lost_one=[];
	
	var datatwo=[];
	var total_match_played_two=[];
	var team_name_two='';
	var total_goal_two= 0;
	var total_wins_two=[];
	var total_tie_two=[];
	var total_lost_two=[];
	
 
    $q.all([$http({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json'
      }),
      $http({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json'
      })
    ]).then(function(response) {
		
		 var roundsone = response[0].data.rounds;
		 var roundstwo = response[1].data.rounds;
		 
		 /// Data Json ----2015-2016---------
		  for (var i = 0; i < roundsone.length; i++) {
			for (var j = 0; j < roundsone[i].matches.length; j++) {
							
					dataone.push(roundsone[i].matches[j]);
						
				}
		   }
			
		  for (var i = 0; i < dataone.length; i++) {
				  
				if ((dataone[i].team1.code === $routeParams.teamcode || dataone[i].team2.code === $routeParams.teamcode) && (dataone[i].team1.key === $routeParams.teamkey || dataone[i].team2.key === $routeParams.teamkey)) 
				{
                    total_match_played_one.push(dataone[i].team1.name);
                    
                   if (dataone[i].team1.code === $routeParams.teamcode && dataone[i].team1.key === $routeParams.teamkey) {
                            
					 team_name_one1 = dataone[i].team1.name;
					 total_goal_one =total_goal_one + dataone[i].score1;
					 
                      if (dataone[i].score1 > dataone[i].score2) {
                               
                                total_wins_one.push(dataone[i].team2.code);

                            } else if (dataone[i].score1 < dataone[i].score2) {
                                
                               total_lost_one.push(dataone[i].team1.code);


                            } else if (dataone[i].score1 == dataone[i].score2) {

                               
                                total_tie_one.push(dataone[i].team1.code);


                            } else {
                                console.log("off");
                            } 

					  
							
				   }
				   
				      if (dataone[i].team2.code === $routeParams.teamcode && dataone[i].team2.key === $routeParams.teamkey) {
                            
                           total_goal_one = total_goal_one + dataone[i].score2;
                            

                            if (dataone[i].score1 < dataone[i].score2) {
                                
                               total_wins_one.push(dataone[i].team2.code);

                            } else if (dataone[i].score1 > dataone[i].score2) {
                               
                               total_lost_one.push(dataone[i].team1.code);


                            } else if (dataone[i].score1 == dataone[i].score2) {

                               
                                total_tie_one.push(dataone[i].team1.code);


                            } else {
                                console.log("ssas");
                            }
                        }
				   

				}				
		
		
		   }
		   
		   //-------------Data json 2016-2017--------------
		    for (var i = 0; i < roundstwo.length; i++) {
			for (var j = 0; j < roundstwo[i].matches.length; j++) {
							
					datatwo.push(roundstwo[i].matches[j]);
						
				}
		   }
			
		  for (var i = 0; i < datatwo.length; i++) {
				  
				if ((datatwo[i].team1.code === $routeParams.teamcode || datatwo[i].team2.code === $routeParams.teamcode) && (datatwo[i].team1.key === $routeParams.teamkey || datatwo[i].team2.key === $routeParams.teamkey)) 
				{
                    total_match_played_two.push(datatwo[i].team1.name);
                    
                   if (datatwo[i].team1.code === $routeParams.teamcode && datatwo[i].team1.key === $routeParams.teamkey) {
                            
					 team_name_two = datatwo[i].team2.name;
					 total_goal_two =total_goal_two + datatwo[i].score1;
					 
                      if (datatwo[i].score1 > datatwo[i].score2) {
                               
                                total_wins_two.push(datatwo[i].team2.code);

                            } else if (datatwo[i].score1 < datatwo[i].score2) {
                                
                               total_lost_two.push(datatwo[i].team1.code);


                            } else if (datatwo[i].score1 == datatwo[i].score2) {

                               
                                total_tie_two.push(datatwo[i].team1.code);


                            } else {
                                console.log("off");
                            } 

					  
							
				   }
				   
				      if (datatwo[i].team2.code === $routeParams.teamcode && datatwo[i].team2.key === $routeParams.teamkey) {
                            
                           total_goal_two = total_goal_two + datatwo[i].score2;
                            

                            if (datatwo[i].score1 < datatwo[i].score2) {
                                
                               total_wins_two.push(datatwo[i].team2.code);

                            } else if (datatwo[i].score1 > datatwo[i].score2) {
                               
                               total_lost_two.push(datatwo[i].team1.code);


                            } else if (datatwo[i].score1 == datatwo[i].score2) {

                               
                                total_tie_two.push(datatwo[i].team1.code);


                            } else {
                                console.log("ssas");
                            }
                        }
				   

				}				
		
		
		   }
		   
		      

		    $scope.total_p1 =total_match_played_one.length;
			$scope.total_p2 =total_match_played_two.length;
			
			$scope.total_w1 =total_wins_one.length;
			$scope.total_w2 =total_wins_two.length;
			
			$scope.total_l1 =total_lost_one.length;
			$scope.total_l2 =total_lost_two.length;
			
			$scope.total_t1 =total_tie_one.length;
			$scope.total_t2 =total_tie_two.length;
			
			$scope.total_g1 =total_goal_one;
			$scope.total_g2 =total_goal_two;
		  
		   $scope.percent_win=(total_wins_one.length*100)/total_match_played_one.length;
		   $scope.percent_lost=(total_lost_one.length*100)/total_match_played_one.length;
		   $scope.percent_tie=(total_tie_one.length*100)/total_match_played_one.length;
		   
		   
		   
		    $scope.percent_win_two=(total_wins_two.length*100)/total_match_played_two.length;
		   $scope.percent_lost_two=(total_lost_two.length*100)/total_match_played_two.length;
		   $scope.percent_tie_two=(total_tie_two.length*100)/total_match_played_two.length;
           //$scope.showGraph = function() {
          $scope.chart =c3.generate({
		     bindto: '#chart',
                    data: {
                        columns: [
                           
                            ["Total Won Matches",  $scope.percent_win],
							["Total Lost Matches",  $scope.percent_lost],
							["Total Tied Matches",  $scope.percent_tie],
							
							
                        ],
                        type: 'pie',
                        colors: {
                          
                            TotalWon: '#0064C9',
							TotalLost: '#0064C9',
							TotalTied: '#0064C9',
							
                        },
                        color: function(color, d) {                             // d will be 'id' when called for legends
                            return d.id && d.id === 'data3' ? d3.rgb(color).darker(d.value / 150) : color;
                        },
                        onmouseover: function(d, i) {
                            console.log("onmouseover", d, i, this);
                        },
                        onmouseout: function(d, i) {
                            console.log("onmouseout", d, i, this);
                        }
                    },
                    axis: {
                        x: {
                            label: 'Sepal.Width'
                        },
                        y: {
                            label: 'Petal.Width'
                        }
                    }
                }); 
				
           $scope.chart_two =c3.generate({
		     bindto: '#chart_two',
                    data: {
                        columns: [
                           
                            ["Total Won Matches",  $scope.percent_win_two],
							["Total Lost Matches",  $scope.percent_lost_two],
							["Total Tied Matches",  $scope.percent_tie_two],
							
							
                        ],
                        type: 'pie',
                        colors: {
                          
                            TotalWon: '#0064C9',
							TotalLost: '#0064C9',
							TotalTied: '#0064C9',
							
                        },
                        color: function(color, d) {                             // d will be 'id' when called for legends
                            return d.id && d.id === 'data3' ? d3.rgb(color).darker(d.value / 150) : color;
                        },
                        onmouseover: function(d, i) {
                            console.log("onmouseover", d, i, this);
                        },
                        onmouseout: function(d, i) {
                            console.log("onmouseout", d, i, this);
                        }
                    },
                    axis: {
                        x: {
                            label: 'Sepal.Width'
                        },
                        y: {
                            label: 'Petal.Width'
                        }
                    }
                });     
    //}
				
    //}
	
	})
 
});





app.controller('PageCtrl', function (/* $scope, $location, $http */) {
 
});



/* app.controller('ContactCtrl', function ( $scope, $location, $http) {
	
	$http({
        method: 'GET',
        url: '/api/contact/fetchAll'
    }).then(function success(response) {
        console.log(response.data);
        $scope.contacts = response.data;
    }, function error(response) {
        console.log('Error: ' + response.data);
    });
	
  $scope.myFunc = function() {
	  
         var contact_name = $scope.formData.contact_name;
        var contact_email = $scope.formData.contact_email;
        var contact_phone = $scope.formData.contact_phone;
		var contact_message = $scope.formData.contact_message;
		
        if (contact_name != null && contact_email != null && contact_name.trim().length != 0 && contact_email.trim().length != 0) {
            $http({
                method: 'POST',
                data: $scope.formData,
                url: '/api/contact/save'
            }).then(function success(response) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.contacts = response.data;
                console.log(response.data);
            }, function error(response) {
                console.log('Error: ' + response.data);
            });
        } else {
            alert("Either UserName or Comment is empty")
        }
         
    };
	
	    
}); */