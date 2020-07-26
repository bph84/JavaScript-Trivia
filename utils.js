function compareStrings(str1, str2) {
    if (str1.length != str2.length) {
        return str1 + " is " + (str1.length > str2.length ? "longer" : "shorter") + " than " + str2;
    }
    
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] != str2[i]) {
            return "difference in position: " + i;
        }
    }
    return "No difference";
}