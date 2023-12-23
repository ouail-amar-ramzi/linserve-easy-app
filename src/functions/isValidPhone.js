export default isValidPhone = (phone) => {
    let newPhone = phone;
    while ( newPhone.includes(" ") ) newPhone = newPhone.replace(" ","")
    if ( newPhone.includes("+213") ){
        newPhone = "0" + newPhone.split("+213")[1]
    }
    if ( newPhone.length === 10 ){
        return true
    }
    return false
}