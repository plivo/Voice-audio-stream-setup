// Example for Call create

var plivo = require('plivo');

(function main() {
    'use strict';
    
   // If auth id and auth token are not specified, Plivo will fetch them from the environment variables.
    var client = new plivo.Client("<auth_id>","<auth_token>");
    client.calls.create(
        "+12025550000", // from
        "+12025551111", // to
        "https://4964-49-37-240-174.ngrok-free.app/xml", // answer url
        {
            answerMethod: "GET",
        },
    ).then(function (response) {
        console.log(response);
    }, function (err) {
        console.error(err);
    });
})();


