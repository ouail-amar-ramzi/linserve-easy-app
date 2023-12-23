export default isValidOtp = (otp) => {
    if ( otp.length != 6 ){
        return false
    }
    for ( let i = 0 ; i < otp.length ; i++ ){
        if ( ! "1234567890".includes(otp[i]) ){
            return false
        }
    }
    return true
}