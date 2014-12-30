var needle = require('needle');

needle.get('https://byvoid.com', function(err, res) {
        if (!err && res.statusCode == 200) {
            console.log(typeof res.body);
        }
        else
            console.log(err);
});
