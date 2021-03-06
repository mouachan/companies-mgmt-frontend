angular
  .module("demo-companies-mgmt", [])
  .controller("call-dmn", function ($scope, $http) {
    $scope.company = { id: "" };
    $scope.notations = {id: ""};
    var calcul_variables_endpoint = ENV.baseUrl + '/calcul_variables';
    var notation_endpoint = ENV.baseUrl + '/Orientation';

    $scope.notation = [];
    var rentab_13;
    var strfin_36;
    var rentab_38;
    $scope.applicationResult = "";
    $scope.applicationResultIcon = "";
    $scope.displayResults = "display: none;";
    //$scope.bilan = { gg: null, ga: 20, hp: 30, hq: 40, fl: 50, fm: 6, hn: 3, gg1: 4, ga1: 16, hp1: 12, hq1: 3, fl1: 2, fm1: 1, fl2: 7, fm2: 5, ga2: 2, hn2: 34, dl: 5, ee: 5 };
    $scope.contrepartie = { siren: "1013B" };


    function _success(response) {
      _refreshPageData();
      _clearForm();
    }

    function _error(response) {
      alert(response.data.message || response.statusText);
    }

    //Clear the form
    function _clearForm() {
      $scope.form.siren = "";
      $scope.form.denomination = "";
    }
    $scope.search = function () {
      var search_endpoint = ENV.companiesSvc + '/companies/search/' + $scope.company.id;
      var search_notation_endpoint = ENV.companiesSvc + '/notation/search/' + $scope.company.id;

      $scope.contrepartie.siren = $scope.company.id;
      $http({
        method: 'GET',
        url: search_endpoint
      }).then(function successCallback(response) {
        $scope.company = response.data;
      }, function errorCallback(response) {
        console.log(response.statusText);
      });

      $http({
        method: 'GET',
        url: search_notation_endpoint
      }).then(function successCallback(response) {
        $scope.notations = response.data;
      }, function errorCallback(response) {
        console.log(response.statusText);
      });
    }
    function createPayloadBilan(bilan){
      var payload ='{"bilan" : {';
      if(bilan.gg != null) payload+="\"gg\":" + bilan.gg;
      if(bilan.ga != null) payload+=",\"ga\":" + bilan.ga;
      if(bilan.hp != null) payload+=",\"hp\":" + bilan.hp;
      if(bilan.hq != null) payload+=",\"hq\":" + bilan.hq;
      if(bilan.hn != null) payload+=",\"hn\":" + bilan.hn;
      if(bilan.fl != null) payload+=",\"fl\":" + bilan.fl;
      if(bilan.fm != null) payload+=",\"fm\":" + bilan.fm;
      if(bilan.dl != null) payload+=",\"dl\":" + bilan.dl;
      if(bilan.ee != null) payload+=",\"ee\":" + bilan.ee;
      payload+='}}';
      return payload;
    }
    function createPayloadNotation(siren,variables){
      var payload = '{"CodeNaf":"' + siren + '","Variables": [';
      if(variables.rentab_13!=null) payload+='{ "valeur":' + variables.rentab_13 + ',"type": "rentab_13"}';
      if(variables.rentab_38!=null) payload+=',{ "valeur":' + variables.rentab_38+ ',"type": "rentab_38"}';
      if(variables.strfin_36!=null) payload+=',{ "valeur":' + variables.strfin_36 + ',"type": "strfin_36"}';
      payload+='],"rules":[]}}';
      return payload;
    }
    //var data = '{"CodeNaf":"' + $scope.contrepartie.siren + '","Variables": [{ "valeur":' + rentab_13 + ',"type": "rentab_13"},{"valeur":' + strfin_36 + ',"type": "strfin_36"}],"rules":[]}}';

    //        '{"bilan" : {"gg":' + $scope.bilan.gg + ',"ga":' + $scope.bilan.ga + ',"hp":' + $scope.bilan.hp + ',"hq":' + $scope.bilan.hq + ',"fl":' + $scope.bilan.fl + ',"fm":' + $scope.bilan.fm + ',"gg1":' + $scope.bilan.gg1 + ',"ga1":' + $scope.bilan.ga1 + ',"hp1":' + $scope.bilan.hp1 + ',"hq1":' + $scope.bilan.hq1 + ',"fl1":' + $scope.bilan.fl1 + ',"fm1":' + $scope.bilan.fm1 + ',"hn":' + $scope.bilan.hn + ',"ga2":' + $scope.bilan.ga2 + ',"hn2":' + $scope.bilan.hn2 + ',"fl2":' + $scope.bilan.fl2 + ',"fm2":' + $scope.bilan.fm2 + ',"dl":' + $scope.bilan.dl + ',"ee":' + $scope.bilan.ee + '}}'
    function createPayloadNotationResult(siren,decoupageSectoriel,typeAiguillage,note,score,orientation,detail){
      var payload = '{'+
      '"dateCalcul":'+ today() +','+
      '"decoupageSectoriel": "'+decoupageSectoriel+'",'+
      '"detail": "'+detail+'",'+
      '"note": "'+note+'",'+
      '"orientation": "'+orientation+'",'+
      '"score": "'+score+'",'+
      '"siren": "'+siren+'",'+
      '"typeAiguillage":"'+typeAiguillage+'"'+
    '}';
    console.log(payload);
    return payload;
    }

    function today(){
      var today = JSON.stringify(new Date());
      return today;
    }
    $scope.startProcess = function () {
      var data_notation = "";
      var startTime = new Date().getTime();
      var elapsedTime = 0;
      $scope.rules = [];
      $scope.notation = [];
      $scope.variables = [];
      var payloadBilan = createPayloadBilan($scope.bilan);
      $http.post(
        calcul_variables_endpoint,
        payloadBilan
      ).then(function (response) {
        $scope.greeting = response.data;
        if (response.status == 200) {
          // approved
          // change label to approved
          $scope.displayResults = "";
          $scope.applicationResult = "Variables Calculées";
          $scope.applicationResultIcon = "pficon pficon-ok";
          // add comment to message
         var payloadNotation = createPayloadNotation($scope.contrepartie.siren,$scope.greeting);
          var payloadResultNotation ="";
          $http.post(
            notation_endpoint,
            payloadNotation).then(function (resp) {
              $scope.res = resp.data;
              console.log($scope.res);
              elapsedTime = new Date().getTime() - startTime;
              var msgTime = "Temps d'execution : " + elapsedTime + " ms";
              var msgContainer = "Version 1.0";
              $scope.version = "Version 1.0"
              $scope.msgTime = elapsedTime;
              var rules = $scope.res.rules;
              var decision_notation = $scope.res.Notation;
              var details = decision_notation.Detail;
              var var_0 = { type: "", valeur: 0, score: 0 };
              var var_1 = { type: "", valeur: 0, score: 0 };
              var_0.type = details[0][1].type;
              var_0.valeur = details[0][1].valeur;
              var_0.score = details[0][0];
              var_1.type = details[1][1].type;
              var_1.valeur = details[1][1].valeur;
              var_1.score = details[1][0];
              var detail = var_0.type + " - " + var_0.valeur + " ; "+ var_1.type + " - " + var_1.score;
              $scope.variables = [var_0, var_1];
              var typeAiguillage = decision_notation.TypeAiguillage;
              var decoupageSectoriel = decision_notation.DecoupageSectoriel;
              if (typeAiguillage != "NON_NOTE") {
                // approved
                console.log("approved");
                // change label to approved
                $scope.displayResults = "";
                $scope.applicationResult = "Noté";
                $scope.applicationResultIcon = "pficon pficon-ok";
                var scoreFinal = decision_notation.Score;
                var note = decision_notation.Note;
                var orientation = decision_notation.Orientation;

                var msgType = "Modèle : " + typeAiguillage;
                var msgDecp = "Découpage : " + decoupageSectoriel;
                var msgScoreFinal = "Score : " + scoreFinal;
                var msgNote = "Note : " + note;
                var msgOrientation = "Orientation : " + orientation;
                $scope.notation = [msgType, msgScoreFinal, msgNote, msgOrientation];

                for (var i = 0; i < rules.length; i++) {
                  $scope.rules.push(rules[i]);
                }
                console.log($scope.applicationResultMessages);
                payloadResultNotation =  createPayloadNotationResult($scope.contrepartie.siren,decoupageSectoriel,typeAiguillage,note,scoreFinal,orientation,detail);               
              } else {
                console.log("rejected");
                // rejected
                // change label to rejected
                $scope.displayResults = "";
                $scope.applicationResult = "Non Noté";
                $scope.applicationResultIcon = "pficon pficon-error-circle-o";
                // add comment to message
                $scope.version = msgContainer;
                $scope.notation = ["Non Elligibile à la notation"];
                $scope.rules.push(rules[0]);
                payloadResultNotation =  createPayloadNotationResult($scope.contrepartie.siren,"0","NON_NOTE","NON_CALCULE","NON_CALCULE","NON_CALCULE","NON_CALCULE");
                //end else 
              }
              $http({
                method: "POST",
                url: ENV.companiesSvc+'/notation/add',
                data: payloadResultNotation,
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(function successCallback(response) {
                console.log("inserted");
              }, function errorCallback(response) {
                console.log("can't insert note  ");
              });
            });
            
            
        }
      });
    }

  })
  .controller("call-process", function ($scope, $http) {
    function payloadBilan(bilan){
      var payload ='{"bilan" : {';
      if(bilan.siren != null) payload+="\"siren\":" + bilan.siren;
      if(bilan.gg != null) payload+=",\"gg\":" + bilan.gg;
      if(bilan.ga != null) payload+=",\"ga\":" + bilan.ga;
      if(bilan.hp != null) payload+=",\"hp\":" + bilan.hp;
      if(bilan.hq != null) payload+=",\"hq\":" + bilan.hq;
      if(bilan.hn != null) payload+=",\"hn\":" + bilan.hn;
      if(bilan.fl != null) payload+=",\"fl\":" + bilan.fl;
      if(bilan.fm != null) payload+=",\"fm\":" + bilan.fm;
      if(bilan.dl != null) payload+=",\"dl\":" + bilan.dl;
      if(bilan.ee != null) payload+=",\"ee\":" + bilan.ee;
      payload+='}}';
      return payload;
    }
    
    
    $scope.runProcess = function () {
      var bilan = payloadBilan($scope.bilan);
      var idProcess = "";
      console.log(bilan);
      $http({
        method: "POST",
        url: ENV.loanUrl + '/loanValidation',
        data: bilan,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function successCallback(response) {
        console.log(response.data);
        idProcess = response.data.id;
      }, function errorCallback(response) {
        console.log("can't insert note  ");
      });
      $http({
        method: 'GET',
        url: ENV.loanUrl + '/loanValidation/'+idProcess
      }).then(function successCallback(response) {
        console.log(response.data);

      }, function errorCallback(response) {
        console.log(response.statusText);
      });
    }
    $scope.searchCompany = function () {
      var search_endpoint = ENV.companiesSvc + '/companies/search/' + $scope.company.id;
      var search_notation_endpoint = ENV.companiesSvc + '/notation/search/' + $scope.company.id;

      $scope.siren = $scope.company.id;
      $http({
        method: 'GET',
        url: search_endpoint
      }).then(function successCallback(response) {
        $scope.company = response.data;
      }, function errorCallback(response) {
        console.log(response.statusText);
      });

      $http({
        method: 'GET',
        url: search_notation_endpoint
      }).then(function successCallback(response) {
        $scope.notations = response.data;
      }, function errorCallback(response) {
        console.log(response.statusText);
      });
    }

    
  })