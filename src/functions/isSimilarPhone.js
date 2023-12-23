export default isSimilarPhone = (phone1, phone2) => {
    let newPhone1 = phone1;
    let newPhone2 = phone2;
    while ( newPhone1.includes(" ") ) newPhone1 = newPhone1.replace(" ","")
    while ( newPhone2.includes(" ") ) newPhone2 = newPhone2.replace(" ","")
    if ( newPhone1 === newPhone2 ) return true
    if ( phone1.includes("+213") ){
        newPhone1 = "0" + phone1.split("+213")[1]
    }
    if ( phone2.includes("+213") ){
        newPhone2 = "0" + phone2.split("+213")[1]
    }
    if ( newPhone1 === newPhone2 ) return true
    return false
}

