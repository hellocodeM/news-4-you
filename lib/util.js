exports.stripTags = function(content) {
    return content.replace(/<script.*?script>/g, '').replace(/<[^>]*>/g, '');
};
