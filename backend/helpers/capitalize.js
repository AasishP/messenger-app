function capitalize(str){
    str = str.toLowerCase();
    str=str.replace(str[0], str[0].toUpperCase());
    return str;
}

module.exports = capitalize;