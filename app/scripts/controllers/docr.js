'use strict';

angular.module('docrjs')
    .controller('ReadingController',
        function($scope, $http) {
            var perLineContent = function(data) {
                return data.split('\n');
            };

            $scope.user = 'angular';
            $scope.repo = 'angular.js';
            $scope.filename = 'lib/versions/version-info.js';
            $scope.stringBuilder = function() {
                return 'https://api.github.com/repos/' + $scope.user + '/' + $scope.repo + '/contents/' + $scope.filename;
            };

            // $scope.go = function() {
            // $http.get($scope.stringBuilder()).success(function(data) {
            // data = atob(data.content);
            $http.get('/scripts/controllers/docr.js').success(function(data) {
                data = data.replace(/</g, '&lt');


                var separateByLine = perLineContent(data);

                var stylize = function(arr) {
                    var active = false;
                    for (var i = 0; i < arr.length; i++) {
                        var lineInfo = {};
                        lineInfo.num = i;
                        var content = arr[i];
                        var newContent = content;

                        if (!active) {
                            if (content.match(/\/\*/) !== null) {
                                active = true;
                            }


                            if (!active) {
                                newContent = newContent.replace(/ /g, '&nbsp');
                                newContent = newContent.replace(/\".*?\"/g, '<span class="quoted">$&</span>');
                                newContent = newContent.replace(/\(|\)|\{|}|\+|\*|\[|]|;|\.|\!\?/g, '<span class="special">$&</span>');
                                newContent = newContent.replace(/\'.*\'/g, '<span class="quoted">$&</span>');
                                newContent = newContent.replace(/(&nbsp|\b)(function|var|if|in|for|else|while|return|this)(\b|&nbsp)/g, '<span class="word">$&</span>');
                                newContent = newContent.replace(/[^\:]\/\/.*/g, '<span class="comment">$&</span>');

                                // newContent = newContent.replace('=(?![^<]*>|[^<>]*<','<span class="special">$&</span>');
                            }
                        }

                        if (active) {
                            newContent = '<span class="comment">' + newContent + '</span>';
                            if (content.match(/\*\//) !== null) {
                                active = false;
                            }
                        }

                        if (newContent.match('<span class="comment">') === null) {
                            lineInfo.code = newContent;
                        } else {
                            lineInfo.comment = newContent;
                        }
                        arr[i] = lineInfo;
                    }

                    var pairingSet = [];
                    var pairing = {
                        comment: [],
                        code: []
                    };
                    var code = false;

                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j].comment) {
                            if (code) {
                                pairingSet.push(pairing);
                                pairing = {
                                    comment: [],
                                    code: []
                                };
                                code = false;
                            }
                            pairing.comment.push({
                                num: arr[j].num,
                                content: arr[j].comment
                            });
                        } else {
                            code = true;
                            pairing.code.push({
                                num: arr[j].num,
                                content: arr[j].code
                            });
                        }
                    }
                    return pairingSet;
                };

                var afterManipulations = stylize(separateByLine);

                $scope.content = afterManipulations;
            });
            // };


        });
