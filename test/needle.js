var needle = require('needle');

needle.get('http://blog.codingnow.com', function(err, res) {
        if (!err && res.statusCode == 200)
        console.log(res.body);
        else
        console.log(err);
});
